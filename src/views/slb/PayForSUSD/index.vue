<template>
	<div class="repayment">
		<div class="box">
			<p>兑换金额</p>
			<div class="item" @click="show = true">
				<span class="name">￥</span>
				<div class="money-content">
					<div class="money-input">
						<div
							class="value placeholder"
							:class="{ 'no-value': !exchangeParams.cnyMoney }"
							v-if="!exchangeParams.cnyMoney"
						>
							请输入兑换金额
						</div>
						<div class="value" v-else>{{ exchangeParams.cnyMoney }}</div>
						<div
							class="like-input"
							:class="{ 'no-value-like': !exchangeParams.cnyMoney }"
							v-if="show"
						></div>
					</div>
				</div>
			</div>
		</div>
		<div class="biz-type">
			<p>兑换类型</p>
			<RadioGroup v-model="exchangeParams.laCurrencyType" @change="radioChange" direction="horizontal">
				<Radio v-for="item in payTypeListFilter" :name="item.value" :disabled="item.dis" :key="item.value">
					{{ item.label }}
				</Radio>
			</RadioGroup>
		</div>

		<div class="return-fee flex-space">
			<p>所得</p>
			<p>
				{{ exInfo }}<span> {{ payTypeName }}</span>
			</p>
		</div>
		<div class="page-tips">
			<p class="title">温馨提示：</p>
			<div>
				<p>1、数点是数联宝平台的积分，1ZSDT=1元；数点可以用来购买数联宝平台的产品与数联宝提供的便民服务；</p>
				<p>
					2、数点仅能用于兑换数联宝平台直接运营的产品和服务，不能兑换现金，不能进行转账交易，不能兑换数联宝体系外的产品和服务；
				</p>
				<p>3、兑换金额为【{{ limitObj.laSingleLimitLow }}-{{ limitObj.laSingleLimit }}】之间</p>
				<p>4、兑换时间为【{{ limitDetail['开始时间'] }} — {{ limitDetail['结束时间'] }}】</p>
				<p v-if="limitDetail['结束日期']">{{ limitDetail['开始日期'] }}-{{ limitDetail['结束日期'] }}</p>
				<!-- <p>5、数点兑换兑换usdt功能，即将开放公测</p> -->
				<p>5、银行卡支付时间为【9:00-20:00】</p>
				<p>6、BNB兑换仅用于初始手续费，且只限购一次</p>
				<p class="color-red text-underline" @click="showHelpImg = true">7、数点兑换银行卡转账帮助说明</p>
			</div>
		</div>
		<div class="bottom flex-end">
			<div>
				<p>
					预计获得：<span>{{ exInfo }}</span> {{ payTypeName }}
				</p>
				<!-- <p>手续费：{{exInfo.returnFee}} SUSD</p> -->
			</div>
			<div>
				<Button class="btn" @click="toSign" :disabled="!dis" :loading="loading">确认兑换</Button>
			</div>
		</div>
		<!-- 数字键盘 -->
		<van-number-keyboard
			:show="show"
			theme="custom"
			extra-key="."
			close-button-text="完成"
			safe-area-inset-bottom
			@blur="complete"
			@input="onInput"
			@delete="onDelete"
		/>
		<!-- 支付方式选择 -->
		<PayComponent
			:show="showComponent"
			:sum="+exchangeParams.cnyMoney"
			:exInfo="exInfo"
			:bizType="bizType"
			@close="close"
		/>
		<!-- 帮助说明 -->
		<van-image-preview v-model:show="showHelpImg" :images="helpImages" @change="onChange">
			<template v-slot:index>
				<div class="help-tips">
					<br />
					<br />
					<p>{{ steps[idx] }}</p>
				</div>
			</template>
			<!-- <template v-slot:cover>第{{ idx }}页</template> -->
		</van-image-preview>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { Button, ImagePreview, NumberKeyboard, Radio, RadioGroup, Toast } from 'vant'

import { picDisplayPath } from '@/utils/config'
import { showDictionary } from '@/apis/common'

import PayComponent from './PayComponent.vue'
import { useStore } from '@/store'
import useLimitAcct from '@/hooks/web/useLimitAcct'
import useExchangeRationDcToCny from '@/hooks/web/useExchangeRationDcToCny'

export default defineComponent({
	name: 'PayForSUSD',
	components: {
		[NumberKeyboard.name]: NumberKeyboard,
		Button,
		RadioGroup,
		Radio,
		[ImagePreview.Component.name]: ImagePreview.Component,
		PayComponent
	},
	setup() {
		const store = useStore()
		const memCode = computed(() => store.state.user.userInfo.memCode)
		const { getLimitAcct } = useLimitAcct()
		const { exchangeRationDcToCny } = useExchangeRationDcToCny()
		const data = reactive({
			show: false, // 数字键盘
			// sum: '',
			exInfo: 0, // 换算后的金额
			loading: false,
			limitDetail: {
				开始时间: '7:00:00',
				结束时间: '24:00:00',
				开始日期: '',
				结束日期: ''
			},
			limitObj: {
				laSingleLimitLow: 10,
				laSingleLimit: 1000
			},
			showComponent: false,
			bizType: 36, // 9 susd; 36 ZSDT; 32 bnb; 12 usdt
			payTypeName: 'ZSDT',
			// laCurrencyType: 18,
			// 购买币种类型
			payTypeList: [
				{ value: 18, label: 'ZSDT', isShow: true, dis: false },
				{ value: 16, label: 'BNB', isShow: true, dis: false },
				{ value: 7, label: 'SUSD', isShow: true, dis: false },
				{ value: 10, label: 'USDT', isShow: true, dis: true }
			],

			showHelpImg: false,
			helpImages: [
				picDisplayPath + 'slbApp/slb/help/sd_help_1.jpg',
				picDisplayPath + 'slbApp/slb/help/sd_help_2.jpg',
				picDisplayPath + 'slbApp/slb/help/sd_help_3.jpg',
				picDisplayPath + 'slbApp/slb/help/sd_help_4.jpg',
				picDisplayPath + 'secret/help/sd/sd_help_5.jpg'
			],
			steps: [
				'1、打开“数联宝”APP，选择“数点兑换”',
				'2、输入兑换金额，会自动换算成zsdt数量，点击“确认兑换”',
				'3、会跳出支付方式，选择“银行卡转账”，点击“立即付款”',
				'4、会弹出转账银行信息和摘要（点击相应内容可直接复制）',
				'5、打开银行APP转账汇款，必须备注【摘要】里的信息，若不备注，或致到账失败。汇款金额必须和数点兑换金额一致。付款成功后，等待兑换的数点到账'
			],
			idx: 0
		})

		const exchangeParams = reactive({
			laType: 1, // 0买，1卖
			cnyMoney: '',
			laCurrencyType: 18 // 17 usdt; 18 zsdt
		})

		const dis = computed(() => {
			const permissionList = ['512636', '500111', '717260', '500010', '539241', '500012', '999739', '657129']
			if (permissionList.includes(memCode.value + '')) {
				return true
			}

			const h = new Date()
			const timeNow = h.getTime()

			if (data.limitDetail['结束日期']) {
				const startDay = new Date(data.limitDetail['开始日期']).getTime()
				const endDay = new Date(data.limitDetail['结束日期']).getTime()
				if (timeNow > startDay && timeNow < endDay) {
					return false
				} else {
					return exchangeParams.cnyMoney
				}
			}

			// const h = new Date()
			const day = h.getFullYear() + '/' + (h.getMonth() + 1) + '/' + h.getDate()
			const startTimeStr = data.limitDetail['开始时间'] || '7:00:00'
			const endTimeStr = data.limitDetail['结束时间'] || '24:00:00'
			const startTime = new Date(day + ' ' + startTimeStr).getTime()
			const endTime = new Date(day + ' ' + endTimeStr).getTime()
			if (startTime <= timeNow && timeNow < endTime) {
				return exchangeParams.cnyMoney
			} else {
				return false
			}
		})
		// 所能兌換幣種
		const payTypeListFilter = computed(() => {
			return data.payTypeList.filter(item => item.isShow)
		})

		const onChange = (index: number) => {
			data.idx = index
		}
		const onInput = async (value: string) => {
			const reg = /^\d+\.?\d?$/
			if (reg.test(exchangeParams.cnyMoney) || exchangeParams.cnyMoney === '') {
				exchangeParams.cnyMoney = exchangeParams.cnyMoney + value
			}
			data.exInfo = await exchangeRationDcToCny(exchangeParams)
		}
		const onDelete = async () => {
			exchangeParams.cnyMoney = exchangeParams.cnyMoney.slice(0, exchangeParams.cnyMoney.length - 1)
			data.exInfo = await exchangeRationDcToCny(exchangeParams)
		}
		const complete = () => {
			data.show = false
		}

		const toSign = () => {
			const minMoney = data.limitObj.laSingleLimitLow
			if (+exchangeParams.cnyMoney < minMoney) {
				return Toast('最低兑换金额为' + minMoney)
			}
			data.showComponent = true
		}
		const close = () => {
			data.showComponent = false
		}
		const radioChange = async (radio: number) => {
			if (radio === 7) {
				data.payTypeName = 'SUSD'
				data.bizType = 9
				const res = await getLimitAcct(2)
				Object.assign(data.limitObj, res)
			} else if (radio === 10) {
				data.payTypeName = 'USDT'
				data.bizType = 12
				const res = await getLimitAcct(4)
				Object.assign(data.limitObj, res)
			} else if (radio === 16) {
				data.payTypeName = 'BNB'
				data.bizType = 32
				const res = await getLimitAcct(13)
				Object.assign(data.limitObj, res)
			} else if (radio === 18) {
				data.payTypeName = 'ZSDT'
				data.bizType = 36
				const res = await getLimitAcct(11)
				Object.assign(data.limitObj, res)
			}
			data.exInfo = await exchangeRationDcToCny(exchangeParams)
		}
		const getLimitTime = (val: number) => {
			// 查詢該功能開放時間斷
			showDictionary({ dType: val }).then(res => {
				if (res.resultCode === 1 && res.data.length) {
					const str = JSON.parse(res.data[0].dSubName)
					if (str['结束时间']) {
						data.limitDetail = str
					}
				}
			})
		}
		onMounted(async () => {
			const res = await getLimitAcct(11)
			Object.assign(data.limitObj, res)
			getLimitTime(41)
		})
		return {
			...toRefs(data),
			exchangeParams,
			dis,
			payTypeListFilter,
			radioChange,
			complete,
			onInput,
			onDelete,
			toSign,
			close,
			onChange
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.repayment {
	box-sizing: border-box;
	margin-bottom: 200 * @fontSize;
	padding: 20 * @fontSize;
	// height: calc(100vh - 100px);
	// overflow: hidden;
	.card-desc {
		padding: 0 20 * @fontSize;
		line-height: 100 * @fontSize;
		background: #fff;
		border-radius: 5px;
	}
	.box {
		margin-top: 20 * @fontSize;
		padding: 30 * @fontSize;
		background: #fff;
		border-radius: 10 * @fontSize;
		& > p:nth-child(1) {
			color: #404040;
		}
		.item {
			position: relative;
			display: flex;
			align-items: center;
			font-size: 28 * @fontSize;
			line-height: 105 * @fontSize;
			.money-content {
				flex: 1;
				// border-bottom: 1px solid #BFBFBF;
				.money-input {
					position: relative;
					display: inline-block;
				}
			}
			.name {
				// margin-left: 10*@fontSize;
				font-size: 40 * @fontSize;
			}
			.value {
				// flex: 1;
				// text-align: right;
				// margin-right: 2*@fontSize;
				padding-left: 20 * @fontSize;
				font-weight: 600;
				font-size: 54 * @fontSize;
			}
			.placeholder {
				margin-top: 10 * @fontSize;
				color: #ccc;
			}
			.like-input {
				position: absolute;
				top: 20 * @fontSize;
				right: 0;
				width: 2px;
				height: 60 * @fontSize;
				background: #1989fa;
				animation: flick 1s infinite;
				//-moz-animation: flick 1s infinite; /* Firefox */
				//-webkit-animation: flick 1s infinite; /* Safari 和 Chrome */
				//-o-animation: flick 1s infinite; /* Opera */
			}
			.no-value {
				font-size: 28 * @fontSize;
			}
			.no-value-like {
				top: 36 * @fontSize;
				left: 20 * @fontSize;
				height: 44 * @fontSize;
			}
		}
		:last-child {
			border-bottom: none;
		}
	}
	.biz-type {
		margin-top: 20 * @fontSize;
		padding: 0 20 * @fontSize 30 * @fontSize 20 * @fontSize;
		line-height: 120 * @fontSize;
		background: #fff;
		border-radius: 5px;
	}
	.return-fee {
		margin-top: 20 * @fontSize;
		padding: 0 20 * @fontSize;
		font-size: 30 * @fontSize;
		line-height: 120 * @fontSize;
		background: #fff;
		border-radius: 5px;
		p:nth-child(2) {
			font-weight: 600;
		}
		span {
			color: #505050;
			font-weight: 100;
			font-size: 24 * @fontSize;
		}
	}
	.bottom {
		position: fixed;
		right: 0;
		bottom: 0;
		width: 100%;
		margin-top: 20 * @fontSize;
		padding: 30 * @fontSize 20 * @fontSize;
		font-size: 26 * @fontSize;
		background: #fff;
		& > div:nth-child(1) {
			margin-right: 20 * @fontSize;
			text-align: right;
			span {
				font-weight: 600;
				font-size: 32 * @fontSize;
			}
		}
	}
	.btn {
		// margin-top: 200*@fontSize;
		display: inline-block;
		width: 200 * @fontSize;
		color: #fff;
		font-size: 30 * @fontSize;
		line-height: 80 * @fontSize;
		text-align: center;
		background: #ed0c17;
		border-radius: 12 * @fontSize;
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

	.help-tips {
		width: 100vw;
		text-align: center;
	}
}
</style>
