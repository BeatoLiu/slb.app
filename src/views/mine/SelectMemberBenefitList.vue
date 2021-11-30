<template>
	<div class="order-list">
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<div class="waterfall">
						<div class="wrap left" ref="left">
							<div class="item" v-for="item in dataList" :key="item.madCode">
								<div class="order">
									<div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%">
										<div style="width: 50%">
											<p class="order-id">{{ item.createTime }}</p>
											<p
												class="order-remark"
												@click="showRemark(item.madCode, item.maRemark)"
												v-if="item.maSetStatus === 3"
											>
												{{ item.maRemark }}
											</p>
											<p :class="{ success: item.maSetStatus === 2 || item.maSetStatus === 5 }" v-else>
												{{ item.maRemark }}
											</p>
											<p>订单:{{ item.madCode }}</p>
											<p>{{ item.maBizRemark }}</p>
										</div>

										<div class="order-name">
											<!-- 应收 -->
											<p v-if="!(item.maSetStatus === 2 || item.maSetStatus === 5)">
												收益：
												{{
													item.maBizType !== 6
														? '' + item.maSum + (item.maSumCurrencyTypeName || '')
														: '' + item.tokenSUm + item.tokenName
												}}
											</p>
											<!-- 实收 -->
											<p class="isPlus" v-if="item.maSetStatus === 2 || item.maSetStatus === 5">
												收益： {{ item.tokenSUm }}({{ item.tokenName }})
											</p>
											<p :class="{ success: item.maSetStatus === 2 || item.maSetStatus === 5 }">
												{{ item.maSetStatusName }}
											</p>
											<p>来源：{{ item.maBizTypeName }}</p>
											<!-- <p class="order-id">结算时间：{{item.oSettleTime}}</p> -->
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
import { defineComponent, reactive } from 'vue'
import { PullRefresh, List, Dialog } from 'vant'

import { basePageParams } from '../../apis/model/base'
import { pullRefreshListRes } from '../../apis/model/commonModel'
import { selectMemberBenefitListItem } from '../../apis/model/memModel'
import { usePullRefreshPageList } from '../../hooks/web/usePullRefreshPageList'
export default defineComponent({
	name: 'selectMemberBenefitList-alive',
	components: { PullRefresh, List },
	setup() {
		const params = reactive<basePageParams>({
			pageSize: 10,
			pageNum: 0
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = <
			pullRefreshListRes<selectMemberBenefitListItem>
		>usePullRefreshPageList('mem/memberAcct/selectMemberBenefitList', params, { method: 'POST' })

		const showRemark = (madCode: number, maRemark: string) => {
			// const { madCode, maRemark } = item
			Dialog({
				title: madCode + '',
				message: maRemark
			})
		}

		return {
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			showRemark
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.order-list {
	// margin-top: 46px;
	.search {
		background: #ffffff;
		text-align: center;
		line-height: 3;
		border: 5px solid #f2f2f2;
	}
	.list {
		.title {
			font-size: 34 * @fontSize;
			font-weight: bold;
			// line-height: 1;
			margin: 30 * @fontSize 0 26 * @fontSize 20 * @fontSize;
		}
		.waterfall {
			// padding: 0 20*@fontSize;
			overflow: hidden;
			// display: flex;
			// align-items:flex-flex-;
			// justify-content: space-around;
			.wrap {
				.item {
					margin-top: 20 * @fontSize;
					padding: 20 * @fontSize 20 * @fontSize;
					background-color: #fff;
					.shop-name {
						height: 74 * @fontSize;
						display: flex;
						justify-content: space-between;
						align-items: center;
						img {
							height: 34 * @fontSize;
							flex-shrink: 0;
							margin-right: 5px;
						}
					}
					.order {
						display: flex;
						justify-content: space-between;
						// align-items: flex-;
						img {
							// height: 340*@fontSize;
							width: 340 * @fontSize;
							border-radius: 5px;
						}
						.order-name {
							width: 50%;
							text-align: left;
							padding: 0 20 * @fontSize;
							font-size: 28 * @fontSize;
							flex: 1;
							// color: #1eeb37;
							.gname {
								height: 78 * @fontSize;
								overflow: hidden;
							}
							.order-id {
								// text-align: center;
								color: #909090;
								padding-top: 5px;
								font-size: 26 * @fontSize;
							}

							.isPlus {
								color: red;
							}
						}
						.order-remark {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							color: blue;
							text-decoration: underline;
							width: 50%;
						}
						.order-content {
							text-align: right;
							.money {
								font-size: 28 * @fontSize;
								&::before {
									content: '\00A5';
									font-size: 18 * @fontSize;
								}
							}
						}
					}
					.order-pay {
						padding: 10px 0;
						text-align: right;
						letter-spacing: 1px;
						color: #505050;
					}
					.order-pre {
						height: 100 * @fontSize;
					}
				}
			}
		}
	}
	.success {
		color: #19be6b;
	}
}
</style>
