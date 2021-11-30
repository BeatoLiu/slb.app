<template>
	<div class="tb-prom">
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<TBListItem :data="dataList" isMaterial></TBListItem>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { PullRefresh, List, Toast } from 'vant'
import TBListItem from '../components/TBListItem.vue'
import { useTBMaterialGoods } from '../../../hooks/taoKe/useTBMaterialGoods'

export default defineComponent({
	name: 'tBPreferential',
	components: {
		PullRefresh,
		List,
		TBListItem
	},
	setup() {
		const data = reactive({
			params: {
				// siAuditStatus: 1,
				// mCode: -1,
				materialId: 4094,
				pageSize: 10,
				pageNum: 0
			}
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = useTBMaterialGoods(data.params)

		return {
			...toRefs(data),
			onLoad,
			onRefresh,
			refreshing,
			loading,
			finished,
			dataList
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
			padding: 18 * @fontSize 85 * @fontSize 18 * @fontSize 30 * @fontSize;
			line-height: 1;
			margin: 10 * @fontSize 17 * @fontSize 10 * @fontSize 19 * @fontSize;
			font-size: 30 * @fontSize;
			width: 714 * @fontSize;
			box-sizing: border-box;
			border-radius: 10 * @fontSize;
			border-top: 1px solid #f2f2f2;
			border-bottom: 1px solid #f2f2f2;
		}
	}
	.list {
		.title {
			font-size: 34 * @fontSize;
			font-weight: bold;
			line-height: 1;
			margin: 30 * @fontSize 0 26 * @fontSize 20 * @fontSize;
		}
	}
}
</style>
