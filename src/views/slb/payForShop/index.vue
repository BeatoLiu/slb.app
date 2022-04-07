<template>
	<div class="pay">
		<div class="pay-cont">
			<div class="address" :class="{ error: error }">
				{{ merchantName }}
			</div>
			<div class="box">
				<p>支付金额</p>
				<div class="item" @click="show = true">
					<span class="name">￥</span>
					<div class="money-content">
						<div class="money-input">
							<div class="value placeholder" :class="{ 'no-value': !sum }" v-if="!sum">
								请询问店员后输入
							</div>
							<div class="value" v-else>{{ sum }}</div>
							<div class="like-input" :class="{ 'no-value-like': !sum }" v-if="show"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex-space biz-type">
				<p>支付类型</p>
				<RadioGroup v-model="payType" @change="radioChange" direction="horizontal">
					<Radio v-for="item in payTypeListFilter" :name="item.value" :disabled="item.dis" :key="item.value">
						{{ item.label }}
					</Radio>
				</RadioGroup>
			</div>
			<div class="return-fee flex-space">
				<p>所需</p>
				<p>
					{{ exInfo }}<span> {{ payTypeName }}</span>
				</p>
			</div>
			<div class="page-tips" v-if="limitDetail['结束时间']">
				<p class="title">温馨提示：</p>
				<div>
					<p>开放时间为【{{ limitDetail['开始时间'] }} — {{ limitDetail['结束时间'] }}】</p>
					<p v-if="limitDetail['结束日期']">
						{{ limitDetail['开始日期'] }}-{{ limitDetail['结束日期'] }}将进行优化，暂时关闭此功能
					</p>
					<p>
						1、到店付是为拥有ZSDT的消费者提供线下商店或线上电商平台购物应⽤的服务通道，商家收到的是⼈⺠
						币，到店付不为商家或消费者提供ZSDT的提现服务，如有违反，即关闭服务通道；
					</p>
					<p>2、到店付功能需要收取⼀定的⼿续费，具体⼿续费⽤可以根据系统显示价格计算；</p>
					<p>3、请确认银行信息正确，若不正确将影响到账时间</p>
					<p>4、如果修改结算信息，普通支付将一并修改。</p>
					<!--					<p>5、商户接受到店付需要自己到数联宝商家管理后台操作提现，提现到帐时间为T+1。</p>-->
				</div>
			</div>
			<div class="footer">
				<Button class="btn" type="primary" @click="toPay" :disabled="!dis" :loading="loading"
					>和店员已确认，立即买单</Button
				>
			</div>
		</div>

		<InputPayPWD :show="showPop" @close="closePop" :typeName="payTypeName" :amount="exInfo" :pwdError="pwdError" />

		<van-number-keyboard
			:show="show"
			theme="custom"
			extra-key="."
			close-button-text="完成"
			:hide-on-click-outside="false"
			@blur="complete"
			@input="onInput"
			@delete="onDelete"
		/>
	</div>
</template>

<script lang="ts">
import { Toast, NumberKeyboard, Button, RadioGroup, Radio, Dialog } from 'vant'
import { Base64 } from 'js-base64'

import { getExchangeRationDcToCny, getMerchantBymCodeAndMqcCode, payShopMoneyForDc } from '@/apis/slb'
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { showDictionary } from '@/apis/common'
// import slb from '../../../utils/jslb-1.0.0'
import InputPayPWD from '../../../components/InputPayPWD'
import { useRouter } from 'vue-router'
export default defineComponent({
	name: 'PayForShop',
	components: {
		[NumberKeyboard.name]: NumberKeyboard,
		Button,
		RadioGroup,
		Radio,
		InputPayPWD
	},
	setup() {
		const { currentRoute, replace } = useRouter()
		const data = reactive({
			memCode: localStorage.memCode,
			sum: '',
			exInfo: 0,
			lng: '',
			lat: '',
			show: false, // 数字键盘
			merchantName: '',
			mCode: 0,
			error: false,
			// mHelpChar: '', // 登记符
			mqcCode: '', // 分店code
			loading: false,
			bizType: 34, //  1 usdt; 34 zsdt
			payType: 18, //  17 usdt; 18 zsdt
			payTypeName: 'ZSDT',
			laCurrencyType: 18, //  17 usdt; 18 zsdt
			// 支付币种类型
			payTypeList: [
				{ value: 18, label: 'ZSDT', isShow: true, dis: false },
				{ value: 17, label: 'USDT', isShow: true, dis: true }
			],
			limitDetail: {
				开始时间: '7:00:00',
				结束时间: '24:00:00',
				开始日期: '',
				结束日期: ''
			},
			// 密码
			showPop: false,
			pwdError: '',
			allianceWalletPassword: ''
			// timer: 0
		})

		// const timer = ref(0)

		const dis = computed(() => {
			// const permissionList = ['512636', '500111', '717260', '500010', '539241', '500012', '999739', '1892076', '657129']
			// const memCode = localStorage.getItem('memCode') || ''
			// if (permissionList.includes(memCode)) {
			// 	return true
			// }

			const h = new Date()
			const timeNow = h.getTime()

			if (data.limitDetail['结束日期']) {
				// console.log(new Date(data.limitDetail['开始日期']))
				const startDay = new Date(data.limitDetail['开始日期']).getTime()
				const endDay = new Date(data.limitDetail['结束日期']).getTime()
				if (timeNow > startDay && timeNow < endDay) {
					return false
				} else {
					return data.mCode && data.sum
				}
			}

			const day = h.getFullYear() + '/' + (h.getMonth() + 1) + '/' + h.getDate()
			const startTimeStr = data.limitDetail['开始时间'] || '7:00:00'
			const endTimeStr = data.limitDetail['结束时间'] || '24:00:00'
			const startTime = new Date(day + ' ' + startTimeStr).getTime()
			const endTime = new Date(day + ' ' + endTimeStr).getTime()
			if (startTime <= timeNow && timeNow < endTime) {
				return !!data.mCode && data.sum
			} else {
				return false
			}
		})
		const payTypeListFilter = computed(() => {
			return data.payTypeList.filter(item => item.isShow)
		})

		// 汇率换算
		const exchangeRationDcToCny = () => {
			if (data.sum) {
				const params = {
					laType: 2, // 0买，1卖
					cnyMoney: data.sum,
					laCurrencyType: data.laCurrencyType // 7 susd; 10 usdt
				}
				getExchangeRationDcToCny(params).then(res => {
					if (res.resultCode === 1) {
						data.exInfo = res.data
					}
				})
			} else {
				data.exInfo = 0
			}
		}
		const onInput = (value: string) => {
			const reg = /^\d+\.?\d?$/
			if (reg.test(data.sum) || data.sum === '') {
				data.sum = data.sum + value
			}
			exchangeRationDcToCny()
		}
		const onDelete = () => {
			data.sum = data.sum.slice(0, data.sum.length - 1)
			exchangeRationDcToCny()
			// data.exInfo = data.sum
		}
		const complete = () => {
			data.show = false
		}

		const getMerInfo = () => {
			// let res =
			// 	payOrigin+'/slpay/index.html#/payDetail?id=10_DA5859D030EC4464F8723FEAE3A9530E_E1A169704C798EA7E8A8AC832DB742DB_298C9FDD2924191B591630F1A3C1144B_D653D3F3BDF3406658594771A3F0F2A0&mqcCode=0'

			const query = currentRoute.value.query
			const params = {
				id: query.id as string,
				mqcCode: query.mqcCode as string
			}
			getMerchantBymCodeAndMqcCode(params).then(res => {
				// console.log(res)
				if (res.resultCode === 1) {
					data.merchantName = res.data.mName
					data.mCode = res.data.mCode
					data.mqcCode = query.mqcCode as string
					// data.mHelpChar = res.data.mHelpChar
				} else {
					if (res.resultCode === 2) {
						Dialog.alert({ message: res.msg })
					}
					data.merchantName = res.msg
					data.mCode = 0
					data.error = true
				}
			})
			// })
		}
		// 选择币种
		const radioChange = (radio: number) => {
			if (radio === 17) {
				data.payTypeName = 'USDT'
				data.laCurrencyType = 17
				data.bizType = 33
			} else if (radio === 18) {
				data.payTypeName = 'ZSDT'
				data.laCurrencyType = 18
				data.bizType = 34
			}
			exchangeRationDcToCny()
		}

		// 点击确定
		// const submitTransfer = () => {
		//     data.showPop = true
		// }
		// 输入完密码后
		const closePop = (pwd?: string) => {
			if (pwd?.length === 6) {
				// data.allianceWalletPassword = pwd || ''
				const params = {
					paySum: data.sum,
					payFactSum: data.exInfo,
					remark: data.payTypeName.toLowerCase() + '到店付',
					lat: data.lat,
					lng: data.lng,
					mCode: data.mCode,
					mName: Base64.encode(data.merchantName),
					mqcCode: data.mqcCode,
					payType: data.payType,
					bizType: data.bizType,
					// memCode: localStorage.memCode,
					allianceWalletPassword: pwd || ''
				}

				// return replace({ name: 'PayResult', query: { orderCode: 3188206 } })
				data.loading = true
				payShopMoneyForDc(params)
					.then(res => {
						data.loading = false
						if (res.resultCode === 1) {
							replace({ name: 'PayResult', query: { orderCode: res.data.orderCode } })
						} else if (res.resultCode === -2) {
							data.pwdError = res.msg
						} else if (res.resultCode === -3) {
							data.pwdError = res.msg
						}
					})
					.catch(() => {
						data.loading = false
					})
				// transfer(params).then(async res => {
				//     if (res.resultCode === 1) {
				//         // await store.dispatch('user/setWalletBalance', { ...walletBalance.value, mwAmount: walletBalance.value.mwAmount - (+params.amount) })
				//         Toast('转账成功')
				//         data.showPop = false
				//     } else if (res.resultCode === -2) {
				//         data.pwdError = res.msg
				//     } else if (res.resultCode === -3) {
				//         data.pwdError = res.msg
				//     }
				// })
			} else {
				data.showPop = false
			}
		}

		const toPay = () => {
			// return Toast('更新中，敬请期待')
			data.show = false
			// Toast('111')
			if (data.sum) {
				data.showPop = true
			} else {
				Toast('请输入金额！')
			}
		}

		onMounted(() => {
			showDictionary({ dType: 43 }).then(res => {
				if (res.resultCode === 1 && res.data.length) {
					const str = JSON.parse(res.data[0].dSubName)
					if (str['结束时间']) {
						data.limitDetail = str
					}
				}
			})
			getMerInfo()
		})

		return {
			...toRefs(data),
			dis,
			payTypeListFilter,
			onInput,
			onDelete,
			complete,
			radioChange,
			toPay,
			closePop
		}
	},
	beforeRouteEnter(to, from, next) {
		// next()
		const permissionList = [
			'500004',
			'512636',
			'500111',
			'717260',
			'500010',
			'539241',
			'500012',
			'999739',
			'657129'
		]
		const memCode = JSON.parse(localStorage.getItem('userInfo') || '{}')?.memCode
		if (permissionList.includes(memCode + '')) {
			next()
		} else {
			Dialog.confirm({
				title: '提示',
				message: '银企直联对接中，敬请期待',
				theme: 'round-button'
			})
				.then(() => {
					next({ path: '/' })
				})
				.catch(() => {
					next({ path: '/' })
				})
		}
	}
})
</script>

<style scoped lang="less">
@s: 0.0133rem;
.pay {
	position: relative;
	box-sizing: border-box;
	.pay-cont {
		box-sizing: border-box;
		min-height: calc(100vh - 90px);
		padding: 0 20 * @s;
		// background: #fff;
		.address {
			height: 100 * @s;
			color: #808080;
			line-height: 100 * @s;
			text-align: center;
		}
		.error {
			color: red;
		}
		.login-cont {
			margin-bottom: 20 * @s;
		}
		.logo {
			text-align: center;
		}
		.box {
			// border: 1px solid #BFBFBF;
			padding: 30 * @s;
			background: #fff;
			border-radius: 10 * @s;
			.item {
				position: relative;
				display: flex;
				align-items: center;
				font-size: 28 * @s;
				line-height: 105 * @s;
				.money-content {
					flex: 1;
					// border-bottom: 1px solid #BFBFBF;
					.money-input {
						position: relative;
						display: inline-block;
					}
				}
				.name {
					// margin-left: 10*@s;
					font-size: 40 * @s;
				}
				.value {
					// flex: 1;
					// text-align: right;
					// margin-right: 2*@s;
					padding-left: 20 * @s;
					font-weight: 600;
					font-size: 54 * @s;
				}
				.placeholder {
					color: #ccc;
				}
				.like-input {
					position: absolute;
					top: 20 * @s;
					right: 0;
					width: 2px;
					height: 60 * @s;
					background: #1989fa;
					animation: flick 1s infinite;
					//-moz-animation: flick 1s infinite; /* Firefox */
					//-webkit-animation: flick 1s infinite; /* Safari 和 Chrome */
					//-o-animation: flick 1s infinite; /* Opera */
				}
				.no-value {
					font-size: 28 * @s;
				}
				.no-value-like {
					top: 36 * @s;
					left: 20 * @s;
					height: 44 * @s;
				}
			}
			.remark {
				margin-top: 20 * @s;
				font-size: 28 * @s;
				line-height: 100 * @s;
				// border-bottom: 1px solid #BFBFBF;
				input {
					width: 100%;
					border: none;
					border-bottom: 1px solid #bfbfbf;
				}
			}
			:last-child {
				border-bottom: none;
			}
		}
		.biz-type {
			margin-top: 20 * @s;
			padding: 0 20 * @s;
			line-height: 120 * @s;
			background: #fff;
			border-radius: 5px;
		}
		.return-fee {
			margin-top: 20 * @s;
			padding: 0 20 * @s;
			font-size: 30 * @s;
			line-height: 120 * @s;
			background: #fff;
			border-radius: 5px;
			p:nth-child(2) {
				font-weight: 600;
			}
			span {
				color: #505050;
				font-weight: 100;
				font-size: 24 * @s;
			}
		}
		.page-tips {
			margin-bottom: calc(64px + 20 * @s);
		}
		.footer {
			position: fixed;
			bottom: 0;
			z-index: 12;
			width: 100%;
			padding-bottom: 22px;
			text-align: center;
			background: #f7f7f7;
		}
		.btn {
			display: block;
			width: 660 * @s;
			margin-top: 20 * @s;
			margin-left: calc(50% - 350 * @s);
			// background: #ed0c17;
			color: #fff;
			font-size: 30 * @s;
			line-height: 88 * @s;
			text-align: center;
			border-radius: 12 * @s;
		}
	}
	@keyframes flick {
		0% {
			opacity: 0;
		}
		40% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 1;
		}
	}
	@-moz-keyframes flick {
		0% {
			opacity: 0;
		}
		40% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 1;
		}
	}
	@-webkit-keyframes flick {
		0% {
			opacity: 0;
		}
		40% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 1;
		}
	}
	@-o-keyframes flick {
		0% {
			opacity: 0;
		}
		40% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 1;
		}
	}
}
</style>
