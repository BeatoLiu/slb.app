<template>
	<div class="my-order">
		<Tabs v-model:active="active" @change="handChange">
			<Tab title="全部"></Tab>
			<Tab title="待付款"></Tab>
			<Tab title="待发货"></Tab>
			<Tab title="待收货"></Tab>
			<Tab title="评价"></Tab>
			<Tab title="退款"></Tab>
		</Tabs>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<List v-model:loading="loading" :finished="finished" :finished-text="t('common.noDataText')" @load="onLoad">
				<div class="list" v-for="item in dataList" :key="item.podCode">
					<div class="title">
						<!-- <img src="../../assets/img/mixuan/home.png" alt="" /> -->
						<Icon name="shop-o" />
						<span>{{ item.mName }}＞</span>
						<div class="state">{{ item.podStatusName }}</div>
					</div>
					<div class="cont">
						<img :src="imgPath(item.prdCsPicName)" alt="" />
						<div class="info">
							<!--  保品质 售后坏掉退款 -->
							<div class="title">{{ item.prdCName }}</div>
							<p v-if="item.prdCsSkuCollection.length">规格：{{ skuName(item.prdCsSkuCollection) }}</p>
							<div class="price">
								<span>{{ item.pointMCode ? 'VBM' + item.pointNumber : '￥' + item.prdSum / item.prdCount }}</span>
								<span class="num">x{{ item.prdCount }} </span>
							</div>
						</div>
						<div class="wrapper">
							共{{ item.prdCount }}件商品&nbsp;&nbsp; 合计：<span>{{
								item.pointMCode ? (item.pointNumber * item.prdCount).toFixed(2) : '￥' + item.prdSum
							}}</span>
							{{ item.pointMCode ? 'VBM' : '元' }} &nbsp;&nbsp; 金额：<span class="dis-price">{{
								item.pointMCode ? (item.pointNumber * item.prdCount).toFixed(2) : item.prdSum
							}}</span
							>({{ item.pointMCode ? 'VBM' : item.orderPayTypeName === 'CNY' ? '元' : item.orderPayTypeName }})
						</div>
					</div>

					<div class="foot">
						<!-- v-if="item.podStatus == 0" -->
						<div class="btn active" @click="choosePayType(item)" v-if="item.podStatus === 0">付款</div>
						<div class="btn active" v-if="item.podStatus === 3" @click="conReception(item.podCode)">确认收货</div>
						<div class="btn active" v-if="item.podStatus === 1">评价</div>
						<div class="btn active" @click="$router.push({ name: 'MyOrderDetail', query: { podCode: item.podCode } })">
							订单详情
						</div>
					</div>
				</div>
			</List>
		</PullRefresh>
		<PayComponent ref="paychild" :poCode="poCode" :podCode="podCode" :show="show" @close="close" />
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { PullRefresh, List, Tab, Tabs, Icon, Dialog } from 'vant'

import { usePullRefreshPageList } from "@/hooks/web/usePullRefreshPageList"
import { useI18n } from "@/hooks/setting/useI18n"
import { useImgPath } from "@/hooks/mx/useImgPath"
import { useSkuName } from "@/hooks/mx/useSkuName"
import { IShowSelfOrderDetailModel, IShowSelfOrderDetailItem } from "@/apis/model/mxModel"
import { IPullRefreshListRes } from "@/apis/model/commonModel"
import { confirmTakeDelivery } from "@/apis/mx"
import PayComponent from './components/PayComponent.vue'
export default defineComponent({
	name: 'ShowSelfOrderDetail-alive',
	components: { PullRefresh, List, Tab, Tabs, Icon, PayComponent },
	setup() {
		const { t } = useI18n()
		const { imgPath } = useImgPath()
		const { skuName } = useSkuName()

		const params = reactive<IShowSelfOrderDetailModel>({
			pageSize: 10,
			pageNum: 0,
			payStatus: -1,
			oStatus: -1
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = <
			IPullRefreshListRes<IShowSelfOrderDetailItem>
		>usePullRefreshPageList('mem/order/showSelfOrderDetail', params)

		const active = ref(0)
		// 切換tabs
		const handChange = (name: number) => {
			if (name === 0) {
				params.oStatus = -1
			} else if (name === 1) {
				params.oStatus = 0
			} else if (name === 4) {
				params.oStatus = 1
			} else {
				params.oStatus = Number(name)
			}
			onRefresh()
		}

		const show = ref(false)
		const podCode = ref(0)
		const poCode = ref(0)
		// const paychild = ref(null)
		// 支付
		const choosePayType = (item: IShowSelfOrderDetailItem) => {
			show.value = true
			podCode.value = item.podCode
			poCode.value = item.poCode
			// console.log($ref)
			// paychild.value.getPayType(item.prdCCode)
		}
		const close = (val: boolean) => {
			show.value = false
		}
		// 確認收貨
		const conReception = (podCode: number) => {
			confirmTakeDelivery({ podCode }).then(res => {
				if (res.resultCode === 1) {
					Dialog.alert({ message: '确认收货成功' }).then(() => {
						onRefresh()
					})
				}
			})
		}
		return {
			active,
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			// paychild,
			podCode,
			poCode,
			show,
			t,
			imgPath,
			skuName,
			handChange,
			choosePayType,
			close,
			conReception
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.my-order {
	.list {
		margin-top: 20 * @fontSize;
		padding: 0 30 * @fontSize;
		background: #fff;
		.title {
			display: flex;
			align-items: center;
			height: 88 * @fontSize;
			img {
				width: 32 * @fontSize;
			}
			span {
				flex: 1;
				margin-left: 20 * @fontSize;
				color: #333;
			}
			.state {
				color: #ed0c17;
			}
		}
		.cont {
			padding-top: 18 * @fontSize;
			img {
				width: 184 * @fontSize;
			}
			.info {
				display: inline-block;
				width: 450 * @fontSize;
				margin-left: 20 * @fontSize;
				.title {
					color: #333;
				}
				p {
					margin-top: 10 * @fontSize;
					color: #999;
					font-size: 24 * @fontSize;
				}

				.price {
					margin-top: 10 * @fontSize;
					font-size: 24 * @fontSize;
					span {
						color: #ed0c17;
					}
					.num {
						margin-left: 150 * @fontSize;
						color: #333;
					}
				}
			}
		}
		.wrapper {
			font-size: 24 * @fontSize;
			line-height: 87 * @fontSize;
			text-align: right;
			border-bottom: 1px solid #f2f2f2;
			span {
				font-size: 32 * @fontSize;
			}
			.dis-price {
				color: #ed0c17;
			}
		}
		.foot {
			line-height: 88 * @fontSize;
			text-align: right;
			.btn {
				display: inline-block;
				width: 130 * @fontSize;
				margin-left: 20 * @fontSize;
				color: #808080;
				font-size: 24 * @fontSize;
				line-height: 50 * @fontSize;
				text-align: center;
				border: 1px solid #808080;
				border-radius: 25 * @fontSize;
			}
			.active {
				color: #ed0c17;
				border: 1px solid #ed0c17;
			}
		}
	}
	.tip {
		color: #999;
		line-height: 88 * @fontSize;
		text-align: center;
	}
	.img-icon {
		margin-right: 20 * @fontSize;
	}
	.btn1 {
		display: inline-block;
		width: 600 * @fontSize;
		margin: 20 * @fontSize 0;
		color: #fff;
		font-size: 30 * @fontSize;
		line-height: 80 * @fontSize;
		background: #ed0c17;
		border-radius: 12 * @fontSize;
	}
}
</style>
