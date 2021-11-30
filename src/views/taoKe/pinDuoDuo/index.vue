<template>
	<div class="jd-prom">
		<!-- <van-grid :column-num="2" :center="false">
            <van-grid-item v-for="item in gridList" :key="item.id" :text="item.title" @click="getGridId(item)">
                <van-image :src="item.icon" />
                <p>{{item.title}}</p>
            </van-grid-item>
        </van-grid> -->
		<Sticky :offset-top="offSetTop">
			<Tabs v-model="active" @change="getEliteId" sticky>
				<Tab v-for="item in optIdList" :title="item.title" :name="item.id" :key="item.id"> </Tab>
			</Tabs>
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
import { defineComponent, reactive, toRefs } from 'vue'
import { Sticky, Tabs, Tab, PullRefresh, List, Toast } from 'vant'
import PDDListItem from '../components/PDDListItem.vue'
import { showPddGoodsFromApi } from '../../../apis/taoKe'
import { useOffSetTop } from '../../../hooks/web/useOffSetTop'

export default defineComponent({
	name: 'pDDIndex',
	components: {
		Sticky,
		Tabs,
		Tab,
		PullRefresh,
		List,
		PDDListItem
	},
	setup() {
		const { offSetTop } = useOffSetTop()
		const data = reactive({
			active: 23,
			optIdList: [
				{ title: '女装', id: 14 },
				{ title: '美妆', id: 16 },
				{ title: '母婴', id: 4 },
				{ title: '食品', id: 1 },
				{ title: '鞋包', id: 1281 },
				{ title: '男装', id: 743 },
				{ title: '家纺', id: 818 },
				{ title: '文具', id: 2478 }
			],
			isLoading: false, // 下拉刷新
			scrollTop: 0, // 页面滚动位置
			loading: false,
			finished: false,
			dataList: [],
			params: {
				pageNum: 1,
				pageSize: 10,
				optId: 14,
				// sortName: 'inOrderCount30DaysSku',
				// sort: 'asc'
				/** 排序方式:0-综合排序;1-按佣金比率升序;2-按佣金比例降序;
				 * 3-按价格升序;4-按价格降序;5-按销量升序;6-按销量降序;7-优惠券金额排序升序;8-优惠券金额排序降序;
				 * 9-券后价升序排序;10-券后价降序排序;11-按照加入多多进宝时间升序;12-按照加入多多进宝时间降序;13-按佣金金额升序排序;
				 * 14-按佣金金额降序排序;15-店铺描述评分升序;16-店铺描述评分降序;17-店铺物流评分升序;18-店铺物流评分降序;19-店铺服务评分升序;
				 * 20-店铺服务评分降序;27-描述评分击败同类店铺百分比升序，28-描述评分击败同类店铺百分比降序，29-物流评分击败同类店铺百分比升序，
				 * 30-物流评分击败同类店铺百分比降序，31-服务评分击败同类店铺百分比升序，32-服务评分击败同类店铺百分比降序
				 * */
				sortType: 6,
				keyword: ''
			}
		})
		const getData = () => {
			showPddGoodsFromApi(data.params).then(res => {
				// 加载状态结束
				data.loading = false
				if (res.resultCode == 1) {
					const data1 = res.data ? JSON.parse(res.data) : {}
					// let result = JSON.parse(data.result)
					data1.goods_list.forEach((item: any) => {
						data.dataList.push(item as never)
					})
					// data.dataList.push(...data1.goods_list)
					const total = data1.goods_list.total_count

					// 数据全部加载完成
					if (data.dataList.length >= total) {
						data.finished = true
					}
					// data.updateWaterfall()
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
		const getEliteId = (id: number) => {
			data.dataList = []
			data.params.optId = id
			data.params.pageNum = 1
			getData()
		}
		return {
			...toRefs(data),
			onLoad,
			onRefresh,
			getEliteId,
			offSetTop
		}
	}
})
</script>

<style lang="less" scoped></style>
