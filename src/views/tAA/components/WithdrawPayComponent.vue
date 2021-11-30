<template>
	<div class="pay-result">
		<Popup v-model:show="show" position="bottom" round :close-on-click-overlay="false" safe-area-inset-bottom>
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
							<Radio :name="item.value" :disabled="item.dis"> </Radio>
						</template>
					</Cell>
				</CellGroup>
			</RadioGroup>
			<div style="text-align: center; margin-bottom: 22px">
				<Button size="normal" class="btn" color="#ED0C17" :loading="payLoding" @click="toPay">立即付款</Button>
			</div>
		</Popup>
		<!-- 銀行卡轉賬時，銀行卡信息 -->
		<!-- <BankCard biz="申请节点" :showCard="showCard" :valueCode="mCode" @close="closeDialog"></BankCard> -->
		<!-- 支付二维码 -->
		<div id="qr" class="qr-img" ref="content" hidden>
			<VueQr :logoSrc="imageUrl" :text="qrText" :size="260" :margin="5" :dotScale="1" :logoScale="16"></VueQr>
			<p>请用{{ payTypeName }}扫码支付</p>
		</div>
		<van-image-preview v-model:show="showQr" :images="images">
			<template #index>请用{{ payTypeName }}扫码支付</template>
		</van-image-preview>
		<!-- 銀行卡轉賬時，銀行卡信息 -->
		<!-- <BankCard biz="" :showCard="showCard" :valueCode="valueCode" @close="closeDialog"></BankCard> -->
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from 'vue'
import { Popup, Button, RadioGroup, Radio, Cell, CellGroup, Icon, ImagePreview, Toast } from 'vant'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
// import BankCard from '../../../components/BankCard'

import { usePayType } from '../../../hooks/web/usePayType'
import { stringify } from 'qs'
// import { bankCardRechargeSUSD, saleSusdFromSlb } from '../../../apis/slb'
import { withdrawalTaa, singleOnlinePay } from '../../../apis/tAA'

export default defineComponent({
	name: 'payComponent',
	components: {
		Popup,
		Button,
		RadioGroup,
		Radio,
		Cell,
		CellGroup,
		Icon,
		[ImagePreview.Component.name]: ImagePreview.Component,
		VueQr
		// BankCard
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		ttCode: {
			type: Number,
			default: 0
		}
	},
	setup(props, { emit }) {
		const { show, ttCode } = toRefs(props)
		const payLoding = ref(false)
		const radio = ref('')
		const payTypeName = ref('') // 支付名称
		const qrText = ref('')
		const imageUrl = ref('')
		const images = ref<any[]>([])
		const showQr = ref(false)
		// const showCard = ref(false)
		const { payTypeList } = usePayType({ alipayShow: false, bankShow: false })
		// const valueCode = ref('')
		const close = () => {
			emit('close', false)
		}
		const radioChange = (value: any) => {
			console.log(value)
			imageUrl.value = payTypeList.value.filter(item => item.value === value)[0].imgSrc
			if (radio.value === 'alipay') {
				payTypeName.value = '支付宝'
			} else if (radio.value === 'wx') {
				payTypeName.value = '微信'
			}
		}
		const toPay = async () => {
			const params = {
				payPlat: radio.value, // 支付平台
				payType: 1,
				ttCode: ttCode.value
			}
			let flag = false
			if (!radio.value) {
				return Toast('未选择支付方式！')
			}
			payLoding.value = true
			if (radio.value === 'alipay') {
				// qrText.value = 'http://192.168.0.10:9009/slPay/saleSusdFromSlb?' + stringify(params)
				// 支付宝是前端直接用这个地址生成二维码
				qrText.value = 'http://slpayservice.2qzs.com/slPay/saleSusdFromSlb?' + stringify(params)
				flag = true
				// } else if (radio.value === 'bank') {
				// 	await bankCardRechargeSUSD(params).then(res => {
				// 		if (res.resultCode === 1) {
				// 			valueCode.value = res.data
				// 			showCard.value = true
				// 		}
				// 	})
			} else {
				// 微信会调用后端接口，接口返回一个地址，我再生成二维码
				if (ttCode.value) {
					await singleOnlinePay(params).then(res => {
						if (res.resultCode === 1) {
							flag = true
							qrText.value = res.msg
						}
					})
				} else {
					await withdrawalTaa().then(res => {
						if (res.resultCode === 1) {
							flag = true
							qrText.value = res.msg
						}
					})
				}
			}
			payLoding.value = false
			if (flag) {
				setTimeout(() => {
					let div = document.getElementById('qr')
					let imgUrl = div!.getElementsByTagName('img')[0] // 获取二维码
					images.value = [imgUrl.src]
					showQr.value = true
				}, 500)
			}
		}
		// const closeDialog = () => {
		// 	showCard.value = false
		// }

		return {
			show,
			payTypeList,
			radio,
			payTypeName,
			qrText,
			imageUrl,
			images,
			showQr,
			// valueCode,
			// showCard,
			payLoding,
			close,
			radioChange,
			toPay
			// closeDialog
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
