<template>
	<div class="pay">
		<div class="pay-cont">
			<div class="login-cont">溢多宝</div>
			<div class="box">
				<p>买入金额</p>
				<div class="flex-space">
					<div class="item">
						<span class="name">￥</span>
						<div class="money-content">
							<div class="money-input">
								<div class="value">{{ sum }}</div>
							</div>
						</div>
					</div>
					<div><Stepper integer v-model="buyNum" @change="changeBuyNum" min="1" /></div>
				</div>
			</div>
			<div class="biz-type">
				<div class="flex-space biz-type-func">
					<p>购入类型</p>
					<RadioGroup v-model="buyType" direction="horizontal">
						<Radio
							v-for="item in buyTypeListFilter"
							:name="item.value"
							:disabled="item.dis"
							:key="item.value"
						>
							{{ item.label }}
						</Radio>
					</RadioGroup>
				</div>
				<div class="biz-type-tips">{{ buyType === 1 ? '天天领分红，月化6%' : '天天领分红，月化7%' }}</div>
			</div>
			<div class="bank-id">
				<Cell
					title="收款银行卡"
					is-link
					:value="bankName + '(' + bankCard.substring(bankCard.length - 4) + ')'"
					@click="showBankModal = true"
				/>
			</div>
			<div>
				<Cell title="收益将发放到支付宝" value="点此可换绑" @click="$router.push('/mine/takeCashAccount')" />
			</div>
		</div>
		<div class="footer">
			<Checkbox v-model="checkedProto" icon-size="18px" label-disabled
				>点击确定即代表您已知悉该产品的<a @click="seeProto">购买须知</a>等相关内容</Checkbox
			>
			<!-- :disabled="!dis" -->
			<Button class="btn" size="large" @click="submit" disabled :loading="loading">确定</Button>
		</div>
		<!-- 银行卡 -->
		<Popup
			v-model:show="showBankModal"
			position="bottom"
			safe-area-inset-bottom
			round
			:close-on-click-overlay="false"
		>
			<p class="pop-close"><Icon name="cross" @click="close" /></p>
			<p style="text-align: center">请选择收款银行</p>
			<div class="bank-item">
				<RadioGroup v-model="bankRadio">
					<CellGroup>
						<Cell
							v-for="item in bankList"
							:key="item.mccCode"
							:title="item.mccBankName + '(尾号' + item.mccCard.substring(item.mccCard.length - 4) + ')'"
							center
							clickable
							@click="chooseBank(item)"
						>
							<!-- <template #icon>
							<img class="img-icon" :src="item.imgSrc" />
						</template> -->
							<template #right-icon>
								<Radio :name="item.mccCode" :disabled="item.dis"> </Radio>
							</template>
						</Cell>
						<Cell title="添加收款银行卡" is-link :to="{ name: 'AddBankCard' }" />
					</CellGroup>
				</RadioGroup>
			</div>
		</Popup>
		<!-- 支付 -->
		<PayType v-model:show="showPayType" :payType="payType" @pay="pay" />
		<!-- 支付二维码 -->
		<PayQr v-model:show="showQr" :imageUrl="imageUrl" :qrText="qrText" :payTypeName="payTypeName" />
		<!-- 銀行卡轉賬時，銀行卡信息 -->
		<BankCard v-model:show="showCard" biz="言禾" :valueCode="valueCode"></BankCard>
	</div>
</template>

<script lang="ts">
import { Button, Cell, CellGroup, Checkbox, Dialog, Icon, Popup, Radio, RadioGroup, Stepper, Toast } from 'vant'
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { httpGet } from '@/apis/axios'
import { showCreditCardList } from '@/apis/bankCard'
import { showDictionary } from '@/apis/common'
import { submitWJSInvestOrder } from '@/apis/slb'
import PayType from '../../../components/PayType'
import PayQr from '../../../components/PayQr'
import BankCard from '../../../components/BankCard'
import { wjsProto } from '@/utils/proto'
import { IShowCreditCardListItem } from '@/apis/model/bankCardModel'

export default defineComponent({
	name: ' payForYDB',
	components: {
		Popup,
		RadioGroup,
		CellGroup,
		Cell,
		Radio,
		Icon,
		Button,
		Checkbox,
		Stepper,
		PayType,
		PayQr,
		BankCard
	},
	setup() {
		const { currentRoute } = useRouter()
		// { alipayShow: false }
		const payType = reactive({ alipayShow: false })
		// const fromName = ref('')
		const data = reactive({
			// 单价
			price: 0.01,
			// 总价
			sum: 0.01,
			exInfo: 0,
			loading: false,

			// 购买类型
			buyType: 1,
			buyTypeList: [
				{ value: 1, label: '30天', isShow: true, dis: false },
				{ value: 2, label: '90天', isShow: true, dis: false }
			],
			// 是否自动下期
			checked: true,
			// 协议
			checkedProto: false,
			// 银行卡相关
			showBankModal: false,
			bankRadio: '',
			bankName: '未绑定银行卡',
			bankCard: '',
			// bankList: [],
			// 购买数量
			buyNum: 1,
			// 支付
			showPayType: false,
			submitParams: {},
			fromName: '',
			// 支付二维码
			imageUrl: '',
			qrText: '',
			payTypeName: '',
			showQr: false,
			// 银行卡转赚时，银行卡信息
			showCard: false,
			valueCode: ''
		})
		const bankList = ref<IShowCreditCardListItem[]>([])
		// const images = ref<any[]>([])
		// 是否可以提交
		const dis = computed(() => {
			return data.sum && data.checkedProto && data.bankRadio
		})
		// 購買類型
		const buyTypeListFilter = computed(() => {
			return data.buyTypeList.filter(item => item.isShow)
		})
		// 修改購買數量
		const changeBuyNum = () => {
			data.sum = data.buyNum * data.price
		}

		// 选择银行
		const chooseBank = (item: any) => {
			const { mccCode, mccBankName, mccCard } = item
			data.bankRadio = mccCode
			data.bankName = mccBankName
			data.bankCard = mccCard
			data.showBankModal = false
		}
		// 关闭pop
		const close = () => {
			data.showBankModal = false
		}

		// 查看协议
		const seeProto = () => {
			// console.log('proto')
			Dialog.alert({
				// title: '',
				className: 'proto',
				messageAlign: 'left',
				message: wjsProto
			}).then(() => {
				// on close
			})
		}
		// 點擊購買
		const submit = () => {
			if (data.sum) {
				data.submitParams = {
					cnySum: data.sum,
					mccCode: data.bankRadio,
					investFlag: data.buyType,
					autoFlag: 1, // Number(data.checked) ? 0 : 1,
					buyNum: data.buyNum
				}
				data.showPayType = true
			} else {
				Toast('请输入金额！')
			}
		}
		const pay = (options: any) => {
			data.payTypeName = options.payTypeName
			// data.qrText = options.payTypeName
			data.imageUrl = options.imageUrl
			// const params = {}
			let flag = false
			submitWJSInvestOrder({ ...data.submitParams, payPlat: options.payPlat }).then(res => {
				// console.log(res)
				if (res.resultCode === 1) {
					if (options.payPlat === 'bank') {
						data.valueCode = res.data
						data.showCard = true
					} else if (options.payPlat === 'wx') {
						data.qrText = res.msg
						flag = true
					}
					if (flag) {
						setTimeout(() => {
							data.showQr = true
						}, 500)
					}
				}
			})
		}

		// 银行列表
		const getBankList = () => {
			showCreditCardList({ mccCardType: 1 }).then(res => {
				if (res.resultCode === 1) {
					bankList.value = res.data.dataIn
					if (bankList.value.length) {
						data.bankRadio = bankList.value[0].mccCode+''
						data.bankName = bankList.value[0].mccBankName
						data.bankCard = bankList.value[0].mccCard
						// }
					}
				}
			})
		}
		onMounted(() => {
			currentRoute.value.query.buyType && (data.buyType = +currentRoute.value.query.buyType)
			getBankList()
			showDictionary({ dType: 59 }).then(res => {
				if (res.resultCode === 1) {
					data.price = +res.data[0].dSubName
					data.sum = +res.data[0].dSubName
				}
			})
		})

		return {
			...toRefs(data),
			// images,
			payType,
			bankList,
			dis,
			buyTypeListFilter,
			changeBuyNum,
			seeProto,
			submit,
			pay,
			close,
			chooseBank
		}
	},
	async beforeRouteEnter(to, from, next) {
		// console.log(from.name)

		const res = await httpGet('mem/member/parseAliPayAcct')
		if (res.resultCode === 1) {
			if (!res.data.aliPayAcct) {
				// 与vue2不同，不能将next写在then中，会报错
				next((vm: any) => {
					Dialog.confirm({
						title: '提示',
						message: '因打款需要，请先完善提现账号',
						theme: 'round-button'
					})
						.then(() => {
							vm.$router.push({ path: '/mine/takeCashAccount' })
						})
						.catch(() => vm.$router.back())
				})
			} else {
				/* eslint-disable @typescript-eslint/no-explicit-any */
				next((vm: any) => {
					vm.fromName = from.name as string
				})
			}
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.pay {
	position: relative;
	box-sizing: border-box;
	.pay-cont {
		box-sizing: border-box;
		min-height: calc(100vh - 152px - 162 * @fontSize);
		margin-bottom: calc(62px + 142 * @fontSize);

		.login-cont {
			margin: 20 * @fontSize 0;
			line-height: 40px;
			text-align: center;
			background: #fff;
		}
		.box {
			padding: 30 * @fontSize;
			background: #fff;
			border-radius: 10 * @fontSize;
			.item {
				position: relative;
				display: flex;
				align-items: center;
				font-size: 28 * @fontSize;
				line-height: 105 * @fontSize;
				.money-content {
					flex: 1;
					.money-input {
						position: relative;
						display: inline-block;
					}
				}
				.name {
					font-size: 40 * @fontSize;
				}
				.value {
					padding-left: 20 * @fontSize;
					font-weight: 600;
					font-size: 54 * @fontSize;
				}
			}
			:last-child {
				border-bottom: none;
			}
		}
		.biz-type {
			margin-top: 20 * @fontSize;
			padding: 20 * @fontSize 16px;
			background: #fff;
			border-radius: 5px;
			.biz-type-func {
				font-size: 32 * @fontSize;
			}
			.biz-type-tips {
				margin-top: 10 * @fontSize;
				font-size: 24 * @fontSize;
			}
		}
		.bank-id {
			margin: 2px 0;
		}
	}
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 10;
		padding: 20 * @fontSize 16px 22px;
		background: #f7f7f7;
		.van-checkbox {
			align-items: flex-start;
		}
		a {
			color: #1989fa;
		}
	}
	.btn {
		display: block;
		margin-top: 10 * @fontSize;
		color: #fff;
		font-size: 30 * @fontSize;
		line-height: 88 * @fontSize;
		text-align: center;
		background: #ed0c17;
		border-radius: 12 * @fontSize;
	}
	.pop-close {
		margin-top: 40 * @fontSize;
		margin-right: 40 * @fontSize;
		text-align: right;
	}
	.bank-item {
		margin-top: 22px;
		margin-bottom: 40px;
	}
}
</style>
