<template>
	<div class="jd-waterfall">
		<div class="wrap left">
			<div class="item" v-for="item in data" :key="item.goodsId">
				<div class="order">
					<div class="order-img">
						<img :src="item.goodsMainPicture" alt="" class="img" />
					</div>
					<div class="right">
						<div class="order-name">
							<p class="g-name">{{ item.goodsName }}</p>
						</div>
						<div style="color: red">预计返{{ calcSie(item.commission) }}TAA</div>
						<div class="order-content">
							<p class="money">&nbsp;{{ item.vipPrice }}</p>
							<!-- <p class="sale-count">{{item.sales_tip}}</p> -->
						</div>
						<div class="coupon-amount" v-if="item.couponInfo">
							<span>{{ item.couponInfo.fav }}元券</span>
						</div>
						<div class="shop-name">
							<p>
								<Icon name="weipinhui" class-prefix="icon" class="icon" color="#ef4842" />{{
									item.storeInfo.storeName
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
import { defineComponent, PropType, toRefs } from 'vue'
import { Toast, Icon } from 'vant'
import { useCalcPower } from '@/hooks/web/useCalcPower'
import { vopGetLink } from '@/apis/taoKe'
import { useGetTAAPrice } from '@/hooks/web/useGetTAAPrice'

export default defineComponent({
	name: 'pddListItem',
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
			// console.log(item)
			const params = {
				goodsId: item.goodsId
			}
			vopGetLink(params).then(res => {
				if (res.resultCode === 1) {
					const url = res.data[0].deeplinkUrl
					// if (this.$evnIsBrowser) {
					const loadDateTime: any = new Date()
					window.setTimeout(function () {
						const timeOutDateTime: any = new Date()
						if (timeOutDateTime - loadDateTime < 5000) {
							Toast('请先下载唯品会App')
							// console.log(1)
						} else {
							window.close()
						}
						// console.log(1)
					}, 3000)
					window.location.href = url
					// } else {
					//     const options = {
					//         title: `跳转到拼多多App`,
					//         url: url
					//     }
					//     sc.openApp(options, result=> {
					//         if (!(result && result.status ===  200)) {
					//             Toast('请先下载拼多多App', JSON.stringify(result))
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
	// display: flex;
	// align-items:flex-start;
	// justify-content: space-around;
	.wrap {
		.item {
			margin-top: 20 * @fontSize;
			padding: 20 * @fontSize 20 * @fontSize;
			background-color: #fff;
			// .shop-name{
			//     height: 74*@fontSize;
			//     display: flex;
			//     justify-content: space-between;
			//     align-items: center;
			//     img{
			//         height: 34*@fontSize;
			//         flex-shrink: 0;
			//         margin-right: 5px;
			//     }
			// }
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
