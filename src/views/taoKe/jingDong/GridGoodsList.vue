<template>
	<div class="jd-prom">
		<Sticky :offset-top="offSetTop">
			<div class="title">京东{{ $route.query.title }}</div>
		</Sticky>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<JDListItem :data="dataList"></JDListItem>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { List, PullRefresh, Sticky } from 'vant'
import JDListItem from '../components/JDListItem.vue'
import { useRouter } from 'vue-router'
import { useJDEliteGoods } from '@/hooks/taoKe/useJDEliteGoods'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'

export default defineComponent({
	name: 'JDGridsList',
	components: {
		List,
		PullRefresh,
		Sticky,
		JDListItem
	},
	setup() {
		const { offSetTop } = useOffSetTop()
		const { currentRoute } = useRouter()

		const id = currentRoute.value.query.id as string
		const data = reactive({
			params: {
				pageNum: 0,
				pageSize: 10,
				eliteId: +id,
				sortName: 'inOrderCount30Days',
				sort: 'asc'
			}
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = useJDEliteGoods(data.params)

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
	.title {
		padding: 30 * @fontSize 0 26 * @fontSize 20 * @fontSize;
		font-weight: bold;
		font-size: 34 * @fontSize;
		line-height: 1;
		background-color: #f7f7f7;
	}
}
</style>
