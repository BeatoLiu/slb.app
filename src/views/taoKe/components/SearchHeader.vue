<template>
	<div class="search-goods-header">
		<div class="platform-list">
			<div class="search">
				<Field
					v-model="keywords"
					clearable
					readonly
					left-icon="search"
					placeholder="输入您要搜索的产品"
					@click="$router.push({ name: 'Search', query: { p: activeName, k: keywords } })"
				>
				</Field>
			</div>
			<div class="platform">
				<Tabs v-model:active="activeName">
					<Tab
						v-for="item in platformList"
						:title="item.title"
						:name="item.name"
						:key="item.name"
						:to="{ name: item.name, query: { k: keywords } }"
						replace
					></Tab>
				</Tabs>
			</div>
		</div>
		<router-view v-slot="{ Component, route }">
			<keep-alive>
				<component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
			</keep-alive>
		</router-view>
		<!-- <router-view>
			<keep-alive></keep-alive>
		</router-view> -->
		<!-- <div>
			<router-view>
				<keep-alive></keep-alive>
			</router-view>
		</div> -->
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Field, Tabs, Tab } from 'vant'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'searchHeader',
	components: {
		Field,
		Tabs,
		Tab
	},
	setup() {
		const { currentRoute } = useRouter()
		// console.log(currentRoute.value)
		const kw = currentRoute.value.query.k || ''
		const an = currentRoute.value.name || 'tb'
		const keywords = ref(kw)
		// console.log(an)
		const activeName = ref(an)
		const platformList = ref([
			{ title: '淘宝', name: 'tb' },
			{ title: '京东', name: 'jd' },
			{ title: '拼多多', name: 'pdd' },
			{ title: '唯品会', name: 'wph' }
		])
		// console.log(keywords)
		return {
			keywords,
			activeName,
			platformList
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.search-goods-header {
	.platform-list {
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		z-index: 99;
	}
	.search {
		padding: 10px;
		background: #fff;
		// height: 120*@fontSize;
		// border: 10*@fontSize solid #f7f7f7;
		.van-cell {
			padding: 5px 20px;
			border-radius: 40 * @fontSize;
			background: #f7f7f7;
		}
	}
}
</style>
