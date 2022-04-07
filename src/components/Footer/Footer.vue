<template>
	<div class="wrapper">
		<router-view v-slot="{ Component, route }">
			<transition :name="route.meta.transition || 'fade'" mode="out-in">
				<keep-alive :include="cacheList">
					<component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
				</keep-alive>
				<!-- <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" /> -->
			</transition>
		</router-view>
		<Tabbar v-model="active" active-color="#39b9b9" route safe-area-inset-bottom>
			<!-- :icon="item.icon" -->
			<TabbarItem v-for="item in nav" :name="item.to" :to="{ name: item.to }" :key="item.to">
				<template #icon="props">
					<Icon :name="props.active ? item.icon.active : item.icon.inactive" />
					<!-- <img :src="props.active ? item.icon.active : item.icon.inactive" /> -->
				</template>
				{{ item.name }}
			</TabbarItem>
		</Tabbar>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { Tabbar, TabbarItem, Icon } from 'vant'
import { useI18n } from '@/hooks/setting/useI18n'
// import { useRouter } from 'vue-router'
export default defineComponent({
	name: 'FooterNav',
	components: {
		Tabbar,
		TabbarItem,
		Icon
	},
	setup() {
		const { t } = useI18n()
		const data = reactive({
			active: 'Home',
			nav: [
				{
					icon: {
						active: 'wap-home',
						inactive: 'wap-home-o'
					},
					to: 'Home',
					name: t('routes.home')
				},
				{
					// icon: 'gold-coin',
					icon: {
						active: 'gold-coin',
						inactive: 'gold-coin-o'
					},
					to: 'Slb',
					name: t('routes.slb')
				},
				{
					// icon: 'shop',
					icon: {
						active: 'shop',
						inactive: 'shop-o'
					},
					to: 'MxMall',
					name: t('routes.mxMall')
					// extra: true
				},

				{
					// icon: 'manager',
					icon: {
						active: 'manager',
						inactive: 'manager-o'
					},
					to: 'Mine',
					name: t('routes.mine')
				}
			]
		})

		return {
			...data,
			cacheList: /^\w.*-alive$/ // ['home-alive'] ///^\w.-alive*$/
			// t
		}
	}
})
</script>

<style scoped lang="less">
@import '../../assets/css/local.less';
.wrapper {
	box-sizing: border-box;
	padding-bottom: 120 * @fontSize;
	.van-tabbar-item--active {
		// background-color: @primaryColor;

		.van-badge__wrapper {
			// background-color: @primaryColor;
		}
	}
}
</style>
