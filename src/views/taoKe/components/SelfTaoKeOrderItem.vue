<template>
	<div class="order-list">
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<!-- 要注意在vant3中，這裏是v-model:loading，跟vant2中不一樣，如果用vant2的那種寫法（v-model），會多次換發load事件（花了一天才解決問題） -->
				<List v-model:loading="loading" :finished="finished" :finished-text="t('common.noDataText')" @load="onLoad">
					<div class="waterfall">
						<div class="wrap left" ref="left">
							<div class="item" v-for="item in dataList" :key="item.oTaobaoSubId">
								<template v-if="item.gName">
									<div class="shop-name">
										<div style="display: flex; justify-content: flex-start; align-items: center">
											<div>
												<img
													src="../../../assets/img/icon_pic_tiaomao.png"
													alt=""
													v-if="item.oPlatformType === '天猫'"
												/>
												<img src="../../../assets/img/icon_pic_tao.png" alt="" v-if="item.oPlatformType === '淘宝'" />
											</div>
											<p>{{ item.gSellerShopName }}</p>
										</div>
										<p style="color: #ff5000">{{ item.oPayStatusDesc }}</p>
									</div>
									<div class="order">
										<div style="display: flex; justify-content: flex-start; align-items: flex-start">
											<div class="order-img">
												<img :src="item.gMainPic" alt="" class="img" v-if="item.oPlatformSource === 0" />
												<Icon
													name="jingdong2"
													class-prefix="icon"
													v-else-if="item.oPlatformSource === 1"
													style="color: red"
												/>
												<Icon
													name="pinduoduo"
													class-prefix="icon"
													v-else-if="item.oPlatformSource === 2"
													style="color: red"
												/>
												<Icon
													name="meituan"
													class-prefix="icon"
													v-else-if="item.oPlatformSource === 3"
													style="color: red"
												/>
												<Icon
													name="weipinhui"
													class-prefix="icon"
													v-else-if="item.oPlatformSource === 4"
													style="color: red"
												/>
												<Icon
													name="mogujieicon"
													class-prefix="icon"
													v-else-if="item.oPlatformSource === 5"
													style="color: red"
												/>
											</div>
											<div class="order-name">
												<p class="gname">{{ item.gName }}</p>
												<p
													class="order-id"
													:id="'copy-btn' + item.oTaobaoSubId"
													:data-clipboard-text="item.oTaobaoSubId"
													@click="clipboard('#copy-btn' + item.oTaobaoSubId, { des: '订单' })"
												>
													{{ item.oTaobaoSubId !== item.oTaobaoOrderId ? '子' : '' }}订单:{{ item.oTaobaoSubId }}
												</p>
												<p class="order-id" v-if="item.oTaobaoSubId !== item.oTaobaoOrderId">
													母订单:{{ item.oTaobaoOrderId }}
												</p>
												<p class="order-id">创建时间:{{ item.createTime }}</p>
											</div>
										</div>
										<div class="order-content">
											<p class="money">&nbsp;{{ item.gPrice }}</p>
											<p>x{{ item.gCount }}</p>
										</div>
									</div>
									<div style="display: flex; color: red; justify-content: flex-end">
										<p>预计返{{ calcSie(item) }}TAA</p>
										<p style="margin-left: 20px">{{ item.oScRetStatusDesc }}</p>
									</div>
									<div class="order-pay">商品价格&#165;{{ item.gPrice }}</div>
								</template>
								<template v-else>
									<div class="order-pre">
										<p style="color: #909090">订单:{{ item.oTaobaoSubId }}</p>
										<p style="color: red" v-if="item.oApplyStatus === 0">暂由人工审核，数据有所延迟，请知悉……</p>
										<p style="color: gray" v-else-if="item.oApplyStatus === 2">
											该订单匹配失败，请确认订单号录入是否有误、是否使用了淘宝超级红包、是否使用了他人的购物链接
										</p>
										<p style="color: #1989fa" v-else-if="item.oApplyStatus === 3">订单暂无匹配</p>
									</div>
								</template>
							</div>
						</div>
					</div>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, unref, watch } from "vue";
import { Icon, List, PullRefresh } from "vant";

import { usePullRefreshPageList } from "@/hooks/web/usePullRefreshPageList";
import { IShowSelfTaoKeOrderItem, IShowSelfTaoKeOrderModel } from "@/apis/model/taoKeModel";
import { IPullRefreshListRes } from "@/apis/model/commonModel";
import { useI18n } from "@/hooks/setting/useI18n";
import { useRouter } from "vue-router";
import { useCalcPower } from "@/hooks/web/useCalcPower";
import useClipboard from "../../../hooks/web/useClipboard";

export default defineComponent({
	name: 'selfTaoKeOrderItem',
	components: { PullRefresh, List, Icon },
	setup() {
		const { t } = useI18n()
		const clipboard = useClipboard()
		const params = reactive<IShowSelfTaoKeOrderModel>({
			pageSize: 10,
			pageNum: 0,
			oScRetStatus: -1
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = <IPullRefreshListRes<IShowSelfTaoKeOrderItem>>(
			usePullRefreshPageList('mg/taoke/showSelfTaokeOrder', params)
		)
		const { currentRoute } = useRouter()
		// 監聽路由變化，請求不同結算狀態的訂單列表
		watch(
			() => currentRoute.value.path,
			() => {
				const route = unref(currentRoute)
				params.oScRetStatus = +route.params.status
				onRefresh()
			},
			{ deep: true }
		)
		// 返利
		const calcSie = (item: IShowSelfTaoKeOrderItem) => {
			const { oCommissionSum } = item
			return useCalcPower(oCommissionSum)
		}

		return {
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			clipboard,
			calcSie,
			t
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.order-list {
	.list {
		.title {
			margin: 30 * @fontSize 0 26 * @fontSize 20 * @fontSize;
			font-weight: bold;
			font-size: 34 * @fontSize;
		}
		.waterfall {
			// overflow: hidden;
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
						align-items: flex-start;
						justify-content: space-between;
						.order-img {
							width: 34%;
							text-align: center;
							i {
								color: red;
								font-size: 50px;
							}
						}
						img {
							// height: 340*@fontSize;
							width: 340 * @fontSize;
							border-radius: 5px;
						}
						.order-name {
							width: 66%;
							padding: 0 20 * @fontSize;
							font-size: 28 * @fontSize;
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
						padding: 10px 0;
						// height: 100*@fontSize;
					}
				}
			}
		}
	}
}
</style>
