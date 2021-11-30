<template>
	<div class="jd-prom">
		<Sticky :offset-top="offSetTop">
			<div class="title">唯品会{{ $route.query.title }}</div>
		</Sticky>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<WPHListItem :data="dataList"></WPHListItem>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { List, PullRefresh, Sticky } from 'vant'
import WPHListItem from '../components/WPHListItem.vue'
import { useRouter } from 'vue-router'
import { useVopJXGoods } from '../../../hooks/taoKe/useVopJXGoods'
import { useOffSetTop } from '../../../hooks/web/useOffSetTop'

export default defineComponent({
	name: 'wphGridProm',
	components: {
		List,
		PullRefresh,
		Sticky,
		WPHListItem
	},
	setup() {
		const { offSetTop } = useOffSetTop()
		const { currentRoute } = useRouter()
		const id = currentRoute.value.query.id as string
		const data = reactive({
			params: {
				// pageNum為了vopSelectGoodsListModel才加的屬性，其實沒有實質作用
				pageNum: 0,
				pageNo: 0,
				pageSize: 10,
				fieldName: 'SALES', // PRICE
				// sort: 'asc'
				orderType: 0,
				channelType: +id, // 频道类型:0-超高佣，1-出单爆款; 当请求类型为频道时必传
				sourceType: id.length > 1 ? 1 : 0, // 请求源类型：0-频道，1-组货
				jxCode: id // 精选组货码：当请求源类型为组货时必传
			}
		})

		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = useVopJXGoods(data.params)

		return {
			...toRefs(data),
			onLoad,
			onRefresh,
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
	.list {
		.title {
			font-size: 34 * @fontSize;
			font-weight: bold;
			line-height: 1;
			padding: 10 * @fontSize 0 26 * @fontSize 10 * @fontSize;
			background-color: #f7f7f7;
		}
	}
}
</style>
