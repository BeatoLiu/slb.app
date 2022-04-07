<template>
	<div class="jd-prom">
		<Grid :column-num="3">
			<GridItem
				v-for="item in gridList"
				:key="item.id"
				:text="item.title"
				:icon="item.icon"
				@click="getGridId(item)"
			/>
		</Grid>
		<Sticky :offset-top="offSetTop">
			<Tabs v-model="active" @change="getEliteId" sticky>
				<Tab v-for="item in eliteIdList" :title="item.title" :name="item.id" :key="item.id"> </Tab>
			</Tabs>
		</Sticky>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<!-- <div class="title">为你推荐</div> -->
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<JDListItem :data="dataList"></JDListItem>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { List, PullRefresh, Sticky, Tab, Tabs, Grid, GridItem } from 'vant'
import JDListItem from '../components/JDListItem.vue'
import { useRouter } from 'vue-router'
import { useJDEliteGoods } from '@/hooks/taoKe/useJDEliteGoods'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'
import { assetsOrigin } from '@/utils/config'

export default defineComponent({
	name: 'JdIndex',
	components: {
		List,
		PullRefresh,
		// Icon,
		Sticky,
		Tab,
		Tabs,
		Grid,
		GridItem,
		JDListItem
	},
	setup() {
		const { push } = useRouter()
		const { offSetTop } = useOffSetTop()
		const data = reactive({
			gridList: [
				{ title: '今日必推', id: 31, icon: assetsOrigin + '/img/taoke/bitui.png' },
				{ title: '好券商品', id: 1, icon: assetsOrigin + '/img/taoke/quan.png' },
				{ title: '超级大卖场', id: 2, icon: assetsOrigin + '/img/taoke/chaoshi.png' },
				{ title: '9.9专区', id: 10, icon: assetsOrigin + '/img/taoke/9.9.png' },
				{ title: '热销爆品', id: 22, icon: assetsOrigin + '/img/taoke/rexiao.png' },
				{ title: '新品首发', id: 109, icon: assetsOrigin + '/img/taoke/xinpin.png' }
			],
			active: 23,
			eliteIdList: [
				{ title: '为你推荐', id: 23 },
				{ title: '美妆穿搭', id: 28 },
				{ title: '数码家电', id: 24 },
				{ title: '母婴玩具', id: 26 },
				{ title: '家具日用', id: 27 },
				{ title: '图书文具', id: 30 },
				{ title: '品牌好货', id: 32 },
				{ title: '秒杀商品', id: 33 }
			],
			params: {
				pageNum: 1,
				pageSize: 10,
				eliteId: 23,
				sortName: 'inOrderCount30Days',
				sort: 'asc'
			}
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = useJDEliteGoods(data.params)

		const getEliteId = (id: number) => {
			data.params.eliteId = id
			data.params.pageNum = 1
			onRefresh()
		}
		const getGridId = (item: any) => {
			// console.log(item)
			push({ name: 'JDGridList', query: { ...item } })
		}

		return {
			...toRefs(data),
			onLoad,
			onRefresh,
			getGridId,
			getEliteId,
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
.jd-prom {
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
