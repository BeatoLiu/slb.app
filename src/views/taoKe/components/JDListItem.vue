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
								<Icon name="jingdong" class-prefix="icon" class="icon" color="#ef4842" />{{ item.shopInfo.shopName }}
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
import { getJdLink } from '../../../apis/taoKe'
import { useCalcPower } from '../../../hooks/web/useCalcPower'
import { useGetTAAPrice } from '../../../hooks/web/useGetTAAPrice'

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
					var loadDateTime: any = new Date()
					let timer = window.setTimeout(function () {
						var timeOutDateTime: any = new Date()
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
							content: '近30天销量：';
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
						// display: inline;
						// padding: 5*@fontSize 10*@fontSize;
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
					// height: 60*@fontSize;
					// border: none;
					// outline-style: none;
					// background-color: #07c160;
					color: #07c160;
					// border-radius: 5px;
					// float: right;
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
