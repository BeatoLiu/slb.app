<template>
	<div class="order-detail">
		<div class="step flex-center">
			<div><Icon name="shopping-cart-o" /></div>
			<p>{{ msg.podStatusName }}</p>
		</div>

		<div class="contact" v-if="msg.prdType !== 1">
			<!-- <img src="../../assets/img/mixuan/address.png" alt="" /> -->
			<Icon name="location-o" />
			<div class="info">
				<div class="phone">{{ msg.poMobile }}</div>
				<div class="name">收货人：{{ msg.poLinkName }}</div>
				<p>收货地址：{{ msg.poAddr }}</p>
			</div>
			<div class="right">></div>
		</div>
		<div class="line"><img src="../../assets/img/line.png" alt="" /></div>
		<div class="title">
			<!-- <img src="../../assets/img/mixuan/home.png" alt="" /> -->
			<Icon name="shop-o" />
			<span>{{ msg.mName }}</span>
		</div>
		<div class="cont">
			<!-- <img :src="imgPath(msg.prdCsPicName)" alt="" /> -->
			<img :src="msg.prdCsPicName" alt="" />
			<div class="info">
				<div class="name">{{ msg.prdCName }}</div>
				<!-- <p>{{ skuName(msg.prdCsSkuCollection) }}</p> -->
				<p>{{ msg.className }}</p>
				<!-- {{msg.prdSum/msg.prdCount}} -->
				<div class="price">
					{{ msg.pointMCode ? 'VBM' + msg.pointNumber : '￥' + msg.prdSum / msg.prdCount }}
				</div>
			</div>
			<div class="num">
				X{{ msg.prdCount }}
				<div class="btn" @click="toRefund(msg.podCode)" v-if="canRefund && msg.prdType === 0">申请退款</div>
				<div class="btn" @click="choosePayType" v-if="msg.podStatus === 0">付款</div>
			</div>
		</div>
		<div class="type">
			<div class="item">
				<div class="name">配送方式</div>
				<div class="value">快递 免运费</div>
			</div>
			<div class="item">
				<div class="name">买家留言</div>
				<input type="text" placeholder="建议留言前先与商家沟通确认" v-model="podRemark" v-if="podRemark" />
				<div class="value" v-else>无</div>
			</div>
		</div>

		<div class="sum">
			<div class="item">
				<div class="name">商品金额</div>
				<div>{{ msg.pointMCode ? (msg.pointNumber * msg.prdCount).toFixed(2) : '￥' + msg.prdSum }}</div>
			</div>
			<div class="item">
				<div class="name">实付金额</div>
				<div>{{ msg.pointMCode ? (msg.pointNumber * msg.prdCount).toFixed(2) : '￥' + msg.prdFactSum }}</div>
			</div>

			<div class="item">
				<div class="name">付款方式</div>
				<div class="value">{{ msg.pointMCode ? 'VBM' : msg.orderPayTypeName }}</div>
			</div>
			<div class="item">
				<div class="name">运费</div>
				<div>￥0.00</div>
			</div>
			<div class="item">
				<div class="name"></div>
				<div class="value">
					合计：<span>{{
						msg.pointMCode ? (msg.pointNumber * msg.prdCount).toFixed(2) : '￥' + msg.prdFactSum
					}}</span>
				</div>
			</div>
		</div>
		<div class="online">
			<!-- <img src="../../assets/img/mixuan/service_dark.png" alt="">
            <span>在线客服</span> -->
		</div>
		<div class="order">
			<p>订单编号：{{ msg.podCode }}</p>
			<p>订单时间：{{ msg.createTime }}</p>
			<p>订单状态：{{ msg.podStatusName }}</p>
			<p v-if="msg.podStatus === 5 && msg.orderPayType === 1" class="color-red">
				提示：若未完善支付宝账号，为方便退款，请到“我的-提现账号”中完善支付宝账号
			</p>
			<p v-if="msg.podRemark" class="color-red">备注：{{ msg.podRemark }}</p>
			<!-- <p>付款时间：2019-8-11 13:04:54</p> -->
		</div>
		<div class="order" v-if="number">
			<div class="delivery">
				<div class="name">运单号：</div>
				<div>{{ number }}</div>
				<div class="remark">({{ lgType }})</div>
				<div
					class="copy"
					id="logNumber"
					:data-clipboard-text="number"
					@click="clipboard('#logNumber', { des: '运单号' })"
				>
					复制
				</div>
				<!-- <input type="number" pattern="[0-9]*" v-model="number" placeholder="请输入快递运单号"> -->
			</div>
			<p>{{ msg.podStatus === 3 ? msg.prdSentTime : msg.prdReceivedTime }}</p>
		</div>
		<PayComponent :poCode="msg.poCode" :podCode="msg.podCode" :show="show" @close="close" />
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { Icon } from 'vant'
import PayComponent from './components/PayComponent.vue'
import { getMallPrdOrderDetail } from '@/apis/mx'
import { useRouter } from 'vue-router'
import { useImgPath } from '@/hooks/mx/useImgPath'
import { useSkuName } from '@/hooks/mx/useSkuName'
import useClipboard from '../../hooks/web/useClipboard'
export default defineComponent({
	name: 'MyOrderDetail',
	components: {
		Icon,
		PayComponent
	},
	setup() {
		const { currentRoute, push } = useRouter()
		const { imgPath } = useImgPath()
		const { skuName } = useSkuName()
		const clipboard = useClipboard()
		const data = reactive({
			podRemark: '', // 卖家留言
			// active: 0,              //oStatus: 0待发货 1 待收货 2 待评价  3退款和售后
			canRefund: true,
			// poAttach: {},          //地址信息
			// msg: {}, //
			show: false,
			number: null,
			lgType: ''
		})
		/* eslint-disable-next-line */
		const msg = reactive<any>({})

		const toRefund = (podCode: number) => {
			push({ name: 'Refund', query: { podCode } })
		}
		const choosePayType = () => {
			data.show = true
		}
		const close = () => {
			data.show = false
		}
		onMounted(() => {
			// console.log(currentRoute.value.query.podCode)
			const podCode = currentRoute.value.query.podCode || 0
			getMallPrdOrderDetail({ podCode: +podCode }).then(res => {
				console.log(res)
				if (res.resultCode === 1) {
					const podStatus = res.data.podStatus
					// this.getOrderStatus(podStatus)
					if (podStatus === 0 || podStatus === 5 || podStatus === 6 || podStatus === 7) {
						data.canRefund = false // 不能退款
					}
					Object.assign(msg, res.data)
					// msg = res.data
					msg.prdFactSum = +Number(msg.prdFactSum).toFixed(6)
					msg.className = skuName(msg.prdCsSkuCollection)
					data.podRemark = msg.podRemark
					msg.prdCsPicName = imgPath(msg.prdCsPicName)
					msg.prdSum = Number(msg.prdSum)
					msg.prdPrice = +Number((msg.prdPrice * msg.prdFactSum) / msg.prdSum).toFixed(6)
					// msg.prdCsSkuCollection.forEach(i => {
					//     msg.className = msg.className + i.params[0].pcdSubName + ' '
					// })
					// })
				}
			})
		})
		return {
			...toRefs(data),
			msg, // : { ...toRefs(msg) },
			// imgPath,
			// skuName,
			toRefund,
			choosePayType,
			clipboard,
			close
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.order-detail {
	.step {
		height: 60px;
		padding: 0 60 * @fontSize;
		color: #fff;
		// line-height: 60px;
		font-size: 36 * @fontSize;
		// font-weight: 600;
		background: linear-gradient(90deg, #ff7962 0%, #f9023e 100%);
		i {
			margin-right: 30 * @fontSize;
			font-size: 60 * @fontSize;
		}
	}
	.contact {
		display: flex;
		align-items: flex-start;
		padding: 30 * @fontSize 36 * @fontSize 0 30 * @fontSize;
		img {
			width: 20 * @fontSize;
			margin-top: 8 * @fontSize;
		}
		.info {
			width: 610 * @fontSize;
			margin-left: 16 * @fontSize;
			overflow: hidden;
			color: #333;

			.name,
			.phone {
				font-weight: bold;
				font-size: 30 * @fontSize;
			}
			.phone {
				float: right;
			}
			p {
				color: #808080;
				font-size: 24 * @fontSize;
			}
		}
		.right {
			margin-top: 30 * @fontSize;
			margin-left: 20 * @fontSize;
			color: #808080;
		}
	}
	.line {
		height: 2px;
		margin-top: 33 * @fontSize;
		padding: 0 9 * @fontSize;
	}
	.title {
		margin-top: 15 * @fontSize;
		color: #333;
		line-height: 90 * @fontSize;
		background: #fff;
		img {
			width: 32 * @fontSize;
			margin: 30 * @fontSize 10 * @fontSize 0 30 * @fontSize;
		}
	}
	.cont {
		display: flex;
		align-items: center;
		padding: 15 * @fontSize 30 * @fontSize 0;
		font-size: 24 * @fontSize;
		img {
			width: 160 * @fontSize;
			height: 160 * @fontSize;
		}
		.info {
			flex: 1;
			margin-left: 20 * @fontSize;
			.price {
				margin-top: 20 * @fontSize;
				color: #ff0101;
			}
			p {
				margin-top: 20 * @fontSize;
				color: #999;
			}
		}
		.num {
			color: #808080;
			text-align: right;
			.btn {
				width: 120 * @fontSize;
				margin-top: 30 * @fontSize;
				color: #ff0101;
				font-size: 24 * @fontSize;
				line-height: 40 * @fontSize;
				text-align: center;
				border: 1px solid #ff0101;
				border-radius: 20 * @fontSize;
			}
		}
	}
	.sum,
	.type {
		margin-top: 15 * @fontSize;
		padding: 0 30 * @fontSize;
		font-size: 24 * @fontSize;
		background: #fff;
		.item {
			display: flex;
			align-items: center;
			height: 80 * @fontSize;
			border-bottom: 1px solid #f7f7f7;
			.name {
				flex: 1;
			}
			.value {
				color: #808080;
			}
			input {
				flex-shrink: 0;
				width: 490 * @fontSize;
			}
			span {
				color: #ff0101;
				font-weight: bold;
			}
			.right {
				margin-left: 15 * @fontSize;
				color: #333;
			}
		}
	}
	.online {
		line-height: 95 * @fontSize;
		text-align: center;
		background: #fff;
		img {
			width: 35 * @fontSize;
			margin-top: 30 * @fontSize;
			margin-right: 10 * @fontSize;
		}
	}
	.order {
		margin-top: 20 * @fontSize;
		padding: 10 * @fontSize 30 * @fontSize 30 * @fontSize;
		color: #808080;
		font-size: 24 * @fontSize;
		background: #fff;
		p {
			margin-top: 20 * @fontSize;
			line-height: 1;
		}
		.color-red {
			color: red;
		}
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
	.delivery {
		// padding: 10*@fontSize 0 0 30*@fontSize;
		// height: 88*@fontSize;
		display: flex;
		align-items: center;
		// margin-top: 20*@fontSize;
		// background: #fff;
		// .name{
		// padding-left: 30*@fontSize;
		// width: 180*@fontSize;
		// flex-shrink: 0
		// }
		// input{
		//     flex: 1
		// }
		.remark {
			margin: 0 10 * @fontSize;
		}
		.copy {
			margin-left: 20 * @fontSize;
			color: #07c160;
			// text-decoration: 1px solid green;
		}
	}
}
</style>
