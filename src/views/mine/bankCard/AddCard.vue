<template>
	<div class="login">
		<div class="login-cont">
			<CellGroup>
				<div class="flex-space img-item">
					<p>卡照</p>
					<Uploader v-model="imgList" :after-read="afterRead" upload-text="卡正面照" :max-count="1" />
					<Button
						type="primary"
						:disabled="!imgList.length || imgMsg !== '上传'"
						:loading="imgIsLoading"
						@click="upload"
						>{{ imgMsg }}</Button
					>
				</div>
				<Field v-model="mccCard" center clearable type="digit" label="卡号" placeholder="银行卡卡号"> </Field>
				<Field
					v-model="mccBankName"
					label="银行"
					placeholder="发卡银行"
					right-icon="arrow"
					readonly
					@click="showBankListPop = true"
				/>
				<Field v-model="mccCardName" clearable label="姓名" placeholder="持卡人姓名" />
			</CellGroup>
			<div class="page-tips">
				<p class="title">温馨提示：</p>
				<div>
					<p>1、若提示图片过大，可用手机截图重新上传</p>
					<p>2、若卡号识别失败，可手动输入</p>
				</div>
			</div>
			<!-- <input type="file" /> -->
			<Button class="btn" @click="toSign" :disabled="!dis">提 交</Button>
		</div>
		<!-- 银行卡 -->
		<Popup v-model:show="showBankListPop" position="top">
			<div class="bank-list">
				<p class="title">银行选择</p>
				<Search
					v-model="keywords"
					shape="round"
					placeholder="请输入银行名称"
					clearable
					@input="filterBank"
				></Search>
				<CellGroup>
					<Cell
						v-for="item in bankList"
						:key="item.biCode"
						:title="item.biName"
						@click=";(mccBankName = item.biName), (mccBankId = item.bankId), (showBankListPop = false)"
					>
					</Cell>
				</CellGroup>
			</div>
		</Popup>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { Popup, CellGroup, Cell, Search, Button, Field, Uploader, Toast } from 'vant'

import { useUploadImg } from '@/hooks/web/useUploadImg'
import { useImgPath } from '@/hooks/mx/useImgPath'

import { IAddCreditCardModel, IShowBankListItem } from '@/apis/model/bankCardModel'
import { addCreditCard, updateCreditCard, showBankList, getCreditCardByMccCode } from '@/apis/bankCard'

export default defineComponent({
	name: 'AddCard',
	components: { Popup, CellGroup, Cell, Search, Button, Field, Uploader },
	setup() {
		const { imgPath } = useImgPath()
		const { uploadImg } = useUploadImg()
		const { currentRoute, replace } = useRouter()
		const id = currentRoute.value.query.id
		const params = reactive<IAddCreditCardModel>({
			mccCardName: '',
			mccBankName: '',
			mccCard: '',
			mccBankId: '',
			mccCardImgUrl: '',
			mccCardType: 1
		})
		const dis = computed(() => {
			return params.mccCardName.length > 1 && params.mccBankName && params.mccCard && params.mccCardImgUrl
		})

		const toSign = () => {
			// console.log(currentRoute)

			if (id) {
				updateCreditCard({ ...params, mccCode: +id }).then(res => {
					if (res.resultCode === 1) {
						Toast('修改成功！')
						// localStorage.bindPhone = this.phone
						replace({ name: 'BankCard' })
					}
				})
			} else {
				addCreditCard(params).then(res => {
					if (res.resultCode === 1) {
						// if (this.fromName === 'yiDuoBaoPayment') {
						// 	this.$router.replace({ name: 'yiDuoBaoPayment', query: { mccCode: res.data.mccCode } })
						// } else {
						Toast('新增成功！')
						replace({ name: 'BankCard' })
						// }
					}
				})
			}
		}
		// 上傳圖片相關
		const imgMsg = ref('上传')
		// 圖片
		const imgList = ref<any>([])
		// 上傳狀態
		const imgIsLoading = ref(false)

		const afterRead = () => {
			imgMsg.value = '上传'
			imgIsLoading.value = false
		}
		// 上傳圖片
		const upload = async () => {
			const file = imgList.value[0].file
			const formData = new FormData()
			imgMsg.value = '上传中'
			const res = await uploadImg(file, 'ocr/bankCard', formData)
			if (res.resultCode === 1) {
				imgMsg.value = '上传完成'
				imgIsLoading.value = true
				params.mccCardImgUrl = res.data.image
				res.data.bankCardNumber && (params.mccCard = res.data.bankCardNumber)
			} else {
				imgMsg.value = '上传失败'
			}
			imgIsLoading.value = false
		}
		// 选择银行相关

		const showBankListPop = ref(false)
		const keywords = ref('')
		const bankList = ref<IShowBankListItem[]>([])
		const dataList = ref<IShowBankListItem[]>([])
		// 銀行卡列表
		const getBankList = () => {
			showBankList({ biType: 1 }).then(res => {
				if (res.resultCode === 1) {
					bankList.value.push(...res.data.dataIn)
					dataList.value = res.data.dataIn
				}
			})
		}
		const filterBank = () => {
			bankList.value = dataList.value.filter(item => item.biName.indexOf(keywords.value) > -1)
		}
		onMounted(() => {
			if (id) {
				getCreditCardByMccCode({ mccCode: +id }).then(res => {
					if (res.resultCode === 1) {
						params.mccBankName = res.data.mccBankName
						params.mccCard = res.data.mccCard
						params.mccCardName = res.data.mccCardName
						params.mccBankId = res.data.mccBankId
						params.mccCardImgUrl = res.data.mccCardImgUrl
						res.data.mccCardImgUrl && imgList.value.push({ url: imgPath(res.data.mccCardImgUrl) })
					}
				})
			}
			getBankList()
		})
		return {
			...toRefs(params),
			dis,
			toSign,
			imgMsg,
			imgList,
			imgIsLoading,
			afterRead,
			upload,
			showBankListPop,
			keywords,
			bankList,
			filterBank
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.login {
	// box-sizing: border-box;
	.login-cont {
		box-sizing: border-box;
		// height: calc(100vh - 46px);
		padding: 20 * @fontSize 0;
		text-align: center;
		// background: #fff;
		.input {
			position: relative;
			padding-top: 140 * @fontSize;
			input {
				width: 100%;
				margin-top: 70 * @fontSize;
				padding: 12 * @fontSize;
				border-bottom: 1px solid #ccc;
			}
			span {
				position: absolute;
				right: 0;
				bottom: 10 * @fontSize;
				padding: 0 10 * @fontSize;
				color: #ccc;
				line-height: 40 * @fontSize;
				border: 1px solid #ccc;
				border-radius: 20 * @fontSize;
			}
		}
		.btn {
			display: inline-block;
			width: calc(100% - 32px);
			margin-top: 50 * @fontSize;
			color: #fff;
			font-size: 30 * @fontSize;
			line-height: 80 * @fontSize;
			background: #e7283b;
			border-radius: 10 * @fontSize;
		}
	}
	.img-item {
		margin-top: 20 * @fontSize;
		padding: 10px 16px;
		& > p {
			width: 150 * @fontSize;
			margin-bottom: 8px;
			color: #646566;
			text-align: left;
		}

		& > button {
			margin-bottom: 8px;
		}
	}
	.bank-list {
		.title {
			margin-top: 90px;
			font-size: 36 * @fontSize;
			text-align: center;
		}
	}
	.page-tips {
		text-align: left;
	}
}
</style>
