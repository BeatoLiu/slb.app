<template>
	<div class="ele-list">
		<div v-for="item in dataList" :key="item.mCode">
			<p>{{ item.mName }}【{{ item.rName }}】</p>
			<div class="flex-space">
				<p>联系人：{{ item.mLinkName }}</p>
				<p>{{ item.mMobile }}</p>
			</div>
			<div class="flex-space">
				<div>
					<p>节点编号：{{ item.mCode }}</p>
					<p>审核状态：{{ item.mAuditStatusDesc }}</p>
				</div>
				<!--  v-if="item.mAuditStatus === 5" -->
				<div>
					<Button type="primary" size="small" round @click="showPay(item)">节点付款</Button>
					<Button type="success" size="small" round @click="showUpload(item)">转账凭证</Button>
				</div>
			</div>
		</div>
		<!-- 支付组件 -->
		<ElePayComponent :show="show" :mCode="mCode" :cRecPayType="cRecPayType || 1" @close="close" />
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
					<p>1、以<strong>银行卡转账</strong>方式付款的，需在此处上传转账凭证</p>
					<p>2、其它付款方式，在“节点付款”中选择相应支付方式即可，无需上传凭证</p>
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
import { defineComponent, onMounted, ref } from 'vue'
import { Button, Uploader, Cell, Dialog } from 'vant'

import ElePayComponent from './components/ElePayComponent.vue'

import { getMerchantList } from '@/apis/mem'
import { IGetMerchantListItem } from '@/apis/model/memModel'
import { useImgPath } from '@/hooks/mx/useImgPath'
import { useUploadImg } from '@/hooks/web/useUploadImg'

export default defineComponent({
	name: 'EleList',
	components: { Button, Uploader, Cell, [Dialog.Component.name]: Dialog.Component, ElePayComponent },
	setup() {
		const { imgPath } = useImgPath()
		const { uploadImg } = useUploadImg()
		// 是否顯示支付
		const show = ref(false)
		// 顯示上傳圖片
		const showUploadDialog = ref(false)
		const imgMsg = ref('上传')
		// 圖片
		const imgList = ref<any>([])
		// 上傳狀態
		const imgIsLoading = ref(false)
		// 節點類型，用以過濾支付方式
		const cRecPayType = ref(0)
		const mCode = ref(0)
		const dataList = ref<IGetMerchantListItem[]>([])
		const getMerchant = () => {
			getMerchantList().then(res => {
				if (res.resultCode === 1) {
					dataList.value.push(...res.data)
				}
			})
		}
		const close = (val: boolean) => {
			// console.log(val)
			show.value = val
		}
		const showPay = (item: IGetMerchantListItem) => {
			show.value = true
			mCode.value = item.mCode
			cRecPayType.value = item.mRole
		}
		// 喚起上傳轉賬憑證modal
		const showUpload = (item: IGetMerchantListItem) => {
			showUploadDialog.value = true
			mCode.value = item.mCode
			if (item.mMoneyProve) {
				imgList.value[0] = { url: imgPath(item.mMoneyProve) }
			} else {
				imgList.value = []
			}
		}
		const afterRead = () => {
			imgMsg.value = '上传'
			imgIsLoading.value = false
		}
		// 上傳圖片
		const upload = async () => {
			const file = imgList.value[0].file
			const formData = new FormData()
			formData.append('mCode', mCode.value + '')
			imgMsg.value = '上传中'
			const res = await uploadImg(file, 'mg/merchant/uploadMoneyProve', formData)
			if (res.resultCode === 1) {
				imgMsg.value = '上传完成'
				imgIsLoading.value = true
				showUploadDialog.value = false
			} else {
				imgMsg.value = '上传失败'
			}
			imgIsLoading.value = false
		}
		onMounted(() => {
			getMerchant()
		})
		return {
			show,
			cRecPayType,
			mCode,
			showUploadDialog,
			imgList,
			imgIsLoading,
			imgMsg,
			dataList,
			close,
			showPay,
			showUpload,
			afterRead,
			upload
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.ele-list {
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
