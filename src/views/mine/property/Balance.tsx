import { computed, defineComponent } from 'vue-demi'
import { Button } from 'vant'

import './Balance.less'
import { useI18n } from '@/hooks/setting/useI18n'
import { useStore } from '@/store'
import { gold } from '@/utils'

/**
 * @description 钱包余额
 */
export default defineComponent({
	name: 'MineBalance',
	setup() {
		const { t } = useI18n()
		const store = useStore()
		const walletBalance = computed(() => store.state.user.walletBalance)
		// const mwAmount = currentRoute.value.query.mwAmount as string
		// const mwCurrencyTypeName = currentRoute.value.query.mwCurrencyTypeName as string
		// const mwCurrencyType = currentRoute.value.query.mwCurrencyType as string
		// const memCode = computed(() => store.state.user.userInfo.memCode)
		const fromChainDis = computed(
			() =>
				// ![500004, 500111, 717260, 500010, 539241, 500012, 999739, 1892076, 2436002, 2758924, 1757470, 1193844, 2647502].includes(store.state.user.userInfo.memCode)
				false
		)
		return () => (
			<div class="balance">
				<div class="top" />
				<div class="balance-container">
					<div>
						<p class="title">我的余额</p>
						<p class="type-name">{walletBalance.value.mwCurrencyTypeName}</p>
						<p class="money">{gold(walletBalance.value.mwAmount)}</p>
					</div>
				</div>
				<div class="fun-list">
					<div class="list-container">
						<div class="flex-space">
							<Button
								type="primary"
								size="large"
								icon="after-sale"
								class="left"
								to={{ path: '/mine/property/transfer' }}
							>
								{t('routes.transfer')}
							</Button>
							<Button
								type="primary"
								size="large"
								icon="balance-o"
								class="right"
								to={{ name: 'CollectionsQR' }}
							>
								{t('routes.collectionsQR')}
							</Button>
						</div>
						<Button
							type="primary"
							size="large"
							class="take"
							to={{ path: '/mine/property/transferToChain' }}
						>
							{t('routes.transferToChain')}
						</Button>
						<Button
							type="primary"
							size="large"
							class="take"
							disabled={fromChainDis.value}
							to={{ path: '/mine/property/transferFromChain' }}
						>
							{t('routes.transferFromChain')}
						</Button>
						<Button
							type="primary"
							size="large"
							class="take"
							disabled={fromChainDis.value}
							to={{ path: '/mine/property/transferToExchange' }}
						>
							{t('routes.transferToExchange')}
						</Button>
					</div>
				</div>
			</div>
		)
	}
})
