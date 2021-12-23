<template>
	<div class="bank-order-list">
		<Sticky :offset-top="offSetTop">
			<div class="top">
				<div class="flex-space" style="padding-top: 10px"></div>
				<div class="time flex-space" @click="showTime = true">
					<div class="balance">选择日期区间</div>
					<div class="withdraw">{{ dateDisplay }}</div>
				</div>
			</div>
		</Sticky>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<!-- <div class="title">为你推荐</div> -->
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<div v-for="(item, idx) in dataList" :key="item.orderCode">
						<p>{{ item.mName }}【{{ item.orderBizTypeName }}】</p>
						<div class="flex-space">
							<p>订单编号：{{ item.orderCode }}</p>
							<p>金额：{{ item.orderPayFactSum }}元</p>
						</div>
						<div class="flex-space">
							<p>支付状态：{{ item.orderPayStatusName }}</p>
							<!-- <p>应得：{{ item.orderPayFactSum }}</p> -->
							<p>{{ item.createTime }}</p>
						</div>
						<div class="flex-space">
							<div>
								<p v-if="item.moneyProve">已上传转账凭证</p>
								<!-- <p>审核状态：{{ item.mAuditStatusDesc }}</p> -->
							</div>
							<div v-if="item.orderPayStatus === 0">
								<Button type="primary" size="small" round @click="showUpload(item, idx)"
									>转账凭证</Button
								>
							</div>
						</div>
					</div>
				</List>
			</div>
		</PullRefresh>
		<Calendar
			allow-same-day
			v-model:show="showTime"
			:min-date="minDate"
			:max-date="maxDate"
			type="range"
			@confirm="onConfirm"
		/>
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
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { Sticky, PullRefresh, List, Button, Cell, Calendar, Uploader, Dialog } from 'vant'
import { IShowPayOrderListByMemCodeItem, IShowPayOrderListByMemCodeModel } from '@/apis/model/slbModel'
import { usePullRefreshPageList } from '@/hooks/web/usePullRefreshPageList'
import { useUploadImg } from '@/hooks/web/useUploadImg'
import { useImgPath } from '@/hooks/mx/useImgPath'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'
import { useTimeParam } from '@/hooks/web/useTimeParam'

export default defineComponent({
	name: 'BankTransOrderSUSD-alive',
	components: {
		Button,
		Calendar,
		Uploader,
		Cell,
		List,
		PullRefresh,
		Sticky,
		[Dialog.Component.name]: Dialog.Component
	},
	setup() {
		const { imgPath } = useImgPath()
		const { uploadImg } = useUploadImg()
		const { offSetTop } = useOffSetTop(2)
		const { getTimeParams, getFormatTime } = useTimeParam()
		// 顯示上傳圖片
		const showUploadDialog = ref(false)
		const imgMsg = ref('上传')
		// 圖片
		const imgList = ref<any>([{ url: '' }])
		// 上傳狀態
		const imgIsLoading = ref(false)
		const dateDisplay = ref('')
		const showTime = ref(false)
		const minDate = ref(new Date('2020/11/1'))
		const maxDate = ref(new Date())
		const idx = ref(0)
		const orderCode = ref(0)
		const params = reactive<IShowPayOrderListByMemCodeModel>({
			pageSize: 10,
			pageNum: 0,
			startTime: '',
			endTime: ''
		})
		onMounted(() => {
			const { startTime, endTime, timeStr } = getTimeParams(6, true)
			dateDisplay.value = timeStr
			params.startTime = startTime
			params.endTime = endTime
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = usePullRefreshPageList<
			IShowPayOrderListByMemCodeItem,
			IShowPayOrderListByMemCodeModel
		>('mg/slpay/showPayOrderListByMemCodeApp', params, { method: 'POST' })

		// 選擇時間
		const onConfirm = (date: Date[]) => {
			showTime.value = false
			const [start, end] = date
			const { startTime, endTime, timeStr } = getFormatTime(start, end, true)
			dateDisplay.value = timeStr
			params.startTime = startTime
			params.endTime = endTime
			params.pageNum = 0
			loading.value = true
			finished.value = false
			onRefresh()
		}
		const afterRead = () => {
			imgMsg.value = '上传'
			imgIsLoading.value = false
		}
		// 上傳圖片
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
		// 喚起上傳modal
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
		return {
			dateDisplay,
			showTime,
			minDate,
			maxDate,
			showUploadDialog,
			imgList,
			imgMsg,
			imgIsLoading,
			idx,
			offSetTop,
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			onConfirm,
			afterRead,
			upload,
			showUpload
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
		background-color: #5cc8b8;
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
