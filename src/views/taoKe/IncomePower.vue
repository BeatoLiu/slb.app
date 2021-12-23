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

import { IPullRefreshListRes } from "@/apis/model/commonModel"
import { IShowSelfTaoKeOrderModel, IShowSelfTaoKeOrderItem } from "@/apis/model/taoKeModel"
import { usePullRefreshPageList } from "@/hooks/web/usePullRefreshPageList"
import { useI18n } from "@/hooks/setting/useI18n"
import { showSelfTaokeOrderSum } from "@/apis/taoKe"
import { useOffSetTop } from "@/hooks/web/useOffSetTop"

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

		const params = reactive<IShowSelfTaoKeOrderModel>({
			pageSize: 10,
			pageNum: 0,
			oScRetStatus: 1
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = <IPullRefreshListRes<IShowSelfTaoKeOrderItem>>(
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
		line-height: 3;
		text-align: center;
		background: #fff;
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
						align-items: flex-start;
						justify-content: space-between;
						.order-name {
							padding: 0 20 * @fontSize;
							color: #1eeb37;
							font-size: 28 * @fontSize;
							text-align: right;
							.order-id {
								// text-align: center;
								padding-top: 5px;
								color: #909090;
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
