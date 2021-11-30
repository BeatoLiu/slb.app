<template>
	<div class="order-list">
		<Sticky :offset-top="offSetTop">
			<div class="search">总算力：{{ totalPower.toFixed(2) }} X 10</div>
		</Sticky>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<List v-model:loading="loading" :finished="finished" :finished-text="t('common.noDataText')" @load="onLoad">
					<div class="waterfall">
						<div class="wrap left" ref="left">
							<div class="item" v-for="item in dataList" :key="item.oTaobaoSubId">
								<div class="order">
									<div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%">
										<p>新增算力</p>
										<div class="order-name">
											<p>算力{{ item.oScRetSumMock.toFixed(2) }}元 X10</p>
											<p class="order-id">结算时间：{{ item.oScRetTime }}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { Sticky, PullRefresh, List } from 'vant'

import { pullRefreshListRes } from '../../apis/model/commonModel'
import { showSelfTaoKeOrderModel, showSelfTaoKeOrderItem } from '../../apis/model/taoKeModel'
import { usePullRefreshPageList } from '../../hooks/web/usePullRefreshPageList'
import { useI18n } from '../../hooks/setting/useI18n'
import { showSelfTaokeOrderSum } from '../../apis/taoKe'
import { useOffSetTop } from '../../hooks/web/useOffSetTop'

export default defineComponent({
	name: 'incomePower',
	components: {
		Sticky,
		PullRefresh,
		List
	},
	setup() {
		const { t } = useI18n()
		const { offSetTop } = useOffSetTop()

		const params = reactive<showSelfTaoKeOrderModel>({
			pageSize: 10,
			pageNum: 0,
			oScRetStatus: 1
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = <pullRefreshListRes<showSelfTaoKeOrderItem>>(
			usePullRefreshPageList('mg/taoke/showSelfTaokeOrder', params)
		)

		const totalPower = ref(0)
		onMounted(() => {
			showSelfTaokeOrderSum({ oScRetStatus: 1 }).then(res => {
				if (res.resultCode === 1) {
					totalPower.value = res.data
				}
			})
		})
		return {
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			totalPower,
			offSetTop,
			t
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.order-list {
	.search {
		background: #ffffff;
		text-align: center;
		line-height: 3;
		border: 5px solid #f2f2f2;
	}
	.list {
		.waterfall {
			overflow: hidden;
			.wrap {
				.item {
					margin-top: 20 * @fontSize;
					padding: 20 * @fontSize 20 * @fontSize;
					background-color: #fff;
					.order {
						display: flex;
						justify-content: space-between;
						align-items: flex-start;
						.order-name {
							text-align: right;
							padding: 0 20 * @fontSize;
							font-size: 28 * @fontSize;
							color: #1eeb37;
							.order-id {
								// text-align: center;
								color: #909090;
								padding-top: 5px;
								font-size: 26 * @fontSize;
							}
						}
					}
				}
			}
		}
	}
}
</style>
