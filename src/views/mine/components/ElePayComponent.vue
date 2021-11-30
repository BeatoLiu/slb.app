<template>
	<div class="pay-result">
		<Popup v-model:show="show" position="bottom" round :close-on-click-overlay="false">
			<p class="pop-close"><Icon name="cross" color="999" @click="close" /></p>
			<!-- <br/> -->
			<p style="text-align: center">请选择支付方式</p>
			<RadioGroup v-model="radio" @change="radioChange">
				<CellGroup>
					<Cell v-for="item in payTypeList" :key="item.value" :title="item.label" center clickable>
						<template #icon>
							<img class="img-icon" :src="item.imgSrc" />
						</template>
						<template #right-icon>
							<Radio :name="item.value" :disabled="item.dis">
								<!-- <template #icon>
                                    <img class="img-icon" :src="item.imgSrc"/>
                                </template> -->
							</Radio>
						</template>
					</Cell>
				</CellGroup>
			</RadioGroup>
			<div style="text-align: center">
				<Button size="normal" class="btn" color="#ED0C17" :loading="payLoding" @click="toPay">立即付款</Button>
			</div>
		</Popup>
		<!-- 銀行卡轉賬時，銀行卡信息 -->
		<BankCard biz="申请节点" v-model:show="showCard" :valueCode="mCode" @close="closeDialog"></BankCard>
		<!-- 支付二维码 -->
		<div id="qr" class="qr-img" ref="content" hidden>
			<vue-qr :logoSrc="imageUrl" :text="qrText" :size="260" :margin="5" :dotScale="1" :logoScale="16"></vue-qr>
			<p>请用{{ payTypeName }}扫码支付</p>
		</div>
		<van-image-preview v-model:show="showQr" :images="images">
			<template #index>请用{{ payTypeName }}扫码支付</template>
		</van-image-preview>
	</div>
</template>

<script>
import { computed, defineComponent, ref, toRefs } from 'vue'
import { Popup, Button, RadioGroup, Radio, Cell, CellGroup, Icon, ImagePreview, Toast } from 'vant'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import BankCard from '../../../components/BankCard'
import scImg from '../../../assets/img/payLogo/sc.png'
import alipayImg from '../../../assets/img/payLogo/zhifubao.png'
import wxImg from '../../../assets/img/payLogo/weixin.png'
import bankImg from '../../../assets/img/payLogo/rmb.png'

import { nodePayProxy } from '../../../apis/mem'
export default defineComponent({
	name: 'elePayComponent',
	components: {
		Popup,
		Button,
		RadioGroup,
		Radio,
		Cell,
		CellGroup,
		Icon,
		[ImagePreview.Component.name]: ImagePreview.Component,
		VueQr,
		BankCard
	},
	props: {
		poCode: {
			type: [Number, String],
			default: null
		},
		podCode: {
			type: [Number, String],
			default: null
		},
		mCode: {
			type: [Number, String],
			default: ''
		},
		show: {
			type: Boolean,
			default: true
		},
		cRecPayType: {
			type: Number,
			default: ''
		}
	},
	setup(props, { emit }) {
		const { show, mCode } = toRefs(props)
		const payLoding = ref(false)
		const payType = ref([
			{
				value: 'susd',
				label: 'SUSD',
				imgSrc: scImg,
				dSubCode: '7',
				mRoleStr: '12,13',
				ishow: false,
				dis: false
			},
			{
				value: 'usdt',
				label: 'USDT',
				imgSrc: scImg,
				dSubCode: '10',
				mRoleStr: '12,13',
				ishow: false,
				dis: false
			},
			{ value: 'alipay', label: '支付宝', dSubCode: '1', imgSrc: alipayImg, mRoleStr: '13', ishow: true, dis: false },
			{ value: 'wx', label: '微信', dSubCode: '1', imgSrc: wxImg, mRoleStr: '13', ishow: true, dis: false },
			{
				value: 'bank',
				label: '银行卡转账',
				dSubCode: '2',
				imgSrc: bankImg,
				mRoleStr: '12,13',
				ishow: true,
				dis: false
			}
		])
		const radio = ref('')
		const payTypeName = ref('') // 支付名称
		const qrText = ref('')
		const imageUrl = ref(alipayImg)
		const images = ref([])
		const showQr = ref(false)
		const showCard = ref(false)

		const payTypeList = computed(() => {
			let str = props.cRecPayType || '12'
			return payType.value.filter(item => item.ishow && item.mRoleStr.indexOf(str) > -1)
		})

		const close = () => {
			emit('close', false)
		}
		const radioChange = () => {
			if (radio.value === 'alipay') {
				payTypeName.value = '支付宝'
				imageUrl.value = alipayImg
			} else if (radio.value === 'wx') {
				payTypeName.value = '微信'
				imageUrl.value = wxImg
			}
		}
		const payResult = res => {
			if (res.resultCode >= 1) {
				if (res.msg === '成功' && (radio.value === 'sc' || radio.value === 'susd' || radio.value === 'usdt')) {
					let params = res.data
					const payParams = {
						coin: params.coin,
						amount: params.amount,
						app_id: params.app_id,
						trade_no: params.trade_no,
						merchant_uuid: '1ac2f3cd-1e05-4794-90a4-589c89162d17',
						merchant_id: 'zhanshi',
						remark: '节点申请'
					}
					sc.payment(payParams, res1 => {
						if (res1.code === 200) {
							$router.replace({ name: 'payResult', query: { id: poCode, type: 'new' } })
						}
					})
				} else {
					qrText.value = res.data
					// 不知道怎么处理 ImagePreview 和 VueQr 的异步问题，只好延迟执行了
					setTimeout(() => {
						let div = document.getElementById('qr')
						let imgUrl = div.getElementsByTagName('img')[0] // 获取二维码
						images.value = [imgUrl.src]
						showQr.value = true
					}, 500)
				}
			}
		}
		const toPay = () => {
			// console.log(payTypeList.value.filter(item => item.value === radio.value))
			if (!radio.value) {
				return Toast('未选择支付方式！')
			}
			if (radio.value === 'bank') {
				showCard.value = true
			} else {
				let params1 = {
					payPlat: radio.value === 'susd' || radio.value === 'usdt' ? 'sc' : radio.value, // 支付平台
					// 支付方式
					payType: payTypeList.value.filter(item => item.value === radio.value)[0].dSubCode,
					mCode: mCode.value,
					// poCode: poCode, // 订单编号, 第一次生成订单
					// podCode: podCode, // 订单编号，订单列表和订单详情中
					// memSecretOpenid: localStorage.openId
					remark: '节点申请'
				}
				payLoding.value = true
				nodePayProxy(params1)
					.then(res => {
						payResult(res)
						payLoding.value = false
					})
					.catch(err => {
						payLoding.value = false
					})
			}
		}
		const closeDialog = () => {
			showCard.value = false
		}

		return {
			show,
			payTypeList,
			radio,
			payTypeName,
			qrText,
			imageUrl,
			images,
			showQr,
			showCard,
			payLoding,
			close,
			radioChange,
			toPay,
			closeDialog
		}
	}
	// data() {
	// 	return {
	// 		payLoding: false,
	// 		payType: [
	// 			{
	// 				value: 'susd',
	// 				label: 'SUSD',
	// 				imgSrc: scImg,
	// 				dSubCode: '7',
	// 				mRoleStr: '12,13',
	// 				ishow: true,
	// 				dis: false
	// 			},
	// 			{
	// 				value: 'usdt',
	// 				label: 'USDT',
	// 				imgSrc: scImg,
	// 				dSubCode: '10',
	// 				mRoleStr: '12,13',
	// 				ishow: true,
	// 				dis: false
	// 			},
	// 			{ value: 'alipay', label: '支付宝', dSubCode: '1', imgSrc: alipayImg, mRoleStr: '13', ishow: true, dis: false },
	// 			{ value: 'wx', label: '微信', dSubCode: '1', imgSrc: wxImg, mRoleStr: '13', ishow: true, dis: false },
	// 			{
	// 				value: 'bank',
	// 				label: '银行卡转账',
	// 				dSubCode: '2',
	// 				imgSrc: bankImg,
	// 				mRoleStr: '12,13',
	// 				ishow: true,
	// 				dis: false
	// 			}
	// 		],
	// 		radio: '', // process.env.VUE_APP_ENV !== 'production' ? 'sc' : 'alipayImg',
	// 		payTypeName: null, // 支付名称
	// 		qrText: 'null',
	// 		imageUrl: alipayImg,
	// 		images: [],
	// 		showQr: false,
	// 		showCard: false,
	// 		showSUSDCard: false
	// 	}
	// },
	// computed: {
	// 	payTypeList() {
	// 		let str = $props.cRecPayType || '12'
	// 		return this.payType.filter(item => item.ishow && item.mRoleStr.indexOf(str) > -1)
	// 	}
	// },
	// methods: {
	// 	radioChange(val) {
	// 		// console.log(val)
	// 		if (this.radio === 'alipay') {
	// 			this.payTypeName = '支付宝'
	// 			this.imageUrl = alipay
	// 		} else if (this.radio === 'wx') {
	// 			this.payTypeName = '微信'
	// 			this.imageUrl = wxImg
	// 		}
	// 	},
	// 	toPay() {
	// 		if (!this.radio) {
	// 			return Toast('未选择支付方式！')
	// 		}
	// 		if (this.radio === 'bank') {
	// 			this.showCard = true
	// 		} else {
	// 			let params1 = {
	// 				payPlat: this.radio === 'susd' || this.radio === 'usdt' ? 'sc' : this.radio, // 支付平台
	// 				// 支付方式
	// 				payType: this.payTypeList.filter(item => item.value === this.radio)[0].dSubCode,
	// 				mCode: this.mCode,
	// 				// poCode: this.poCode, // 订单编号, 第一次生成订单
	// 				// podCode: this.podCode, // 订单编号，订单列表和订单详情中
	// 				// memSecretOpenid: localStorage.openId
	// 				remark: ''
	// 			}
	// 			this.payLoding = true
	// 			// if(!this.podCode) {
	// 			this.$api.pay
	// 				.nodePayProxy(params1)
	// 				.then(res => {
	// 					this.payResult(res, this.poCode)
	// 					this.payLoding = false
	// 				})
	// 				.catch(err => {
	// 					this.payLoding = false
	// 				})
	// 			// } else {
	// 			//     this.$api.order.mallPayOnlineDetail(params1).then(res => {
	// 			//         this.payResult(res, this.poCode)
	// 			//         this.payLoding = false
	// 			//     }).catch(err => {
	// 			//         this.payLoding = false
	// 			//     })
	// 			// }
	// 		}
	// 	},
	// 	payResult(res, poCode) {
	// 		if (res.resultCode >= 1) {
	// 			if (res.msg === '成功' && (this.radio === 'sc' || this.radio === 'susd' || this.radio === 'usdt')) {
	// 				let params = res.data
	// 				const payParams = {
	// 					coin: params.coin,
	// 					amount: params.amount,
	// 					app_id: params.app_id,
	// 					trade_no: params.trade_no,
	// 					merchant_uuid: '1ac2f3cd-1e05-4794-90a4-589c89162d17',
	// 					merchant_id: 'zhanshi',
	// 					remark: '节点申请'
	// 				}
	// 				console.log(payParams)
	// 				sc.payment(payParams, res1 => {
	// 					if (res1.code === 200) {
	// 						this.$router.replace({ name: 'payResult', query: { id: poCode, type: 'new' } })
	// 					}
	// 				})
	// 			} else {
	// 				this.qrText = res.data
	// 				// 不知道怎么处理 ImagePreview 和 VueQr 的异步问题，只好延迟执行了
	// 				setTimeout(() => {
	// 					this.$nextTick(() => {
	// 						let div = document.getElementById('qr')
	// 						let imgUrl = div.getElementsByTagName('img')[0] // 获取二维码
	// 						this.images = [imgUrl.src]
	// 						this.showQr = true
	// 					})
	// 				}, 500)
	// 			}
	// 		}
	// 	},
	// 	// 关闭dialog
	// 	closeDialog(val) {
	// 		this.showCard = val
	// 	},
	// 	// 关闭pop
	// 	close() {
	// 		this.$emit('close', false)
	// 	}
	// }
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.pay-result {
	.img-icon {
		margin-right: 20 * @fontSize;
		height: 100%;
	}
	.btn {
		font-size: 30 * @fontSize;
		margin: 20 * @fontSize 0;
		display: inline-block;
		width: 600 * @fontSize;
		line-height: 80 * @fontSize;
		border-radius: 12 * @fontSize;
		background: #ed0c17;
		color: #fff;
	}
	.pop-close {
		text-align: right;
		margin-right: 40 * @fontSize;
		margin-top: 40 * @fontSize;
		i {
			color: #000;
		}
	}
	.qr-img {
		text-align: center;
	}
	.copy {
		text-align: center;
		color: #07c160;
		font-size: 16px;
	}
}
</style>
