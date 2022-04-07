<template>
	<div class="jd-prom">
		<Grid :column-num="3" :center="false">
			<GridItem
				v-for="item in gridList"
				:key="item.id"
				:text="item.title"
				:icon="item.icon"
				@click="getGridId(item)"
			>
			</GridItem>
		</Grid>
		<Sticky :offset-top="offSetTop">
			<Tabs v-model="active" @change="getEliteId" sticky>
				<Tab v-for="item in jxCodeList" :title="item.title" :name="item.id" :key="item.id"> </Tab>
			</Tabs>
		</Sticky>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<!-- <div class="title">为你推荐</div> -->
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<WPHListItem :data="dataList"></WPHListItem>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { Grid, GridItem, Sticky, Tabs, Tab, PullRefresh, List } from 'vant'
import WPHListItem from '../components/WPHListItem.vue'
import { useRouter } from 'vue-router'
import { useVopJXGoods } from '@/hooks/taoKe/useVopJXGoods'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'
import { assetsOrigin } from '@/utils/config'

export default defineComponent({
	name: 'WPHIndex',
	components: {
		Grid,
		GridItem,
		Sticky,
		Tabs,
		Tab,
		PullRefresh,
		List,
		WPHListItem
	},
	setup() {
		const { offSetTop } = useOffSetTop()
		const { push } = useRouter()
		const data = reactive({
			gridList: [
				{ title: '高算力', id: 0, icon: assetsOrigin + '/img/taoke/chaoshi.png' },
				{ title: '爆款', id: 1, icon: assetsOrigin + '/img/taoke/rexiao.png' },
				{ title: '母婴精选', id: 'gkf52p8p', icon: assetsOrigin + '/img/taoke/cat-7.png' },
				{ title: '居家精选', id: 'cnrzcs22', icon: assetsOrigin + '/img/taoke/jiaju.png' },
				{ title: '运动户外精选', id: 'indvf44e', icon: assetsOrigin + '/img/taoke/yundong.png' },
				{ title: '家用电器', id: 'uggxpyh5', icon: assetsOrigin + '/img/taoke/dianqi.png' }
			],
			active: 23,
			jxCodeList: [
				{ title: '女装', id: '7hfpy0m4' },
				{ title: '美妆', id: 'vd0wbfdx' },
				{ title: '首饰', id: 'szkl4kj7' },
				{ title: '数码', id: 'dpot8m5u' },
				{ title: '鞋包', id: 'byh9331t' },
				{ title: '男装', id: 'wj7evz2j' }
			],
			params: {
				pageNum: 1,
				pageNo: 1,
				pageSize: 10,
				fieldName: 'SALES', // PRICE
				// sort: 'asc'
				orderType: 0,
				channelType: 0, // 频道类型:0-超高佣，1-出单爆款; 当请求类型为频道时必传
				sourceType: 1, // 请求源类型：0-频道，1-组货
				jxCode: '7hfpy0m4' // 精选组货码：当请求源类型为组货时必传
			}
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = useVopJXGoods(data.params)

		const getEliteId = (id: string) => {
			data.params.jxCode = id
			data.params.pageNo = 1
			onRefresh()
		}
		const getGridId = (item: any) => {
			// console.log(item)
			push({ name: 'WPHGridList', query: { ...item } })
		}
		return {
			...toRefs(data),
			onLoad,
			onRefresh,
			getEliteId,
			getGridId,
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
	.van-grid {
		&-item {
			width: 33.33%;
			text-align: center;
			// &>div{
			//     padding: 8px !important;
			// }
			.van-grid-item__content {
				padding: 8px;
				p {
					// font-size: 12px;
					margin-top: 8px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}
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
