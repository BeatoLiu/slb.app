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
							<Radio :name="item.value" :disabled="item.dis"> </Radio>
						</template>
					</Cell>
				</CellGroup>
			</RadioGroup>
			<div style="text-align: center">
				<Button size="normal" class="btn" color="#ED0C17" @click="toPay">立即付款</Button>
			</div>
		</Popup>

		<!-- 銀行卡轉賬時，銀行卡信息 -->
		<!-- <BankCard biz="" :showCard="showCard" :valueCode="valueCode" @close="closeDialog"></BankCard> -->
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import { Popup, Button, RadioGroup, Radio, Cell, CellGroup, Icon, Toast } from 'vant'
import { usePayType } from '@/hooks/web/usePayType'
// import BankCard from '../BankCard'

export default defineComponent({
	name: 'payType',
	components: {
		Popup,
		Button,
		RadioGroup,
		Radio,
		Cell,
		CellGroup,
		Icon
		// BankCard
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		payType: {
			type: Object,
			default: () => {}
		}
	},
	setup(props, { emit }) {
		const { show, payType } = toRefs(props)
		const radio = ref('')
		const payTypeName = ref('') // 支付名称
		// const qrText = ref('')
		const imageUrl = ref('')
		// const images = ref<any[]>([])
		const { payTypeList } = usePayType(payType.value)
		const radioChange = (value: any) => {
			console.log(value)
			imageUrl.value = payTypeList.value.filter(item => item.value === value)[0].imgSrc
			if (radio.value === 'alipay') {
				payTypeName.value = '支付宝'
			} else if (radio.value === 'wx') {
				payTypeName.value = '微信'
			}
		}

		const updateShow = (show: boolean) => emit('update:show', show)
		const close = () => {
			updateShow(false)
		}

		const toPay = () => {
			if (!radio.value) {
				return Toast('未选择支付方式！')
			}
			const params = {
				payPlat: radio.value, // 支付平台
				payTypeName: payTypeName.value,
				imageUrl: imageUrl.value
			}
			emit('pay', params)
		}
		return {
			show,
			radio,
			payTypeList,
			radioChange,
			close,
			toPay
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
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
}
</style>
