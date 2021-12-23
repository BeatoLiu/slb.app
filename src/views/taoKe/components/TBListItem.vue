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
							<p class="g-name">{{ item.title }}</p>
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
								<img
									src="../../../assets/img/icon_pic_tiaomao.png"
									alt=""
									v-if="item.gPlatformType === '天猫'"
								/>
								<img
									src="../../../assets/img/icon_pic_tao.png"
									alt=""
									v-if="item.gPlatformType === '淘宝'"
								/>
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

import { useCalcPower } from '@/hooks/web/useCalcPower'
import { useGetTAAPrice } from '@/hooks/web/useGetTAAPrice'
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
			// eslint-disable-next-line camelcase
			const { commission_rate, zk_final_price } = item
			// eslint-disable-next-line camelcase
			const gCommission = (zk_final_price * commission_rate) / (isMaterial ? 100 : 10000)
			const calcPower = useCalcPower(gCommission)
			return calcPower / taaPrice.value
		}
		const goShopping = (item: any) => {
			const url = 'taobao:' + (item.coupon_share_url || item.click_url || item.url)
			// console.log(item)
			// if (this.$evnIsBrowser) {
			const loadDateTime: any = new Date()
			const timer = window.setTimeout(function () {
				const timeOutDateTime: any = new Date()
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
				//-webkit-align-items: flex-start;
				justify-content: flex-start;
				//-webkit-justify-content: flex-start;
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
					width: 66%;
					padding: 0 20 * @fontSize;
					// position: relative;
				}
				.order-name {
					font-size: 26 * @fontSize;
					.g-name {
						height: 78 * @fontSize;
						overflow: hidden;
					}
				}
				.order-content {
					// text-align: right;
					display: flex;
					justify-content: space-between;
					padding-top: 5px;
					font-size: 24 * @fontSize;
					.money {
						color: #ff5000;
						&::before {
							font-size: 18 * @fontSize;
							content: '\00A5';
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
						color: #fff;
						line-height: 1.5;
						background-color: #ff0036;
						border-radius: 0;
						&::after {
							position: relative;
							top: calc(50% - 16 * @fontSize);
							right: -10 * @fontSize;
							display: inline-block;
							width: 20 * @fontSize;
							height: 20 * @fontSize;
							background: #fff;
							border-top-left-radius: 50%;
							border-bottom-left-radius: 50%;
							// top: -10*@fontSize;
							content: '';
						}
						&::before {
							position: relative;
							top: calc(50% - 16 * @fontSize);
							left: -10 * @fontSize;
							display: inline-block;
							width: 20 * @fontSize;
							height: 20 * @fontSize;
							background: #fff;
							border-top-right-radius: 50%;
							border-bottom-right-radius: 50%;
							content: '';
							// top: -50%;
						}
					}
				}
				.shop-name {
					display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
					align-items: center;
					justify-content: space-between;
					padding-top: 5px;
					color: #909090;
					font-size: 24 * @fontSize;
					//display: -webkit-flex; /* NEW - Chrome */
					//-webkit-align-items: center;
					//-webkit-justify-content: space-between;
				}
				.button {
					color: #07c160;
					&::after {
						display: inline-block;
						content: '›';
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
</style>
