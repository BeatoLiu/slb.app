<template>
	<div class="pay-result">
		<Popup v-model:show="show" position="bottom" round :close-on-click-overlay="false">
			<p class="pop-close"><Icon name="cross" @click="close" /></p>
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
		<!-- 支付二维码 -->
		<div id="qr" class="qr-img" ref="content" hidden>
			<VueQr :logoSrc="imageUrl" :text="qrText" :size="260" :margin="5" :dotScale="1" :logoScale="16"></VueQr>
			<p>请用{{ payTypeName }}扫码支付</p>
		</div>
		<van-image-preview v-model:show="showQr" :images="images">
			<template #index>请用{{ payTypeName }}扫码支付</template>
		</van-image-preview>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
import { Popup, RadioGroup, CellGroup, Cell, Radio, Button, Icon, ImagePreview, Toast } from 'vant'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'

import scImg from '../../../assets/img/payLogo/sc.png'
import alipayImg from '../../../assets/img/payLogo/zhifubao.png'
import wxImg from '../../../assets/img/payLogo/weixin.png'
import piImg from '../../../assets/img/payLogo/pi.png'
import { baseResT } from '../../../apis/model/base'
import { isIOSorANDROID } from '../../../utils'
import { useRouter } from 'vue-router'
import { mallPayOnline, mallPayOnlineDetail, selectPayOrderByBizOrderCode } from '../../../apis/mx'

export default defineComponent({
	name: 'mxPayComponent',
	components: {
		Popup,
		RadioGroup,
		CellGroup,
		Cell,
		Radio,
		Button,
		Icon,
		VueQr,
		[ImagePreview.Component.name]: ImagePreview.Component
	},
	props: {
		poCode: {
			type: Number,
			default: null
		},
		podCode: {
			type: Number,
			default: null
		},
		show: {
			type: Boolean,
			default: false,
			required: true
		},
		cRecPayType: {
			type: String,
			default: ''
		}
		// cCode: [String, Number]
	},
	setup(props, { emit }) {
		const { show, podCode, cRecPayType, poCode } = toRefs(props)
		const { replace } = useRouter()
		const imageUrl = ref(alipayImg)
		const qrText = ref('')
		const showQr = ref(false)
		const images = ref<any[]>([])
		const payLoding = ref(false)
		const payTypeName = ref('')
		const radio = ref('')
		const cRecPayTypeStr = ref('')
		const payType = reactive([
			{
				value: 'sc',
				label: 'SIE',
				imgSrc: scImg,
				dSubCode: '6',
				ishow: false,
				dis: false
			},
			{
				value: 'susd',
				label: 'SUSD',
				imgSrc: scImg,
				dSubCode: '7',
				ishow: false,
				dis: false
			},
			{
				value: 'pic',
				label: 'PIC',
				imgSrc: piImg,
				dSubCode: '8',
				ishow: false,
				dis: false
			},
			{ value: 'alipay', label: '支付宝', dSubCode: '1', imgSrc: alipayImg, ishow: false, dis: false },
			{ value: 'wx', label: '微信', dSubCode: '1', imgSrc: wxImg, ishow: true, dis: false }
		])
		const payTypeList = computed(() => {
			let str = cRecPayType.value || cRecPayTypeStr.value || '1'
			return payType.filter(item => item.ishow && str.indexOf(item.dSubCode) > -1)
		})

		const radioChange = () => {
			if (radio.value === 'alipay') {
				payTypeName.value = '支付宝'
				imageUrl.value = alipayImg
			} else if (radio.value === 'wx') {
				payTypeName.value = '微信'
				imageUrl.value = wxImg
			}
		}
		const payResult = (res: baseResT, poCode: number) => {
			if (res.resultCode >= 1) {
				if (res.msg === '成功' && (radio.value === 'sc' || radio.value === 'susd' || radio.value === 'pic')) {
					// let params = JSON.parse(res.data).data
					// const payParams = {
					// 	coin: params.coin,
					// 	amount: params.amount,
					// 	app_id: params.app_id,
					// 	trade_no: params.trade_no,
					// 	merchant_uuid: '1ac2f3cd-1e05-4794-90a4-589c89162d17',
					// 	merchant_id: 'zhanshi',
					// 	remark: '秘选商城'
					// }
					// sc.payment(payParams, res1 => {
					// 	if (res1.code === 200) {
					// 		replace({ name: 'payResult', query: { id: poCode, type: 'new' } })
					// 	}
					// })
				} else {
					if (isIOSorANDROID() === 'ios' && radio.value === 'alipay') {
						window.location.href = res.msg
						replace({ name: 'payResult', query: { id: poCode } })
					} else {
						qrText.value = res.msg
						// 不知道怎么处理 ImagePreview 和 VueQr 的异步问题，只好延迟执行了
						window.setTimeout(() => {
							let div = document.getElementById('qr')
							let imgUrl = div!.getElementsByTagName('img')[0] // 获取二维码
							images.value = [imgUrl.src]
							showQr.value = true
						}, 500)

						let newParams = {
							orderBizCode: poCode,
							orderBizType: 1
						}
						let count = 0
						let timer = window.setInterval(() => {
							if (count < 4) {
								selectPayOrderByBizOrderCode(newParams).then(res => {
									if (res.resultCode === 1 && res.data.orderPayStatus) {
										window.clearInterval(timer)
										replace({ path: '/mxMall/payResult', query: { id: poCode } })
									}
								})
								count++
							} else {
								window.clearInterval(timer)
							}
						}, 4000)
						// this.$once('hook:beforeDestroy', () => {
						// 	clearInterval(timer)
						// 	timer = null
						// })
					}
				}
			}
		}
		const toPay = () => {
			if (!radio.value) {
				return Toast('未选择支付方式！')
			}
			let params1 = {
				payPlat: radio.value, // 支付平台
				poCode: poCode.value, // 订单编号, 第一次生成订单
				podCode: podCode.value // 订单编号，订单列表和订单详情中
			}
			payLoding.value = true
			if (!podCode.value) {
				mallPayOnline(params1)
					.then(res => {
						payResult(res, poCode.value)
						payLoding.value = false
					})
					.catch(err => {
						payLoding.value = false
					})
			} else {
				mallPayOnlineDetail(params1)
					.then(res => {
						payResult(res, poCode.value)
						payLoding.value = false
					})
					.catch(err => {
						payLoding.value = false
					})
			}
		}
		const close = () => {
			emit('close', false)
		}
		return {
			...props,
			show,
			imageUrl,
			qrText,
			showQr,
			images,
			payTypeName,
			payLoding,
			radio,
			payTypeList,
			radioChange,
			toPay,
			close
		}
	}
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
	}
	.qr-img {
		text-align: center;
	}
}
</style>
