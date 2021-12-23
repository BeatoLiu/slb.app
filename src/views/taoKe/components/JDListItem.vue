<template>
	<div class="jd-waterfall">
		<div class="wrap left">
			<div class="item" v-for="item in data" :key="item.skuId">
				<div class="order">
					<div class="order-img">
						<img :src="item.imageInfo.imageList[0].url" alt="" class="img" />
					</div>
					<div class="right">
						<div class="order-name">
							<p class="gname">{{ item.skuName }}</p>
						</div>
						<div style="color: red">预计返{{ calcSie(item.commissionInfo.commission) }}TAA</div>
						<div class="order-content">
							<p class="money">&nbsp;{{ item.priceInfo.lowestPrice }}</p>
							<p class="sale-count">{{ item.inOrderCount30Days }}</p>
						</div>
						<div
							class="coupon-amount"
							v-if="item.couponInfo.couponList.length && item.couponInfo.couponList[0].discount"
						>
							<span>{{ item.couponInfo.couponList[0].discount }}元券</span>
						</div>
						<div class="shop-name">
							<p>
								<Icon name="jingdong" class-prefix="icon" class="icon" color="#ef4842" />{{
									item.shopInfo.shopName
								}}
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
import { Toast, Icon } from 'vant'
import { defineComponent, PropType, toRefs } from 'vue'
import { getJdLink } from '@/apis/taoKe'
import { useCalcPower } from '@/hooks/web/useCalcPower'
import { useGetTAAPrice } from '@/hooks/web/useGetTAAPrice'

interface jdLinkMode {
	url: string
	couponUrl?: string
}
export default defineComponent({
	name: 'jdListItem',
	components: {
		Icon
	},
	props: {
		data: Array as PropType<any[]>
	},
	setup(props) {
		const { data } = toRefs(props)
		const { taaPrice } = useGetTAAPrice()
		const calcSie = (gCommission: number) => {
			const calcPower = useCalcPower(gCommission)
			return calcPower / taaPrice.value
		}
		const goShopping = (item: any) => {
			const params: jdLinkMode = {
				url: item.materialUrl
			}
			if (item.couponInfo.couponList.length) {
				params.couponUrl = item.couponInfo.couponList[0].link
			}
			getJdLink(params).then(res => {
				//  console.log(res.data)
				if (res.resultCode === 1) {
					// const uri = encodeURI(res.data)
					// console.log(uri)
					const url = `openapp.jdmobile://virtual?params={"category":"jump","des":"m","url":"${res.data}",
                                "keplerID":"0","keplerFrom":"1","kepler_param":{"source":"kepler-open","otherData":{"mopenbp7":"0"}},"union_open":"union_cps"}`
					// if (this.$evnIsBrowser) {
					const loadDateTime: any = new Date()
					const timer = window.setTimeout(function () {
						const timeOutDateTime: any = new Date()
						if (timeOutDateTime - loadDateTime < 5000) {
							Toast('请先下载京东App')
							window.clearTimeout(timer)
						} else {
							window.close()
						}
					}, 3000)
					window.location.href = url
					// } else {
					//     const options = {
					//         title: `跳转到京东App`,
					//         url: url
					//     }
					//     sc.openApp(options, result=> {
					//         if (!(result && result.status ===  200)) {
					//             Toast('请先下载京东App', JSON.stringify(result))
					//         }
					//     })
					// }
				}
			})
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
	// padding: 0 20*@fontSize;
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
					.gname {
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
							content: '近30天销量：';
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
						// display: inline;
						// padding: 5*@fontSize 10*@fontSize;
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
					// height: 60*@fontSize;
					// border: none;
					// outline-style: none;
					// background-color: #07c160;
					color: #07c160;
					// border-radius: 5px;
					// float: right;
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
