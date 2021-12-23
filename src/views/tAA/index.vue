<template>
	<div class="pay-list">
		<CellGroup>
			<Cell v-for="item in listNav" :title="item.title" :key="item.id" :to="item.to" class="flex-start" is-link>
				<template #icon>
					<Icon :name="item.icon" :color="item.iconColor" class="search-icon" />
				</template>
			</Cell>
			<!-- <Cell title="钱包余额" class="flex-start" :value="balance">
				<template #icon>
					<Icon name="balance-o" color="#f30" class="search-icon" />
				</template>
			</Cell> -->
		</CellGroup>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { CellGroup, Cell, Icon } from 'vant'
// import { getWalletBalance } from '../../apis/tAA'

export default defineComponent({
	name: 'TAAIndex',
	components: { CellGroup, Cell, Icon },
	setup() {
		const list = ref([
			{
				title: '钱包地址',
				id: 1,
				to: { name: 'UpdateWallet' },
				icon: 'balance-pay',
				iconColor: '#1989fa',
				isShow: false
			},
			{
				title: '订单列表',
				id: 2,
				to: { path: '/TAA/orderList' },
				icon: 'orders-o',
				iconColor: '#ff976a',
				isShow: false
			},
			{
				title: '解锁列表',
				id: 3,
				to: { path: '/TAA/availableTokenList' },
				icon: 'cash-on-deliver',
				iconColor: '#07c160',
				isShow: false
			},
			{
				title: '提T列表',
				id: 4,
				to: { path: '/TAA/takenTokenList' },
				icon: 'description',
				iconColor: '#d4237a',
				isShow: false
			},
			{
				title: '提T',
				id: 5,
				to: { path: '/TAA/withdrawalTaa' },
				icon: 'after-sale',
				iconColor: '#1afa29',
				isShow: false
			},
			{
				title: 'TAA钱包下载帮助(TP)',
				id: 6,
				to: { name: 'Help', query: { type: 'tp' } },
				icon: 'share-o',
				iconColor: '#1989fa',
				isShow: true
			},
			{
				title: 'TAA钱包下载帮助(NB)',
				id: 7,
				to: { name: 'Help', query: { type: 'nb' } },
				icon: 'share-o',
				iconColor: '#1989fa',
				isShow: true
			}
			// { title: '钱包余额', id: 6, to: { name: 'payForSusd' }, icon: 'balance-o', iconColor: '#f30', isShow: true }
		])
		const listNav = computed(() => list.value.filter(item => item.isShow))
		const balance = ref('')

		const show = ref(false)
		const showComp = () => {
			show.value = true
		}
		const closeComp = (val: boolean) => {
			show.value = val
			// updateShow(val)
		}
		// onMounted(() => {
		// 	getWalletBalance().then(res => {
		// 		console.log(res)
		// 		if (res.resultCode > 0) {
		// 			balance.value = res.data
		// 			// balance.value = '100.00'
		// 		}
		// 	})
		// })
		return {
			listNav,
			balance,
			show,
			showComp,
			closeComp
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.pay-list {
	padding-top: 20 * @fontSize;
	.search-icon {
		margin-right: 30 * @fontSize;
		font-size: 46 * @fontSize;
	}
}
</style>
