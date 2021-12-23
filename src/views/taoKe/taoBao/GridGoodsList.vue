<template>
	<div class="tb-prom">
		<Sticky :offset-top="offSetTop">
			<Tabs v-model:active="active" @change="getEliteId" sticky>
				<Tab v-for="item in eliteIdList[$route.query.type]" :title="item.title" :name="item.id" :key="item.id">
				</Tab>
			</Tabs>
		</Sticky>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<div class="title">{{ $route.query.title }}</div>
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<TBListItem :data="dataList" isMaterial></TBListItem>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { List, PullRefresh, Sticky, Tab, Tabs } from 'vant'
import { useRouter } from 'vue-router'
import TBListItem from '../components/TBListItem.vue'
import { useTBMaterialGoods } from '@/hooks/taoKe/useTBMaterialGoods'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'

interface eliteIdListModel {
	[key: string]: Array<any>
}
export default defineComponent({
	name: 'TbGridGoodsList',
	components: {
		List,
		PullRefresh,
		Sticky,
		Tab,
		Tabs,
		TBListItem
	},
	setup() {
		const { offSetTop } = useOffSetTop()
		const { currentRoute } = useRouter()
		const materialId = currentRoute.value.query.materialId as string
		const data = reactive({
			active: 3786,
			params: {
				materialId: +materialId,
				pageSize: 10,
				pageNum: 0
			}
		})
		const eliteIdList = reactive<eliteIdListModel>({
			hot: [
				// 热销
				{ title: '综合', id: 28026 },
				{ title: '大服饰', id: 28029 },
				{ title: '大快消', id: 28027 },
				{ title: '电器美家', id: 28028 }
			],
			ticket: [
				// 大额券
				{ title: '综合', id: 27446 },
				{ title: '女装', id: 27448 },
				{ title: '食品', id: 27451 },
				{ title: '美妆个护', id: 27453 },
				{ title: '家居家装', id: 27798 }
			],
			benifit: [
				// 高佣榜
				{ title: '综合', id: 13366 },
				{ title: '女装', id: 13367 },
				{ title: '美妆个护', id: 13371 },
				{ title: '食品', id: 13375 },
				{ title: '男装', id: 13372 },
				{ title: '鞋包配饰', id: 13370 },
				{ title: '内衣', id: 13373 }
			],
			fashion: [
				// 潮流范
				{ title: '综合', id: 4093 }
			],
			mom: [
				// 母婴主题
				{ title: '备孕', id: 4040 },
				{ title: '0至6个月', id: 4041 },
				{ title: '4至6岁', id: 4044 },
				{ title: '7至12个月', id: 4042 },
				{ title: '1至3岁', id: 4043 }
			],
			life: [
				// 潮流范
				{ title: '综合', id: 30443 }
			]
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = useTBMaterialGoods(data.params)
		const getEliteId = (id: number) => {
			// data.dataList = []
			data.params.materialId = id
			data.params.pageNum = 1
			onRefresh()
		}

		return {
			...toRefs(data),
			onLoad,
			onRefresh,
			getEliteId,
			eliteIdList,
			refreshing,
			loading,
			finished,
			dataList,
			offSetTop
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.tb-prom {
	// margin-top: 46px;
	.search {
		position: relative;
		// padding: 5px 0;
		border: 15 * @fontSize solid #f7f7f7;
		input {
			box-sizing: border-box;
			width: 714 * @fontSize;
			margin: 10 * @fontSize 17 * @fontSize 10 * @fontSize 19 * @fontSize;
			padding: 18 * @fontSize 85 * @fontSize 18 * @fontSize 30 * @fontSize;
			font-size: 30 * @fontSize;
			line-height: 1;
			border-top: 1px solid #f2f2f2;
			border-bottom: 1px solid #f2f2f2;
			border-radius: 10 * @fontSize;
		}
	}
	.list {
		.title {
			margin: 30 * @fontSize 0 26 * @fontSize 20 * @fontSize;
			font-weight: bold;
			font-size: 34 * @fontSize;
			line-height: 1;
		}
	}
}
</style>
