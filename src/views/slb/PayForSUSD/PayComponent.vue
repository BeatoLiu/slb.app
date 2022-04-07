<template>
	<div class="pay-result">
		<!--eslint-disable-next-line vue/no-mutating-props -->
		<Popup v-model:show="show" position="bottom" round :close-on-click-overlay="false">
			<p class="pop-close"><Icon name="cross" color="999" @click="close" /></p>
			<!-- <br/> -->
			<p class="text-center">请选择支付方式</p>
			<RadioGroup v-model="radio" @change="radioChange">
				<CellGroup>
					<Cell v-for="item in payTypeList" :key="item.value" :title="item.label" center clickable>
						<template #icon>
							<img class="img-icon" :src="item.imgSrc" alt="" />
						</template>
						<template #right-icon>
							<Radio :name="item.value" :disabled="item.dis"> </Radio>
						</template>
					</Cell>
				</CellGroup>
			</RadioGroup>
			<div class="text-center">
				<Button size="normal" class="btn" color="#ED0C17" :loading="payLoading" @click="toPay">立即付款</Button>
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
		<BankCard biz="" v-model:show="showCard" :valueCode="valueCode" @close="closeDialog"></BankCard>
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from 'vue'
import { Popup, Button, RadioGroup, Radio, Cell, CellGroup, Icon, ImagePreview, Toast } from 'vant'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import BankCard from '../../../components/BankCard'

import { usePayType } from '@/hooks/web/usePayType'
// import { stringify } from 'qs'
import { bankCardRechargeSUSD, saleSusdFromSlb } from '@/apis/slb'

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
		VueQr,
		BankCard
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		sum: {
			type: Number,
			default: 0
		},
		exInfo: {
			type: Number,
			default: 0
		},
		bizType: {
			type: Number,
			default: 0
		}
	},
	setup(props, { emit }) {
		const { show, sum, exInfo, bizType } = toRefs(props)
		const payLoading = ref(false)
		const radio = ref('')
		const payTypeName = ref('') // 支付名称
		const qrText = ref('')
		const imageUrl = ref('')
		// eslint-disable-next-line
		const images = ref<any[]>([])
		const showQr = ref(false)
		const showCard = ref(false)
		const { payTypeList } = usePayType()
		const valueCode = ref('')
		const close = () => {
			emit('close', false)
		}
		const radioChange = (value: string) => {
			console.log(value)
			imageUrl.value = payTypeList.value.filter(item => item.value === value)[0].imgSrc
			if (radio.value === 'alipay') {
				payTypeName.value = '支付宝'
			} else if (radio.value === 'wx') {
				payTypeName.value = '微信'
			}
		}
		const getRemark = (val: number): string => {
			if (val === 9) {
				return '购买susd'
			} else if (val === 12) {
				return '购买usdt'
			} else if (val === 32) {
				return '购买bnb'
			} else if (val === 36) {
				return '购买zsdt'
			} else {
				return '其它'
			}
		}
		const toPay = async () => {
			const params = {
				payPlat: radio.value, // 支付平台
				cnySum: sum.value,
				susdSum: exInfo.value,
				remark: getRemark(bizType.value), // === 9 ? '购买susd' : '购买usdt',
				bizType: bizType.value
			}
			let flag = false
			if (!radio.value) {
				return Toast('未选择支付方式！')
			}
			payLoading.value = true
			if (radio.value === 'alipay') {
				// qrText.value = 'http://192.168.0.10:9009/slPay/saleSusdFromSlb?' + stringify(params)
				// 支付宝是前端直接用这个地址生成二维码
				// qrText.value = payName+'/slPay/saleSusdFromSlb?' + stringify(params)
				// flag = true
				await saleSusdFromSlb(params).then(res => {
					if (res.resultCode === 1) {
						const div = document.createElement('divform')
						div.innerHTML = res.data
						document.body.appendChild(div)
						// 保持与支付宝默认编码格式一致，如果不一致将会出现：调试错误，请回到请求来源地，重新发起请求，错误代码 invalid-signature 错误原因: 验签出错，建议检查签名字符串或签名私钥与应用公钥是否匹配
						document.forms[0].acceptCharset = 'utf-8'
						document.forms[0].submit()
					}
				})
			} else if (radio.value === 'bank') {
				await bankCardRechargeSUSD(params).then(res => {
					if (res.resultCode === 1) {
						valueCode.value = res.data
						showCard.value = true
					}
				})
			} else {
				// 微信会调用后端接口，接口返回一个地址，我再生成二维码
				await saleSusdFromSlb(params).then(res => {
					if (res.resultCode === 1) {
						flag = true
						qrText.value = res.msg
						// window.location.href = res.msg
					}
				})
			}
			payLoading.value = false
			if (flag) {
				setTimeout(() => {
					const div = document.getElementById('qr')
					const imgUrl = div!.getElementsByTagName('img')[0] // 获取二维码
					images.value = [imgUrl.src]
					showQr.value = true
				}, 500)
			}
		}
		const closeDialog = () => {
			showCard.value = false
		}

		return {
			// eslint-disable-next-line vue/no-dupe-keys
			show,
			payTypeList,
			radio,
			payTypeName,
			qrText,
			imageUrl,
			images,
			showQr,
			valueCode,
			showCard,
			payLoading,
			close,
			radioChange,
			toPay,
			closeDialog
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.pay-result {
	.img-icon {
		height: 100%;
		margin-right: 20 * @fontSize;
	}
	.btn {
		display: inline-block;
		width: 600 * @fontSize;
		margin: 20 * @fontSize 0;
		color: #fff;
		font-size: 30 * @fontSize;
		line-height: 80 * @fontSize;
		background: #ed0c17;
		border-radius: 12 * @fontSize;
	}
	.pop-close {
		margin-top: 40 * @fontSize;
		margin-right: 40 * @fontSize;
		text-align: right;
		i {
			color: #000;
		}
	}

	.qr-img {
		text-align: center;
	}

	.copy {
		color: #07c160;
		font-size: 16px;
		text-align: center;
	}

	.text-center {
		text-align: center;
	}
}
</style>
