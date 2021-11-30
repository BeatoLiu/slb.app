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
					<p>{{ balanceObj.historyTotal }}</p>
				</div>
				<div class="flex-center top-bottom">
					<div>
						<p>已释放</p>
						<p>{{ balanceObj.releaseTaa }}</p>
					</div>
					<div>
						<p>已提T</p>
						<p>{{ balanceObj.alreadyWithdraw }}</p>
					</div>
				</div>
			</div>
		</section>
		<section class="padding-section">
			<div class="menu-container">
				<div class="first-child flex-start">
					<div class="item" v-for="item in firstListNav" :key="item.id" @click="goRouter(item.to, item.title)">
						<p><img :src="item.icon" alt="" /></p>
						<div class="name">{{ t(item.title) }}</div>
					</div>
				</div>
				<div class="second-child flex-start">
					<div class="item" v-for="item in secondListNav" :key="item.title" @click="goRouter(item.to, item.title)">
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
				<img :src="picDisplayPath + 'secret/banners/movie_banner.png'" alt="" />
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
import { Swipe, SwipeItem, Toast, Dialog } from 'vant'
// import * as echarts from 'echarts/core'
// import { TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
// import { LineChart } from 'echarts/charts'
// import { CanvasRenderer } from 'echarts/renderers'
// import { $ } from '../../api/axios'
// import { stringify } from 'qs'
import { picDisplayPath } from '../../utils/config'
import { computed, defineComponent, onActivated, reactive, toRefs } from 'vue-demi'
// import { httpPost } from '../../apis/axios'
import { getDigitalTokeExchangeFromSc } from '../../apis/slb'
import { useI18n } from '../../hooks/setting/useI18n'
import { appSign, unRelaxSum } from '../../apis/tAA'
import { useRouter } from 'vue-router'
// import bannerMx from '../../assets/img/index/banner-mx.png'
// import banner1 from '../../assets/img/slb/banner-1.png'
// import cardImg from '../../assets/img/slb/card.png'
// import rechargeImg from '../../assets/img/slb/recharge.png'
// import shopImg from '../../assets/img/slb/shop.png'
// echarts.use([
// 	TitleComponent,
// 	ToolboxComponent,
// 	TooltipComponent,
// 	GridComponent,
// 	LegendComponent,
// 	LineChart,
// 	CanvasRenderer
// ])
export default defineComponent({
	name: 'Slb-alive',
	components: {
		Swipe,
		SwipeItem
	},
	setup() {
		const { t } = useI18n()
		const { push } = useRouter()
		const data = reactive({
			picDisplayPath,
			images: [picDisplayPath + 'slbApp/slb/banner-mx.png', picDisplayPath + 'slbApp/slb/banner-1.png'],
			firstList: [
				{
					title: 'slb.signTAA',
					id: 1,
					to: '',
					icon: picDisplayPath + 'slbApp/slb/sign.png',
					iconColor: '#ff976a',
					isShow: true
				},
				{
					title: '钱包余额',
					id: 2,
					to: { path: '/TAA/availableTokenList' },
					icon: picDisplayPath + 'slbApp/slb/balance.png',
					iconColor: '#07c160',
					isShow: true
				},
				{
					title: 'routes.withdrawalTaa',
					id: 3,
					to: { path: '/TAA/withdrawalTaa' },
					icon: picDisplayPath + 'slbApp/slb/withdraw.png',
					iconColor: '#1afa29',
					isShow: true
				},
				{
					title: '资讯',
					id: 4,
					to: 'https://dex.guru/token/0xe10ebe772a01d53745a5a6dac9c67ffb39c0b40f-bsc',
					icon: picDisplayPath + 'slbApp/slb/echart.png',
					iconColor: '#1afa29',
					isShow: true
				}
			],
			secondList: [
				{
					title: 'routes.updateWallet',
					id: 1,
					to: { name: 'UpdateWallet' },
					icon: picDisplayPath + 'slbApp/slb/wallet.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: 'routes.availableTokenList',
					id: 2,
					to: { path: '/TAA/availableTokenList' },
					icon: picDisplayPath + 'slbApp/slb/available-list.png',
					iconColor: '#07c160',
					isShow: true
				},
				{
					title: 'routes.takenTokenList',
					id: 3,
					to: { path: '/TAA/takenTokenList' },
					icon: picDisplayPath + 'slbApp/slb/token-list.png',
					iconColor: '#d4237a',
					isShow: true
				},
				{
					title: '钱包教程',
					id: 4,
					to: { name: 'TAAIndex' },
					icon: picDisplayPath + 'slbApp/slb/help.png',
					iconColor: '#1afa29',
					isShow: true
				},
				{
					title: 'routes.property',
					id: 5,
					to: { path: '/mine/property' },
					icon: picDisplayPath + 'slbApp/new-ui/my-money.png',
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
			}
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
					window.location.href = path
				} else {
					push(path)
				}
			}
		}

		// const changeDay =(day)=> {
		// 	data.incomeParams.day = day
		// 	getIcome()
		// }
		// 个人收益
		// const getIcome = () => {
		// 	memCodeIncome(data.incomeParams).then(res => {
		// 		if (res.resultCode === 1) {
		// 			var chartDom = document.getElementById('echart')
		// 			var myChart = echarts.init(chartDom)
		// 			var option

		// 			option = {
		// 				title: {
		// 					text: '收益走势'
		// 				},
		// 				tooltip: {
		// 					trigger: 'axis'
		// 				},
		// 				legend: {
		// 					data: [] // ['人民币', 'SUSD', 'SIE']
		// 				},
		// 				grid: {
		// 					left: '3%',
		// 					right: '4%',
		// 					bottom: '3%',
		// 					containLabel: true
		// 				},
		// 				// toolbox: {
		// 				//     feature: {
		// 				//         saveAsImage: {}
		// 				//     }
		// 				// },
		// 				xAxis: {
		// 					type: 'category',
		// 					boundaryGap: false,
		// 					data: [] // ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
		// 				},
		// 				yAxis: {
		// 					type: 'value'
		// 				},
		// 				series: [
		// 					// {
		// 					//     name: '人民币',
		// 					//     type: 'line',
		// 					//     stack: '总量',
		// 					//     data: [120, 132, 101, 134, 90, 230, 210]
		// 					// }
		// 				]
		// 			}
		// 			let item = {}
		// 			// 获取时间下标
		// 			for (let key in res.data) {
		// 				// console.log(key)
		// 				option.xAxis.data.push(key)
		// 				item = res.data[key]
		// 			}
		// 			// 获取数据币种
		// 			for (let key in item) {
		// 				let text = key
		// 				option.series.push({
		// 					name: text,
		// 					type: 'line',
		// 					stack: '总量',
		// 					data: []
		// 				})
		// 			}
		// 			// 各币种具体收益
		// 			for (let key in res.data) {
		// 				let subData = res.data[key]
		// 				for (let subKey in subData) {
		// 					option.series.forEach(item => {
		// 						if (item.name === subKey) {
		// 							item.data.push(subData[subKey])
		// 						}
		// 					})
		// 				}
		// 			}
		// 			// 0 和 1 都是人民币，需要数据合并
		// 			let arr = option.series.filter(item => item.name === '0')[0]
		// 			let arr1 = option.series.filter(item => item.name === '1')[0]
		// 			// console.log((arr))
		// 			let length = arr.data.length
		// 			// 合并后的对象
		// 			let obj = {
		// 				name: '1',
		// 				type: 'line',
		// 				stack: '总量',
		// 				data: []
		// 			}
		// 			// 0 和 1 数据合并
		// 			for (let i = 0; i < length; i++) {
		// 				obj.data.push(arr.data[i] + arr1.data[i])
		// 			}
		// 			// 合并后，将原有的0和1替换成现在的1
		// 			option.series.splice(0, 2, obj)
		// 			// 将数字所代表的币种换成相应的文字描述
		// 			option.series.forEach(item => {
		// 				if (item.name === '1') {
		// 					item.name = '人民币'
		// 					option.legend.data.push('人民币')
		// 				} else if (item.name === '6') {
		// 					item.name = 'SIE'
		// 					option.legend.data.push('SIE')
		// 				} else if (item.name === '10') {
		// 					item.name = 'SUSD'
		// 					option.legend.data.push('SUSD')
		// 				}
		// 			})
		// 			// console.log(option)
		// 			option && myChart.setOption(option)
		// 		}
		// 	})
		// }
		onActivated(() => {
			getDigitalTokeExchangeFromSc().then(res => {
				if (res.resultCode === 1) {
					let baseArr = JSON.parse(JSON.stringify(res.data.filter((item: any) => item.market === 'susdcny')))
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
					data.digitalTokeList = res.data
				}
			})
			getBonus()
		})

		return {
			...toRefs(data),
			firstListNav,
			secondListNav,
			goRouter,
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
		height: 300 * @fontSize;
		background-image: url('http://mg.2qzs.com/img/slbApp/login/mine-bg.png');
		background-size: cover;
		background-position-y: -60 * @fontSize;
		background-repeat: no-repeat;
		color: #fff;
		text-align: center;
		box-sizing: border-box;
		padding-top: 40 * @fontSize;
		.top-top {
			font-size: 36 * @fontSize;
			font-weight: 400;
		}
		.top-bottom {
			margin-top: 30 * @fontSize;
			font-size: 28 * @fontSize;
			text-align: center;
			box-sizing: border-box;
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
		background: #fff;
		border-radius: 10px;
		text-align: center;
		padding: 30 * @fontSize 0;
		color: #4b4b4b;
		.item {
			width: 25%;
			p {
				margin-bottom: 10 * @fontSize;
			}
		}
		.first-child {
			font-size: 24 * @fontSize;
			padding: 0 20 * @fontSize;
			box-sizing: border-box;
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
			padding: 0 40 * @fontSize;
			margin-top: 30 * @fontSize;
			font-size: 20 * @fontSize;
			img {
				width: 56 * @fontSize;
			}
		}
	}

	.echart-container {
		background: #fff;
		margin-top: 20 * @fontSize;
		padding-top: 20 * @fontSize;
		.day {
			color: #fff;
			font-size: 30 * @fontSize;
			p {
				margin-right: 20 * @fontSize;
			}
			.normal {
				background: #b6bac0;
				border-radius: 10px;
				padding: 0 30 * @fontSize;
			}
			.active {
				background: linear-gradient(135deg, #fb8b74 0%, #fe2c4b 100%);
			}
		}
		#echart {
			width: 100%;
			height: 308px;
			margin-top: 20 * @fontSize;
		}
	}
	.cat-list {
		margin: 20 * @fontSize;
		.cat-title {
			color: #060606;
			font-size: 28 * @fontSize;
			font-weight: bold;
		}
		.cat-container {
			background: #fff;
			border-radius: 5 * @fontSize;
			padding: 20 * @fontSize 0;
			box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.14);
			margin-top: 18 * @fontSize;
			.th {
				padding: 0 20 * @fontSize;
				font-weight: 400;
				font-size: 30 * @fontSize;
				color: #555;
				border-bottom: 1px solid #979797;
				line-height: 48 * @fontSize;
				& > p {
					width: 33%;
				}
			}
			.cat-top {
				padding: 0 20 * @fontSize;
				line-height: 66 * @fontSize;
				color: #999;
				font-size: 26 * @fontSize;
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
			margin-right: 10 * @fontSize;
			height: 40 * @fontSize;
		}
	}
}
</style>
