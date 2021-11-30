<template>
	<div class="search-goods-list">
		<Sticky :offset-top="offSetTop + 10">
			<div class="sort flex-space">
				<div class="flex-start" @click="sort('sales')">
					<p>销量</p>
					<Icon name="arrow-down" v-if="!salesAsc" />
					<Icon name="arrow-up" v-else />
				</div>
				<div class="flex-start" @click="sort('price')">
					<p>价格</p>
					<Icon name="arrow-down" v-if="!priceAsc" />
					<Icon name="arrow-up" v-else />
				</div>
			</div>
		</Sticky>
		<PullRefresh v-model:show="isLoading" @refresh="onRefresh">
			<div class="list">
				<!-- <div class="title">为你推荐</div> -->
				<List v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<PDDListItem :data="dataList"></PDDListItem>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, onMounted } from 'vue'
import { Sticky, Icon, PullRefresh, List, Toast } from 'vant'
import { showPddGoodsFromApi, showTaoKeGoodsFromApi } from '../../../apis/taoKe'
import { useRouter } from 'vue-router'

import PDDListItem from '../components/PDDListItem.vue'
import { useOffSetTop } from '../../../hooks/web/useOffSetTop'

export default defineComponent({
	name: 'pddSearch',
	components: {
		Sticky,
		Icon,
		PullRefresh,
		List,
		PDDListItem
	},
	setup() {
		const { offSetTop } = useOffSetTop(2)
		const { currentRoute } = useRouter()
		const data = reactive({
			isLoading: false, // 下拉刷新
			scrollTop: 0, // 页面滚动位置
			loading: false,
			finished: true,
			dataList: [],
			params: {
				pageNum: 1,
				pageSize: 10,
				keyword: '',
				// sortName: 'inOrderCount30DaysSku',
				// sort: 'asc'
				sortType: 6
			},
			salesAsc: false, // 销量升序
			priceAsc: false // 价格升序
		})

		const getData = () => {
			showPddGoodsFromApi(data.params).then(res => {
				// 加载状态结束
				// console.log(data.result_list.map_data)
				data.loading = false
				if (res.resultCode === 1) {
					const data1 = res.data ? JSON.parse(res.data) : {}
					// let result = JSON.parse(data.result)
					// console.log(data)
					// data.dataList.push(...data1.goods_list)
					data1.goods_list.forEach((item: any) => {
						data.dataList.push(item as never)
					})

					const total = data1.goods_list.total_count

					// 数据全部加载完成
					if (data.dataList.length >= total) {
						data.finished = true
					}
					// this.updateWaterfall()
				} else {
					data.finished = true
				}
			})
		}
		const onLoad = () => {
			// 异步更新数据
			setTimeout(() => {
				data.params.pageNum++
				getData()
			}, 500)
			// data.loading = false;
		}
		// 下拉刷新
		const onRefresh = () => {
			setTimeout(() => {
				Toast('刷新成功')
				data.isLoading = false
				data.params.pageNum = 1
				data.dataList = []
				data.finished = false
				getData()
			}, 500)
		}
		// 搜索
		const searchProList = () => {
			// console.log('jjjjjjjjjjjjjjjjjjjdddddddddd')
			data.isLoading = false
			data.params.keyword = currentRoute.value.query.k as string
			data.params.pageNum = 1
			data.dataList = []
			data.finished = false
			getData()
		}
		// 排序
		const sort = (val: string) => {
			if (val === 'sales') {
				data.salesAsc = !data.salesAsc
				data.params.sortType = data.salesAsc ? 5 : 6
			} else if (val === 'price') {
				data.priceAsc = !data.priceAsc
				data.params.sortType = data.priceAsc ? 3 : 4
			}
			searchProList()
		}
		onMounted(() => {
			// console.log(1111)
			searchProList()
		})
		return {
			...toRefs(data),
			onLoad,
			onRefresh,
			sort,
			offSetTop
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.search-goods-list {
	// margin-top: 98px;
	.sort {
		background: #ffffff;
		padding: 20 * @fontSize 80 * @fontSize;
		border-top: 1px solid #f7f7f7;
		border-bottom: 1px solid #f7f7f7;
	}
}
</style>
