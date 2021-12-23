<template>
	<div class="order">
		<div class="step">
			<div class="item">
				<img src="../../assets/img/mixuan/product.png" alt="" />
				<p>1.选择商品开团/参团</p>
			</div>
			<div class="right"><Icon name="arrow" /></div>
			<div class="item">
				<img src="../../assets/img/mixuan/joke.png" alt="" />
				<p>2.邀请好友参团</p>
			</div>
			<div class="right"><Icon name="arrow" /></div>
			<div class="item">
				<img src="../../assets/img/mixuan/gou.png" alt="" />
				<p>3.人满成团</p>
			</div>
		</div>
		<div class="contact" v-if="addrInfo.daMobile">
			<img src="../../assets/img/mixuan/address.png" alt="" />
			<div class="info">
				<div class="phone">{{ addrInfo.daMobile }}</div>
				<div class="name">收货人：{{ addrInfo.daName }}</div>
				<p>收货地址：{{ addrInfo.aName + addrInfo.daDetailAddress }}</p>
			</div>
			<div class="right" @click="chooseAddr"><Icon name="arrow" /></div>
		</div>
		<div class="add-address" @click="chooseAddr" v-if="!addrInfo.daMobile">
			<Icon name="add-o" size="0.5rem" />
			<span>增加收货地址</span>
		</div>
		<div class="line"><img src="../../assets/img/line.png" alt="" /></div>
		<div class="title">
			<Icon name="shop-o" />
			<span>{{ orderInfo.mName }}</span>
		</div>
		<div class="cont">
			<img :src="orderInfo.cPicName" alt="" />
			<div class="info">
				<div class="name">【超级拼团】{{ orderInfo.name }}</div>
				<p>规格：{{ orderInfo.className }}</p>
				<div class="price">
					￥{{ proInfo.prdPrice }}&nbsp;&nbsp;
					<!-- <span v-if="merCode > 0">(店主：￥{{ proInfo.prdFactSum }})</span> -->
				</div>
			</div>
			<div class="num">X{{ proInfo.prdCount }}</div>
		</div>
		<!-- <div class="type">
            <div class="item">
                <div class="name">优惠券</div>
                <div class="value">使用优惠</div>
                <div class="right">></div>
            </div>
        </div> -->
		<div class="type">
			<div class="item">
				<div class="name">配送方式</div>
				<div class="value">快递 免运费</div>
			</div>
			<div class="item">
				<div class="name">买家留言</div>
				<input type="text" placeholder="建议留言前先与商家沟通确认" v-model="podRemark" />
			</div>
		</div>

		<div class="sum">
			<div class="item">
				<div class="name">商品金额</div>
				<div class="value">￥{{ proInfo.prdFactSum }}</div>
			</div>
			<!-- <div class="item" v-if="orderInfo.poGroupType == 1">
                <div class="name">折扣</div>
                <div class="value">{{orderInfo.dis}} 折</div>
            </div> -->
			<div class="item">
				<div class="name">运费</div>
				<div class="value">￥0.00</div>
			</div>
			<div class="item">
				<div class="name"></div>
				<div class="value">
					合计：<span>￥{{ orderInfo.poPayFactSum }}</span>
				</div>
			</div>
		</div>
		<SubmitBar :price="orderInfo.poPayFactSum * 100" button-text="提交订单" @submit="onSubmit" />

		<!-- 支付 -->
		<PayType v-model:show="showPayType" :payType="payType" @pay="pay" />
		<!-- 支付二维码 -->
		<PayQr v-model:show="showQr" :imageUrl="imageUrl" :qrText="qrText" :payTypeName="payTypeName" />
	</div>
</template>

<script lang="ts">
import { Icon, SubmitBar, Toast } from 'vant'
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { showAcquiesceDeliveryAddress } from '@/apis/mem'
import { mallPayOnline, selectPayOrderByBizOrderCode, submitEcBill } from '@/apis/mx'
import { useStore } from '@/store'

import PayType from '../../components/PayType'
import PayQr from '../../components/PayQr'

export default defineComponent({
	name: 'GoodsSubmit',
	components: {
		Icon,
		SubmitBar,
		PayType,
		PayQr
	},
	setup() {
		const { push, replace } = useRouter()
		const store = useStore()
		// 订单信息
		const orderInfo = computed(() => store.state.user.buyOrderDetail)

		const data = reactive({
			podRemark: '', // 卖家留言
			// merCode: localStorage.merCode,
			proInfo: {
				prdPrice: 0,
				prdFactSum: 0,
				prdCount: 0
			},
			show: false,
			poCode: 0,
			routeFrom: '',
			// podCode: 0,

			// 支付
			showPayType: false,
			submitParams: {},
			fromName: '',
			// 支付二维码
			imageUrl: '',
			qrText: '',
			payTypeName: '',
			showQr: false
		})
		data.proInfo = orderInfo.value.orderList[0].podList[0]
		// 支付方式
		const payType = reactive({ alipayShow: false, bankShow: false })
		// 地址信息
		const addrInfo = reactive({
			aCode: 0,
			daCode: 0,
			daName: '',
			daMobile: '',
			aName: '',
			daDetailAddress: '',
			daAcquiesceType: 0
		})
		// 查询默认地址
		const getDefault = () => {
			showAcquiesceDeliveryAddress().then(res => {
				if (res.resultCode === 1 && res.data) {
					Object.assign(addrInfo, res.data)
					// addrInfo = res.data
				}
			})
		}
		// 提交订单
		const onSubmit = () => {
			if (!addrInfo.daMobile) {
				Toast('请增加收货地址！')
				return
			}
			// console.log(data.orderInfo)orderList
			orderInfo.value.daCode = addrInfo.daCode
			orderInfo.value.poACode = addrInfo.aCode
			orderInfo.value.poAName = addrInfo.aName + addrInfo.daDetailAddress
			if (!data.poCode) {
				submitEcBill(orderInfo.value).then(res => {
					if (res.resultCode === 1) {
						// console.log(res)
						data.poCode = res.data.poCode
						data.showPayType = true
						// window.location.href = res.data
					}
				})
			} else {
				data.showPayType = true
			}
		}
		// 支付
		const pay = (options: any) => {
			data.payTypeName = options.payTypeName
			// data.qrText = options.payTypeName
			data.imageUrl = options.imageUrl
			// const params = {}
			const params1 = {
				payPlat: options.payPlat, // 支付平台
				poCode: data.poCode // 订单编号, 第一次生成订单
				// podCode: orderInfo.value.value // 订单编号，订单列表和订单详情中
			}
			let flag = false
			mallPayOnline(params1).then(res => {
				// console.log(res)
				if (res.resultCode === 1) {
					if (options.payPlat === 'wx') {
						data.qrText = res.msg
						flag = true
					}
					if (flag) {
						setTimeout(() => {
							data.showQr = true
						}, 500)

						const newParams = {
							orderBizCode: data.poCode,
							orderBizType: 1
						}
						let count = 0
						const timer = window.setInterval(() => {
							if (count < 4) {
								selectPayOrderByBizOrderCode(newParams).then(res => {
									if (res.resultCode === 1 && res.data.orderPayStatus) {
										window.clearInterval(timer)
										replace({ path: '/mxMall/payResult', query: { id: data.poCode } })
									}
								})
								count++
							} else {
								window.clearInterval(timer)
							}
						}, 4000)
					}
				}
			})
		}
		const chooseAddr = () => {
			push('/mine/address/list')
		}

		onMounted(() => {
			data.routeFrom === 'AddressList' && Object.assign(addrInfo, store.state.user.deliveryAddress)
			// addrInfo = store.state.product.deliveryAddress
			// console.log(addrInfo)
		})
		return {
			...toRefs(data),
			orderInfo,
			addrInfo,
			payType,
			onSubmit,
			chooseAddr,
			getDefault,
			pay
		}
	},
	beforeRouteEnter(to, from, next) {
		// console.log(from.name)
		next((vm: any) => {
			if (from.name === 'GoodsDetail' || from.name === 'groupDetail') {
				vm.poCode = null
			}
			if (from.name !== 'AddressList') {
				// let orderInfo = to.query.parms
				// vm.orderInfo = orderInfo
				// vm.proInfo = orderInfo.orderList[0].podList[0]
				// 获取默认收货地址
				vm.getDefault()
			}
			// console.log(to)
			vm.routeFrom = from.name
		})
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.order {
	padding-bottom: 100 * @fontSize;
	.step {
		display: flex;
		align-items: flex-start;
		padding-top: 25 * @fontSize;
		color: #333;
		.item {
			flex: 1;
			font-size: 20 * @fontSize;
			text-align: center;
			img {
				width: 50 * @fontSize;
			}
			p {
				margin-top: 20 * @fontSize;
			}
		}
		.right {
			margin-top: 0.1rem;
		}
	}
	.contact {
		display: flex;
		align-items: flex-start;
		margin-top: 50 * @fontSize;
		padding: 0 36 * @fontSize 0 30 * @fontSize;
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
	.add-address {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 30 * @fontSize;
		span {
			margin-left: 20 * @fontSize;
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
		i {
			width: 32 * @fontSize;
			margin: 30 * @fontSize 10 * @fontSize 0 30 * @fontSize;
			font-size: 32 * @fontSize;
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
		}
	}
	.type,
	.sum {
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
}
</style>
