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

import { IBasePageParams } from "@/apis/model/base"
import { IPullRefreshListRes } from "@/apis/model/commonModel"
import { ISelectMemberBenefitListItem } from "@/apis/model/memModel"
import { usePullRefreshPageList } from "@/hooks/web/usePullRefreshPageList"
export default defineComponent({
	name: 'SelectMemberBenefitList-alive',
	components: { PullRefresh, List },
	setup() {
		const params = reactive<IBasePageParams>({
			pageSize: 10,
			pageNum: 0
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = <
			IPullRefreshListRes<ISelectMemberBenefitListItem>
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
		line-height: 3;
		text-align: center;
		background: #fff;
		border: 5px solid #f2f2f2;
	}
	.list {
		.title {
			margin: 30 * @fontSize 0 26 * @fontSize 20 * @fontSize;
			font-weight: bold;
			font-size: 34 * @fontSize;
			// line-height: 1;
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
						display: flex;
						align-items: center;
						justify-content: space-between;
						height: 74 * @fontSize;
						img {
							flex-shrink: 0;
							height: 34 * @fontSize;
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
							flex: 1;
							width: 50%;
							padding: 0 20 * @fontSize;
							font-size: 28 * @fontSize;
							text-align: left;
							// color: #1eeb37;
							.gname {
								height: 78 * @fontSize;
								overflow: hidden;
							}
							.order-id {
								// text-align: center;
								padding-top: 5px;
								color: #909090;
								font-size: 26 * @fontSize;
							}

							.isPlus {
								color: red;
							}
						}
						.order-remark {
							width: 50%;
							overflow: hidden;
							color: blue;
							white-space: nowrap;
							text-decoration: underline;
							text-overflow: ellipsis;
						}
						.order-content {
							text-align: right;
							.money {
								font-size: 28 * @fontSize;
								&::before {
									font-size: 18 * @fontSize;
									content: '\00A5';
								}
							}
						}
					}
					.order-pay {
						padding: 10px 0;
						color: #505050;
						letter-spacing: 1px;
						text-align: right;
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
