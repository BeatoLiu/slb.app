<template>
	<div>
		<Sticky :offset-top="offSetTop">
			<Tabs v-model:active="activeName">
				<Tab
					v-for="item in navList"
					:title="item.title"
					:name="item.to.name"
					:key="item.title"
					:to="item.to"
					replace
				>
				</Tab>
			</Tabs>
		</Sticky>
		<!-- <router-view></router-view> -->
		<router-view v-slot="{ Component, route }">
			<keep-alive :include="cacheList">
				<component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
			</keep-alive>
		</router-view>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { Tab, Tabs, Sticky } from 'vant'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'
export default defineComponent({
	name: 'BankTranNav',
	components: {
		Tab,
		Tabs,
		Sticky
	},
	setup() {
		const { offSetTop } = useOffSetTop()
		const activeName = ref('BankTransOrderSUSD')
		const navList = reactive([
			{ to: { name: 'BankTransOrderSUSD' }, title: '数点兑换' },
			{ to: { name: 'BankTransOrderYDB' }, title: '溢多宝' }
		])

		return {
			activeName,
			navList,
			offSetTop,
			cacheList: /^\w.*-alive$/
		}
	}
})
</script>
