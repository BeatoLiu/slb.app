<template>
	<div class="slb">
		<!-- 轮播 -->
		<!-- <div class="my-swipe">
			<Swipe :autoplay="3000" indicator-color="white">
				<SwipeItem v-for="(image, index) in images" :key="index">
					<img :src="image" />
				</SwipeItem>
			</Swipe>
		</div> -->
		<section>
			<div class="top">
				<div class="top-top">
					<p>TAA总数</p>
					<p>{{ gold(balanceObj.historyTotal) }}</p>
				</div>
				<div class="flex-center top-bottom">
					<div>
						<p>已释放</p>
						<p>{{ gold(balanceObj.releaseTaa) }}</p>
					</div>
					<div>
						<p>余额</p>
						<p>{{ gold(balanceObj.alreadyWithdraw) }}</p>
					</div>
				</div>
			</div>
		</section>
		<section class="padding-section">
			<div class="menu-container">
				<div class="first-child flex-start">
					<div
						class="item"
						v-for="item in firstListNav"
						:key="item.id"
						@click="goRouter(item.to, item.title)"
					>
						<p><img :src="item.icon" alt="" /></p>
						<div class="name">{{ t(item.title) }}</div>
					</div>
				</div>
				<div class="second-child flex-start">
					<div
						class="item"
						v-for="item in secondListNav"
						:key="item.title"
						@click="goRouter(item.to, item.title)"
					>
						<p><img :src="item.icon" alt="" /></p>
						<div class="name">{{ t(item.title) }}</div>
					</div>
				</div>
			</div>
		</section>
		<!-- @click="$router.push({ name: 'YiDuoBao' })" -->
		<section class="cat-list">
			<p class="cat-title flex-start main-title"><img src="../../assets/img/title-left.png" alt="" />投资</p>
			<div style="margin-top: 5px">
				<img :src="assetsOrigin + '/img/secret/banners/movie_banner.png'" alt="" />
			</div>
		</section>
		<!-- k线图 -->
		<section>
			<div class="chart-container">
				<p class="cat-title flex-start main-title">
					<img src="../../assets/img/title-left.png" alt="" />TAA/ZSDT走势
				</p>
				<div class="chart-top flex-space">
					<div class="left">
						<p>{{ gold(tAACurrentInfo.nowPrice) }}</p>
						<p :class="tAACurrentInfo.key === '-' ? 'chg fall' : 'chg rise'">
							{{ tAACurrentInfo.key + tAACurrentInfo.value }}
						</p>
					</div>
					<div class="right">
						<p class="flex-space">
							<span>高</span><span>{{ gold(tAACurrentInfo.todayMaxPrice) }}</span>
						</p>
						<p class="flex-space">
							<span>低</span><span>{{ gold(tAACurrentInfo.todayMinPrice) }}</span>
						</p>
						<p class="flex-space">
							<span>24H</span><span>{{ gold(tAACurrentInfo.tokenCount) }}</span>
						</p>
					</div>
				</div>
				<div id="chart" ref="chartDom"></div>
			</div>
		</section>
		<!-- 币种汇率 -->
		<div class="cat-list">
			<p class="cat-title flex-start main-title"><img src="../../assets/img/title-left.png" alt="" />资讯</p>
			<div class="cat-container">
				<div class="flex-space th">
					<p>名称</p>
					<p>SUSD</p>
					<p>人民币</p>
				</div>
				<div class="cat-top flex-space" v-for="item in digitalTokeList" :key="item.market">
					<p>{{ item.market.toUpperCase() }}</p>
					<p>{{ item.price }}</p>
					<p>{{ item.cnyPrice }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Toast, Dialog } from 'vant'
import { computed, defineComponent, onActivated, reactive, toRefs } from 'vue-demi'
import { useRouter } from 'vue-router'
import { assetsOrigin, locationOrigin } from '@/utils/config'
import { gold } from '@/utils'
import { useI18n } from '@/hooks/setting/useI18n'
import { getDigitalTokeExchangeFromSc } from '@/apis/slb'
import {
	appSign,
	getCurrentTaaData,
	getStockTaaData,
	getStockTaaKLineData,
	getTaaRiseAndFall,
	getTaaRiseAndFall1,
	getTransferInfoKLineGraph,
	unRelaxSum
} from '@/apis/tAA'

import * as echarts from 'echarts/core'
import {
	TitleComponent,
	TitleComponentOption,
	TooltipComponent,
	TooltipComponentOption,
	GridComponent,
	GridComponentOption,
	LegendComponent,
	LegendComponentOption,
	DataZoomComponent,
	DataZoomComponentOption,
	MarkLineComponent,
	MarkLineComponentOption,
	MarkPointComponent,
	MarkPointComponentOption
} from 'echarts/components'
import { CandlestickChart, CandlestickSeriesOption, LineChart, LineSeriesOption } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { ref } from 'vue'
import slb from '@/utils/jslb-1.0.0'
import { useStore } from '@/store'

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	DataZoomComponent,
	MarkLineComponent,
	MarkPointComponent,
	CandlestickChart,
	LineChart,
	CanvasRenderer,
	UniversalTransition
])

type EChartsOption = echarts.ComposeOption<
	| TitleComponentOption
	| TooltipComponentOption
	| GridComponentOption
	| LegendComponentOption
	| DataZoomComponentOption
	| MarkLineComponentOption
	| MarkPointComponentOption
	| CandlestickSeriesOption
	| LineSeriesOption
>
export default defineComponent({
	name: 'Slb-alive',
	// components: {
	// 	Swipe,
	// 	SwipeItem
	// },
	setup() {
		const { t } = useI18n()
		const { push } = useRouter()
		const store = useStore()
		const memCode = computed(() => store.state.user.userInfo.memCode)
		// const gold = gold
		const data = reactive({
			assetsOrigin,
			images: [assetsOrigin + '/img/slbApp/slb/banner-mx.png', assetsOrigin + '/img/slbApp/slb/banner-1.png'],
			firstList: [
				{
					title: 'slb.signTAA',
					id: 1,
					to: '',
					icon: assetsOrigin + '/img/slbApp/slb/sign.png',
					iconColor: '#ff976a',
					isShow: true
				},
				// {
				// 	title: '钱包余额',
				// 	id: 2,
				// 	to: { path: '/TAA/availableTokenList' },
				// 	icon: picDisplayPath + 'slbApp/slb/balance.png',
				// 	iconColor: '#07c160',
				// 	isShow: true
				// },
				{
					title: 'routes.withdrawalTaa',
					id: 3,
					to: { path: '/TAA/withdrawalTaa' },
					icon: assetsOrigin + '/img/slbApp/slb/withdraw.png',
					iconColor: '#1afa29',
					isShow: true
				},
				{
					title: 'routes.property',
					id: 5,
					to: { path: '/mine/property' },
					icon: assetsOrigin + '/img/slbApp/new-ui/my-money.png',
					iconColor: '#1afa29',
					isShow: true
				},
				{
					title: 'TAA交易',
					id: 6,
					icon: assetsOrigin + '/img/slbApp/new-ui/exchange.png',
					to:
						// locationOrigin +
						// '/slbAppExchange/index.html#/?token=' +
						// localStorage.token +
						// '&t=' +
						// new Date().getTime(),
						process.env.NODE_ENV === 'production'
							? locationOrigin +
							  '/slbAppExchange/index.html#/?token=' +
							  localStorage.token +
							  '&t=' +
							  new Date().getTime()
							: 'http://192.168.0.99:8094/#/?token=' + localStorage.token,
					type: '_blank',
					isShow:
						[512636, 500111, 717260, 500010, 500012, 999739, 2647502].includes(memCode.value) ||
						new Date().getTime() > new Date('2022/03/12 13:00:00').getTime()
				}
				// {
				// 	title: '资讯',
				// 	id: 4,
				// 	to: 'https://dex.guru/token/0xe10ebe772a01d53745a5a6dac9c67ffb39c0b40f-bsc',
				// 	icon: picDisplayPath + 'slbApp/slb/echart.png',
				// 	iconColor: '#1afa29',
				// 	isShow: true
				// }
			],
			secondList: [
				{
					title: 'routes.updateWallet',
					id: 1,
					to: { name: 'UpdateWallet' },
					icon: assetsOrigin + '/img/slbApp/slb/wallet.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: 'routes.availableTokenList',
					id: 2,
					to: { path: '/TAA/availableTokenList' },
					icon: assetsOrigin + '/img/slbApp/slb/available-list.png',
					iconColor: '#07c160',
					isShow: true
				},
				{
					title: 'routes.takenTokenList',
					id: 3,
					to: { path: '/TAA/takenTokenList' },
					icon: assetsOrigin + '/img/slbApp/slb/token-list.png',
					iconColor: '#d4237a',
					isShow: true
				},
				{
					title: '钱包教程',
					id: 4,
					to: { name: 'TAAIndex' },
					icon: assetsOrigin + '/img/slbApp/slb/help.png',
					iconColor: '#1afa29',
					isShow: true
				}
			],
			digitalTokeList: [],
			incomeParams: {
				memSecretOpenid: localStorage.openId,
				day: 7
			},
			// 各种余额
			balanceObj: {
				releaseTaa: 0,
				unReleaseTaa: 0,
				total: 0,
				historyTotal: 0,
				alreadyWithdraw: 0
			},
			// taa实时信息
			tAACurrentInfo: {
				// maxPrice: 0,
				// minPrice: 0,
				// tokenCount: 0,
				// tokenPrice: 0
				todayMaxPrice: 0,
				todayMinPrice: 0,
				tokenCount: 0,
				nowPrice: 0,
				value: '',
				key: ''
			}
			// chg: {
			// 	value: '0%',
			// 	key: '+'
			// }
		})

		const firstListNav = computed(() => {
			return data.firstList.filter(item => item.isShow)
		})
		const secondListNav = computed(() => {
			return data.secondList.filter(item => item.isShow)
		})
		// 余额
		const getBonus = () => {
			unRelaxSum().then(res => {
				if (res.resultCode === 1) {
					//  !不能用 data.balanceObj = res.data，不能觸發更新。需要用Object.assign()方法
					// balanceObj = res.data
					Object.assign(data.balanceObj, res.data)
				}
				// console.log(balanceObj)
			})
		}

		const goRouter = (path: string | object, title: string) => {
			if (title === 'slb.signTAA') {
				const date = new Date()
				const hour = date.getHours()
				if (hour < 6 || hour > 22) {
					return Toast('签到时间为【6:00-23:00】')
				}
				appSign().then(res => {
					// if (res.resultCode === 1) {
					// 	Toast('签到成功')
					// }
					if (res.resultCode === 1) {
						// this.$toast('签到成功')
						Dialog.alert({
							title: '签到成功',
							message: '今日解锁TAA为：' + (typeof res.data === 'object' ? res.data.tokenSum : '0')
						})
					}
				})
			} else {
				if (typeof path === 'string') {
					// window.location.href = path
					slb.openAgentManagerUrl(path)
				} else {
					push(path)
				}
			}
		}
		// k线图
		// var chartDom = document.getElementById('echart')
		const chartDom = ref<any>(null)
		const getK = () => {
			getStockTaaKLineData().then(res => {
				if (res.resultCode === 1) {
					const myChart = echarts.init(chartDom.value, 'dark')
					const upColor = '#ec0000'
					const upBorderColor = '#8A0000'
					const downColor = '#00da3c'
					const downBorderColor = '#008F28'

					const xAxisData = []
					const seriesData = []
					for (const key in res.data) {
						xAxisData.push(key)
						// const { openPrice, closePrice, minPrice, maxPrice } = res.data[key]
						// seriesData.push([openPrice, closePrice, minPrice, maxPrice])
						const { openPrice, closePrice, todayMinPrice, todayMaxPrice } = res.data[key]
						seriesData.push([openPrice, closePrice, todayMinPrice, todayMaxPrice])
					}
					// Each item: open，close，lowest，highest
					const option: EChartsOption = {
						title: {
							text: 'TAA交易',
							left: 0
						},
						tooltip: {
							trigger: 'axis',
							axisPointer: {
								type: 'cross'
							}
						},
						legend: {
							// data: ['时K', 'MA5', 'MA10', 'MA20', 'MA30']
							// data: ['时K']
						},
						grid: {
							left: '10%',
							right: '1%',
							bottom: '15%'
						},
						xAxis: {
							type: 'category',
							data: xAxisData,
							scale: true,
							boundaryGap: false,
							axisLine: { onZero: false },
							splitLine: { show: false },
							min: 'dataMin',
							max: 'dataMax'
						},
						yAxis: {
							scale: true,
							splitArea: {
								show: true
							}
						},
						dataZoom: [
							{
								type: 'inside',
								start: 50,
								end: 100
							},
							{
								show: true,
								type: 'slider',
								top: '90%',
								start: 50,
								end: 100
							}
						],
						series: [
							{
								name: '时K',
								type: 'candlestick',
								data: seriesData,
								itemStyle: {
									color: upColor,
									color0: downColor,
									borderColor: upBorderColor,
									borderColor0: downBorderColor
								}
								// markPoint: {
								// label: {
								// 	formatter: function (param: any) {
								// 		return param != null ? Math.round(param.value) + '' : ''
								// 	}
								// },
								// data: [
								// {
								// 	name: 'Mark',
								// 	coord: ['2013/5/31', 2300],
								// 	value: 2300,
								// 	itemStyle: {
								// 		color: 'rgb(41,60,85)'
								// 	}
								// },
								// {
								// 	name: 'highest value',
								// 	type: 'max',
								// 	valueDim: 'highest'
								// },
								// {
								// 	name: 'lowest value',
								// 	type: 'min',
								// 	valueDim: 'lowest'
								// },
								// {
								// 	name: 'average value on close',
								// 	type: 'average',
								// 	valueDim: 'close'
								// }
								// ],
								// tooltip: {
								// 	formatter: function (param: any) {
								// 		return param.name + '<br>' + (param.data.coord || '')
								// 	}
								// }
								// }
								// markLine: {
								// 	symbol: ['none', 'none'],
								// 	data: [
								// 		[
								// 			{
								// 				name: 'from lowest to highest',
								// 				type: 'min',
								// 				valueDim: 'lowest',
								// 				symbol: 'circle',
								// 				symbolSize: 10,
								// 				label: {
								// 					show: false
								// 				},
								// 				emphasis: {
								// 					label: {
								// 						show: false
								// 					}
								// 				}
								// 			},
								// 			{
								// 				type: 'max',
								// 				valueDim: 'highest',
								// 				symbol: 'circle',
								// 				symbolSize: 10,
								// 				label: {
								// 					show: false
								// 				},
								// 				emphasis: {
								// 					label: {
								// 						show: false
								// 					}
								// 				}
								// 			}
								// 		],
								// 		{
								// 			name: 'min line on close',
								// 			type: 'min',
								// 			valueDim: 'close'
								// 		},
								// 		{
								// 			name: 'max line on close',
								// 			type: 'max',
								// 			valueDim: 'close'
								// 		}
								// 	]
								// }
							}
							// {
							// 	name: 'MA5',
							// 	type: 'line',
							// 	data: calculateMA(5, seriesData),
							// 	smooth: true,
							// 	lineStyle: {
							// 		opacity: 0.5
							// 	}
							// },
							// {
							// 	name: 'MA10',
							// 	type: 'line',
							// 	data: calculateMA(10, seriesData),
							// 	smooth: true,
							// 	lineStyle: {
							// 		opacity: 0.5
							// 	}
							// }
							// {
							// 	name: 'MA20',
							// 	type: 'line',
							// 	data: calculateMA(20, seriesData),
							// 	smooth: true,
							// 	lineStyle: {
							// 		opacity: 0.5
							// 	}
							// }
							// {
							// 	name: 'MA30',
							// 	type: 'line',
							// 	data: calculateMA(30, seriesData),
							// 	smooth: true,
							// 	lineStyle: {
							// 		opacity: 0.5
							// 	}
							// }
						]
					}

					option && myChart.setOption(option)
				}
			})
		}

		onActivated(() => {
			// 获取各种币汇率
			getDigitalTokeExchangeFromSc().then(res => {
				if (res.resultCode === 1) {
					const baseArr = JSON.parse(
						JSON.stringify(res.data.filter((item: any) => item.market === 'susdcny'))
					)

					res.data.forEach((item: any) => {
						item.market = item.market.replace('susd', '')
						// this.$set(item, 'cnyPrice', (item.price * baseArr[0].price).toFixed(4))
						item.cnyPrice = (item.price * baseArr[0].price).toFixed(4)
						if (item.market === 'cny') {
							item.market = 'susd'
							item.cnyPrice = baseArr[0].price
							item.price = 1
						}
					})
					// console.log(res.data)
					// data.digitalTokeList = res.data
					data.digitalTokeList = res.data.filter(
						(item: any) =>
							item.market === 'susd' ||
							item.market.indexOf('sie') === 0 ||
							item.market.indexOf('usdt') === 0 ||
							item.market.indexOf('gas') === 0 ||
							item.market.indexOf('btc') === 0
					)
				}
			})
			// 获取余额
			getBonus()
			// 生成k线图
			getK()
			// 获取taa当前交易信息
			// getCurrentTaaData().then(res => {
			// 	if (res.resultCode === 1) {
			// 		res.data && Object.assign(data.tAACurrentInfo, res.data)
			// 	}
			// })
			// // 涨跌幅
			// getTaaRiseAndFall().then(res => {
			// 	if (res.resultCode === 1) {
			// 		data.chg = res.data
			// 	}
			// })
			getTaaRiseAndFall1().then(res => {
				if (res.resultCode === 1) {
					res.data && Object.assign(data.tAACurrentInfo, res.data)
				}
			})
			getStockTaaData().then(res => {
				if (res.resultCode === 1) {
					res.data && Object.assign(data.tAACurrentInfo, res.data)
				}
			})
		})

		return {
			...toRefs(data),
			chartDom,
			firstListNav,
			secondListNav,
			goRouter,
			gold,
			t
		}
	}
})
</script>

<style scoped lang="less">
@import '../../assets/css/local.less';
.slb {
	// 轮播
	.my-swipe {
		// background: #fff;
		margin: 20 * @fontSize;
		// margin-top: -74*@fontSize;
		// padding: 0 10*@fontSize;
		text-align: center;
	}
	.top {
		box-sizing: border-box;
		height: 300 * @fontSize;
		padding-top: 40 * @fontSize;
		color: #fff;
		text-align: center;
		background-image: url('@{baseUrl}/img/slbApp/login/mine-bg.png');
		background-repeat: no-repeat;
		background-position-y: -60 * @fontSize;
		background-size: cover;

		.top-top {
			font-weight: 400;
			font-size: 36 * @fontSize;
		}

		.top-bottom {
			box-sizing: border-box;
			margin-top: 30 * @fontSize;
			font-size: 28 * @fontSize;
			text-align: center;
			> div {
				width: 50%;
			}
			> div:not(:last-child) {
				border-right: 1px solid #fff;
			}
			p:nth-child(2) {
				margin-top: 10 * @fontSize;
			}
		}
	}
	.padding-section {
		margin: 20 * @fontSize;
	}
	.menu-container {
		padding: 30 * @fontSize 0;
		color: #4b4b4b;
		text-align: center;
		background: #fff;
		border-radius: 10px;
		.item {
			// width: 25%;
			flex: 1;
			p {
				margin-bottom: 10 * @fontSize;
			}
		}
		.first-child {
			box-sizing: border-box;
			padding: 0 20 * @fontSize;
			font-size: 24 * @fontSize;
			img {
				width: 72 * @fontSize;
			}
			> div:not(:last-child) {
				p {
					border-right: 1px solid #ededed;
				}
			}
		}
		.second-child {
			margin-top: 30 * @fontSize;
			padding: 0 40 * @fontSize;
			font-size: 20 * @fontSize;
			img {
				width: 56 * @fontSize;
			}
		}
	}
	.chart-container {
		// background: #fff;
		margin-top: 20 * @fontSize;
		// > p {
		// margin-left: 20 * @fontSize;
		// }
		// padding-top: 20 * @fontSize;
		.chart-top {
			// background: #100c2a;
			margin-top: 20 * @fontSize;
			padding-bottom: 20 * @fontSize;
			color: #fff;
			background: #3b4365;
			.left {
				width: 60%;
				// text-align: center;
				padding-left: 40 * @fontSize;
				color: @primaryColor;
				font-size: 24px;
				.chg {
					font-size: 16px;
				}
				.fall {
					color: #00da3c;
					// &::before {
					// 	content: '- ';
					// 	display: inline-block;
					// }
				}
				.rise {
					color: #ec0000;
					// &::before {
					// 	content: '+ ';
					// 	display: inline-block;
					// }
				}
			}
			.right {
				width: 40%;
				padding: 20 * @fontSize;
				> p {
					line-height: 30px;
				}
			}
		}
		#chart {
			width: 100%;
			height: 308px;
			// margin-top: 20 * @fontSize;
		}
	}
	.cat-list {
		margin: 20 * @fontSize 0;
		.cat-title {
			color: #060606;
			font-weight: bold;
			font-size: 28 * @fontSize;
		}
		.cat-container {
			margin-top: 18 * @fontSize;
			padding: 20 * @fontSize 0;
			background: #fff;
			border-radius: 5 * @fontSize;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);
			.th {
				padding: 0 20 * @fontSize;
				color: #555;
				font-weight: 400;
				font-size: 30 * @fontSize;
				line-height: 48 * @fontSize;
				border-bottom: 1px solid #979797;
				& > p {
					width: 33%;
				}
			}
			.cat-top {
				padding: 0 20 * @fontSize;
				color: #999;
				font-size: 26 * @fontSize;
				line-height: 66 * @fontSize;
				& > p {
					width: 33%;
				}
				&:nth-child(odd) {
					background: #ebeff4;
				}
			}
		}
	}
	// 每个类别标题
	.main-title {
		img {
			width: 10 * @fontSize;
			height: 40 * @fontSize;
			margin-right: 10 * @fontSize;
			margin-left: 20 * @fontSize;
		}
	}
}
</style>
