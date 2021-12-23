<template>
	<div class="tb-prom">
		<!-- <van-grid :column-num="3">
            <van-grid-item v-for="item in gridList" :key="item.id" :text="item.title" :icon="item.icon"  @click="getGridId(item)"/>
        </van-grid> -->
		<Sticky :offset-top="offSetTop">
			<Tabs v-model="active" @change="getEliteId" sticky>
				<Tab v-for="item in eliteIdList" :title="item.title" :name="item.id" :key="item.id"> </Tab>
			</Tabs>
		</Sticky>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<!-- <div class="title">为你推荐</div> -->
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<TBListItem :data="dataList" isMaterial></TBListItem>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { Sticky, Tabs, Tab, PullRefresh, List } from 'vant'
import TBListItem from '../components/TBListItem.vue'
// import { showTaoKeGoodsBymaterialId } from '../../../apis/taoKe'
import { useTBMaterialGoods } from '@/hooks/taoKe/useTBMaterialGoods'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'

export default defineComponent({
	name: 'TbIndex',
	components: {
		Sticky,
		Tabs,
		Tab,
		PullRefresh,
		List,
		TBListItem
	},
	setup() {
		const { offSetTop } = useOffSetTop()
		const data = reactive({
			active: 3786,
			eliteIdList: [
				{ title: '综合', id: 3786 },
				{ title: '女装', id: 3788 },
				{ title: '美妆个护', id: 3794 },
				{ title: '食品', id: 3791 },
				{ title: '鞋包配饰', id: 3796 },
				{ title: '男装', id: 3790 },
				{ title: '内衣', id: 3787 },
				{ title: '家居家装', id: 3792 }
			],
			params: {
				// siAuditStatus: 1,
				// mCode: -1,
				materialId: 31362, // 3786
				pageSize: 10,
				pageNum: 0
			}
		})

		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = useTBMaterialGoods(data.params)

		const getEliteId = (id: number) => {
			data.params.materialId = id
			data.params.pageNum = 1
			onRefresh()
		}

		return {
			...toRefs(data),
			getEliteId,
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
