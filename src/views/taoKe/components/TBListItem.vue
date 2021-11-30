<template>
	<div class="jd-waterfall">
		<div class="wrap left">
			<div class="item" v-for="item in data" :key="item.item_id">
				<div class="order">
					<div class="order-img">
						<img :src="item.pict_url" alt="" class="img" />
					</div>
					<div class="right">
						<div class="order-name">
							<p class="gname">{{ item.title }}</p>
						</div>
						<div style="color: red">预计返{{ calcSie(item) }}TAA</div>
						<div class="order-content">
							<p class="money">&nbsp;{{ item.zk_final_price }}</p>
							<p class="sale-count">{{ item.volume }}</p>
						</div>
						<div class="coupon-amount" v-if="item.coupon_amount">
							<span>{{ item.coupon_amount }}元券</span>
						</div>
						<div class="shop-name">
							<p>
								<img src="../../../assets/img/icon_pic_tiaomao.png" alt="" v-if="item.gPlatformType === '天猫'" />
								<img src="../../../assets/img/icon_pic_tao.png" alt="" v-if="item.gPlatformType === '淘宝'" />
								{{ item.shop_title }}
							</p>
							<div>
								<p class="button" @click="goShopping(item)">购买</p>
								<!-- <van-icon name="arrow-right" /> -->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Toast } from 'vant'
import { defineComponent, PropType, toRefs } from 'vue'

import { useCalcPower } from '../../../hooks/web/useCalcPower'
import { useGetTAAPrice } from '../../../hooks/web/useGetTAAPrice'
// import {} from 'vant'

export default defineComponent({
	name: 'tbListItem',
	props: {
		data: Array as PropType<any[]>,
		isMaterial: {
			type: Boolean,
			default: false
		}
	},
	setup(props) {
		// const {} = useCalcPower()
		const { data, isMaterial } = toRefs(props)
		const { taaPrice } = useGetTAAPrice()
		const calcSie = (item: any) => {
			const { commission_rate, zk_final_price } = item
			const gCommission = (zk_final_price * commission_rate) / (isMaterial ? 100 : 10000)
			const calcPower = useCalcPower(gCommission)
			return calcPower / taaPrice.value
		}
		const goShopping = (item: any) => {
			const url = 'taobao:' + (item.coupon_share_url || item.click_url || item.url)
			// console.log(item)
			// if (this.$evnIsBrowser) {
			var loadDateTime: any = new Date()
			let timer = window.setTimeout(function () {
				var timeOutDateTime: any = new Date()
				if (timeOutDateTime - loadDateTime < 5000) {
					Toast('请先下载淘宝App')
					// console.log(1)
					window.clearTimeout(timer)
				} else {
					window.close()
				}
				// console.log(1)
			}, 3000)
			window.location.href = url
			// }
		}
		return {
			data,
			calcSie,
			goShopping
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.jd-waterfall {
	overflow: hidden;

	.wrap {
		.item {
			margin-top: 20 * @fontSize;
			padding: 20 * @fontSize 20 * @fontSize;
			background-color: #fff;
			.order {
				display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
				display: -webkit-flex; /* NEW - Chrome */
				align-items: flex-start;
				-webkit-align-items: flex-start;
				justify-content: flex-start;
				-webkit-justify-content: flex-start;
				// flex: 1;
				.order-img {
					width: 34%;
					// flex-shrink: 0%;
					.img {
						width: 100%;
						// height: 340*@fontSize;
						border-radius: 5px;
					}
				}

				.right {
					padding: 0 20 * @fontSize;
					width: 66%;
					// position: relative;
				}
				.order-name {
					font-size: 26 * @fontSize;
					.gname {
						height: 78 * @fontSize;
						overflow: hidden;
					}
				}
				.order-content {
					// text-align: right;
					display: flex;
					justify-content: space-between;
					font-size: 24 * @fontSize;
					padding-top: 5px;
					.money {
						color: #ff5000;
						&::before {
							content: '\00A5';

							font-size: 18 * @fontSize;
						}
					}
					.sale-count {
						color: #909090;
						&::before {
							content: '销量：';
						}
					}
				}
				.coupon-amount {
					display: flex;
					align-content: center;
					font-size: 24 * @fontSize;
					span {
						border-radius: 0;
						background-color: #ff0036;
						color: #fff;
						line-height: 1.5;
						&::after {
							content: '';
							display: inline-block;
							height: 20 * @fontSize;
							width: 20 * @fontSize;
							background: #fff;
							border-top-left-radius: 50%;
							border-bottom-left-radius: 50%;
							position: relative;
							right: -10 * @fontSize;
							// top: -10*@fontSize;
							top: calc(50% - 16 * @fontSize);
						}
						&::before {
							content: '';
							display: inline-block;
							height: 20 * @fontSize;
							width: 20 * @fontSize;
							background: #fff;
							border-top-right-radius: 50%;
							border-bottom-right-radius: 50%;
							position: relative;
							left: -10 * @fontSize;
							top: calc(50% - 16 * @fontSize);
							// top: -50%;
						}
					}
				}
				.shop-name {
					color: #909090;
					padding-top: 5px;
					font-size: 24 * @fontSize;
					display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
					display: -webkit-flex; /* NEW - Chrome */
					align-items: center;
					-webkit-align-items: center;
					justify-content: space-between;
					-webkit-justify-content: space-between;
				}
				.button {
					color: #07c160;
					&::after {
						content: '›';
						display: inline-block;
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
</style>
