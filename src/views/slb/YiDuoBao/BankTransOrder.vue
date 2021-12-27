<template>
	<div class="bank-order-list">
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<!-- <div class="title">为你推荐</div> -->
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<div v-for="(item, idx) in dataList" :key="item.orderCode">
						<p>{{ item.mName }}【{{ item.orderBizTypeName }}】</p>
						<div class="flex-space">
							<p>订单编号：{{ item.orderCode }}</p>
							<p>
								金额：{{ item.orderPayFactSum
								}}{{ item.orderPayTypeName === '现金' ? 'USDT' : item.orderPayTypeName }}
							</p>
						</div>
						<div class="flex-space">
							<p>支付状态：{{ item.orderPayStatusName }}</p>
							<p>{{ item.createTime }}</p>
						</div>
						<div class="flex-space">
							<div>
								<p v-if="item.moneyProve" style="color: #19be6b">已上传转账凭证</p>
								<p>支付平台：{{ item.orderPlat }}</p>
							</div>
							<div>
								<Button
									type="primary"
									size="small"
									round
									block
									@click="showUpload(item, idx)"
									v-if="item.orderPayStatus === 0 && item.orderPlat === 'ums'"
									>转账凭证</Button
								>
								<div
									class="flex-space biztype-func"
									v-if="item.orderPayStatus === 2 && olderTime(item.createTime)"
								>
									<p>是否续期：</p>
									<van-switch
										:model-value="item.autoFlag"
										size="20px"
										:active-value="0"
										:inactive-value="1"
										@update:model-value="() => onInput(item)"
									/>
								</div>
							</div>
						</div>
					</div>
				</List>
			</div>
		</PullRefresh>
		<!-- <Calendar
			allow-same-day
			v-model:show="showTime"
			:min-date="minDate"
			:max-date="maxDate"
			type="range"
			@confirm="onConfirm"
		/> -->
		<!-- 上传凭证 -->
		<van-dialog v-model:show="showUploadDialog" title="上传凭证" :show-confirm-button="false">
			<div class="flex-start img-item">
				<!-- :after-read="afterRead" -->
				<p>转账凭证</p>
				<Uploader v-model="imgList" :after-read="afterRead" upload-text="选择图片" :max-count="1" />
			</div>
			<div class="page-tips">
				<p class="title">温馨提示：</p>
				<div>
					<p>以<strong>银行卡转账</strong>方式付款的，需在此处上传转账凭证</p>
				</div>
			</div>
			<Cell center>
				<template #default>
					<div class="van-hairline--top van-dialog__footer">
						<Button
							class="van-button van-button--default van-button--large van-dialog__cancel"
							@click="showUploadDialog = false"
						>
							取消
						</Button>
						<Button
							class="van-button van-button--default van-button--large van-dialog__confirm"
							:disabled="!imgList.length || imgMsg !== '上传'"
							:loading="imgIsLoading"
							@click="upload"
						>
							{{ imgMsg }}
						</Button>
					</div>
					<!-- <div class="copy" id="logNumber">{{imgMsg}}</div> -->
				</template>
			</Cell>
		</van-dialog>
	</div>
</template>

<script lang="ts">
// !這個文件和PayForSUSD下的同名文件，有很多能複用的地方。有空的時候再改
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { PullRefresh, List, Button, Cell, Uploader, Switch, Dialog } from 'vant'
import { IShowPayOrderListByMemCodeItem, IShowPayOrderListModel } from '@/apis/model/slbModel'
import { updateMemberWJSConfirmLazyFlag } from '@/apis/slb'

import { usePullRefreshPageList } from '@/hooks/web/usePullRefreshPageList'
import { useUploadImg } from '@/hooks/web/useUploadImg'
import { useImgPath } from '@/hooks/mx/useImgPath'
export default defineComponent({
	name: 'bankTransOrderYDB-alive',
	components: {
		Button,
		Uploader,
		Cell,
		List,
		PullRefresh,
		[Switch.name]: Switch,
		[Dialog.Component.name]: Dialog.Component
	},
	setup() {
		const { imgPath } = useImgPath()
		const { uploadImg } = useUploadImg()
		// 顯示上傳圖片
		const showUploadDialog = ref(false)
		const imgMsg = ref('上传')
		// 圖片
		const imgList = ref<any>([{ url: '' }])
		// 上傳狀態
		const imgIsLoading = ref(false)
		const idx = ref(0)
		const orderCode = ref(0)
		const params = reactive<IShowPayOrderListModel>({
			pageSize: 10,
			pageNum: 0,
			startTime: '',
			endTime: '',
			orderPayStatus: -1,
			orderBizTypeList: [28, 29, 30]
		})
		onMounted(() => {
			const end = new Date()
			const start = new Date('2021/08/01')
			params.startTime = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
			params.endTime = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate() + ' 23:59:59'
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = usePullRefreshPageList<
			IShowPayOrderListByMemCodeItem,
			IShowPayOrderListModel
		>('mg/slpay/showPayOrderListApp', params, { method: 'POST' })

		const afterRead = () => {
			imgMsg.value = '上传'
			imgIsLoading.value = false
		}
		const upload = async () => {
			const file = imgList.value[0].file
			const formData = new FormData()
			formData.append('orderCode', orderCode.value + '')
			const res = await uploadImg(file, 'mg/slpay/uploadPayOrderMoneyProve', formData)
			if (res.resultCode === 1) {
				imgMsg.value = '上传完成'
				dataList.value[idx.value].moneyProve = res.data
				showUploadDialog.value = false
			} else {
				imgMsg.value = '上传失败'
			}
			imgIsLoading.value = false
		}
		const showUpload = (item: IShowPayOrderListByMemCodeItem, index: number) => {
			showUploadDialog.value = true
			orderCode.value = item.orderCode
			if (item.moneyProve) {
				imgList.value[0] = { url: imgPath(item.moneyProve) }
			} else {
				imgList.value = []
			}
			idx.value = index
		}
		const onInput = (item: IShowPayOrderListByMemCodeItem) => {
			const autoFlag = item.autoFlag === 1 ? 0 : 1
			Dialog.confirm({
				title: '提醒',
				message: '是否要修改续期？'
			}).then(() => {
				updateMemberWJSConfirmLazyFlag({ orderCode: item.orderCode, autoFlag }).then(res => {
					if (res.resultCode === 1) {
						item.autoFlag = autoFlag
					}
				})
			})
		}
		// 是否一期
		const olderTime = (createTime: string) => {
			createTime = createTime.replace(/-/g, '/')
			// console.log(createTime)
			const older = new Date(createTime)
			const now = new Date('2021/09/17 00:00:00')
			// console.log(older < now)
			return older < now
		}
		return {
			showUploadDialog,
			imgList,
			imgMsg,
			imgIsLoading,
			idx,
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			afterRead,
			upload,
			showUpload,
			onInput,
			olderTime
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.bank-order-list {
	.top {
		height: 100 * @fontSize;
		color: #fff;
		text-align: center;
		background-color: #fc3e38;
		.balance {
			margin-left: 50 * @fontSize;
		}
		.withdraw {
			margin-right: 50 * @fontSize;
		}
		.time {
			padding: 10px 0;
			color: #fff;
			background-color: transparent;
			// margin-top: 40 * @fontSize;
		}
	}
	.van-list {
		& > div {
			margin-top: 20 * @fontSize;
			padding: 20 * @fontSize;
			background: #fff;
			p {
				padding: 10 * @fontSize 0;
				color: #999;
			}
			& > p:nth-child(1) {
				color: #000;
				font-size: 32 * @fontSize;
				border-bottom: 1px solid #f4f4f4;
			}
		}
	}
	.img-item {
		padding-top: 20 * @fontSize;
		border-top: 1px solid #ebedf0;
		border-bottom: 1px solid #ebedf0;
		p {
			margin-right: 40 * @fontSize;
		}
	}
}
</style>
