import { computed, defineComponent, reactive } from 'vue'
import { Button, NumberKeyboard, Toast } from 'vant'

import './TransferToExchange.less'
import { useStore } from '@/store'
import { transferFromSlbAcct2StockAcct } from '@/apis/tAA'
import { gold } from '@/utils'

export default defineComponent({
	name: 'TransferToExchange',
	setup() {
		const store = useStore()
		const walletBalance = computed(() => store.state.user.walletBalance)
		const data = reactive({
			show: true // 数字键盘
		})
		const exchangeParams = reactive({
			chAmount: '',
			currencyType: walletBalance.value.mwCurrencyType
		})
		const dis = computed(() => {
			return exchangeParams.chAmount && +exchangeParams.chAmount <= walletBalance.value.mwAmount
		})
		const onInput = (value: string) => {
			const reg = /^\d+\.?\d?$/
			if (reg.test(exchangeParams.chAmount) || exchangeParams.chAmount === '') {
				exchangeParams.chAmount = exchangeParams.chAmount + value
			}
		}
		const onDelete = () => {
			exchangeParams.chAmount = exchangeParams.chAmount.slice(0, exchangeParams.chAmount.length - 1)
		}
		const complete = () => {
			data.show = false
		}
		const toSign = () => {
			transferFromSlbAcct2StockAcct(exchangeParams).then(res => {
				if (res.resultCode === 1) {
					store.dispatch('user/setWalletBalance', {
						...walletBalance.value,
						mwAmount: walletBalance.value.mwAmount - +exchangeParams.chAmount
					})
					Toast('转账成功')
				}
			})
		}
		return () => (
			<div class="transfer-from-slb">
				<div class="box">
					<div class="flex-space">
						<p>转入数量</p>
						<p
							class="choose-all"
							onClick={() => (exchangeParams.chAmount = walletBalance.value.mwAmount + '')}
						>
							全部
						</p>
					</div>
					<div
						class="item"
						onClick={() => {
							data.show = true
						}}
					>
						<span class="name">{walletBalance.value.mwCurrencyTypeName}</span>
						<div class="money-content">
							<div class="money-input">
								{!exchangeParams.chAmount ? (
									<div
										class={
											!exchangeParams.chAmount
												? 'value placeholder no-value'
												: 'value placeholder'
										}
									>
										可转出{gold(walletBalance.value.mwAmount)}
									</div>
								) : (
									<div class="value">{exchangeParams.chAmount}</div>
								)}
								{data.show ? (
									<div class={!exchangeParams.chAmount ? 'like-input no-value-like' : 'like-input'} />
								) : (
									''
								)}
							</div>
						</div>
					</div>
				</div>
				<Button class="btn" type="primary" size="large" onClick={toSign} disabled={!dis.value}>
					确认
				</Button>
				<NumberKeyboard
					show={data.show}
					theme="custom"
					extra-key="."
					close-button-text="完成"
					safe-area-inset-bottom
					onBlur={complete}
					onInput={onInput}
					onDelete={onDelete}
				/>
			</div>
		)
	}
})
