<template>
	<div class="search-kw">
		<!-- <Sticky :offset-top="46"> -->
		<div class="search-input">
			<form action="javascript:return true">
				<Search
					v-model="keywords"
					shape="round"
					show-action
					placeholder="输入您要搜索的产品"
					@fontSizeearch="searchGoods('')"
				>
					<template #action>
						<div @click="searchGoods('')">搜索</div>
					</template>
				</Search>
			</form>
		</div>
		<!-- </Sticky> -->

		<div class="platform">
			<Tabs v-model:active="activeName">
				<Tab v-for="item in platformList" :title="item.title" :name="item.name" :key="item.name"></Tab>
			</Tabs>
		</div>
		<div class="history-list" v-if="historyList.length">
			<Cell title="历史搜索">
				<template #right-icon>
					<Icon name="delete" class="search-icon" @click="clearHistory" />
				</template>
			</Cell>
			<div class="list-content">
				<Tag
					v-for="item in historyList"
					round
					color="#f2f2f2"
					text-color="#505050"
					:key="item"
					@click="searchGoods(item)"
					>{{ item }}</Tag
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Search, Cell, Icon, Tabs, Tab, Tag, Toast } from 'vant'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'TaokeSearch',
	components: {
		Search,
		Cell,
		Icon,
		Tabs,
		Tab,
		Tag
	},
	setup() {
		const { currentRoute, replace } = useRouter()
		const kw = currentRoute.value.query.k || ''
		const an = currentRoute.value.query.p || 'tb'
		// console.log(an)
		const keywords = ref(kw)
		const activeName = ref(an)
		const platformList = ref([
			{ title: '淘宝', name: 'tb' },
			{ title: '京东', name: 'jd' },
			{ title: '拼多多', name: 'pdd' },
			{ title: '唯品会', name: 'wph' }
		])
		const hl = JSON.parse(window.localStorage.historyList || '[]') // 历史搜索
		// console.log(hl)
		const historyList = ref(hl)

		const searchGoods = (val: string) => {
			let k = keywords.value
			if (val) {
				k = val
			} else {
				if (!keywords.value) {
					return Toast('请输入正确商品名称')
				}
				if (!historyList.value.includes(keywords.value)) {
					historyList.value.push(keywords.value)
				}
				window.localStorage.historyList = JSON.stringify(historyList.value)
			}
			const routerName = activeName.value as string
			// console.log(routerName)
			// if(routerName === 'pdd') {
			//     return Toast('拼多多搜索功能正在维护中。给您带来不便，深感抱歉')
			// }
			replace({ name: routerName, query: { k } })
		}
		const clearHistory = () => {
			historyList.value = []
			window.localStorage.historyList = '[]'
		}
		return {
			keywords,
			activeName,
			platformList,
			historyList,
			searchGoods,
			clearHistory
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.search-kw {
	min-height: calc(100vh - 90px);
	background: #fff;
	.search-input {
		// padding: 10*@fontSize;
		// margin-top: 46px;
		// .van-cell{
		//     border: solid 1px red;
		//     border-radius: 20px;
		// }
		.van-search {
			&__content {
				background: #fff;
				border: solid 1px red;
			}

			// border-radius: 20px;
		}
	}
	.history-list {
		margin-top: 40 * @fontSize;
		.van-cell::after {
			border: none;
		}
		.list-content {
			padding: 0 6px;
			span {
				margin-top: 10 * @fontSize;
				margin-left: 10 * @fontSize;
			}
		}
	}
}
</style>
