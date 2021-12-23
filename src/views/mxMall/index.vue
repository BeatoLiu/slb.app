<template>
	<div class="mx-mall">
		<!-- <img src="../../assets/img/mixuan/banner.png" alt="" /> -->
		<div class="search flex-center">
			<form action="javascript:return true">
				<Search
					v-model="proName"
					shape="round"
					readonly
					placeholder="输入您要搜索的产品或口令"
					@click="$router.push({ name: 'GoodsSearch' })"
				>
					<!-- @search="searchProList" -->
				</Search>
			</form>
			<div class="btn">
				<img src="../../assets/img/class.png" alt="" />
				<span @click="$router.push({ name: 'GoodsCategory' })">分类</span>
			</div>
		</div>
		<section class="hot-big flex-space" v-if="proList1.length && proList2.length">
			<div>
				<div
					class="flex-start"
					@click="$router.push({ name: 'GoodsSearch', query: { cTag: 1, title: '热销榜' } })"
				>
					<p class="title">热销榜</p>
					<p class="sub-title hot-sub">限时促销</p>
				</div>
				<p class="sub-title flex-start" style="margin: 0">
					<Icon name="bullhorn-o" />
					爆款限时抢购
				</p>
				<div class="flex-start" style="overflow: hidden">
					<div v-for="item in proList1" :key="item.cCode" class="pro-content" @click="toFood(item.cCode)">
						<img :src="imgPath(item.cPicName)" alt="" />
						<p class="child-title">{{ item.cName }}</p>
						<div class="price">
							<span class="group-price">￥{{ item.cPrice }}</span>
							<span class="orige">￥{{ item.cShowPrice }}</span>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div
					class="flex-start"
					@click="$router.push({ name: 'GoodsSearch', query: { cTag: 2, title: '大红包' } })"
				>
					<p class="title">大红包</p>
					<p class="sub-title big-sub">省钱利器</p>
				</div>
				<p class="sub-title flex-start" style="margin: 0">
					<Icon name="bullhorn-o" />
					买就返大额TAA
				</p>
				<div class="flex-start" style="overflow: hidden">
					<div v-for="item in proList2" :key="item.cCode" class="pro-content" @click="toFood(item.cCode)">
						<img :src="imgPath(item.cPicName)" alt="" />
						<p class="child-title">{{ item.cName }}</p>
						<div class="price">
							<span class="group-price">￥{{ item.cPrice }}</span>
							<span class="orige">￥{{ item.cShowPrice }}</span>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="benifit" v-if="proList3.length">
			<div
				class="flex-space"
				@click="$router.push({ name: 'GoodsSearch', query: { cTag: 3, title: '限时优惠' } })"
			>
				<div class="main-title flex-start">
					<img src="../../assets/img/title-left.png" alt="" />
					<p class="title">限时优惠</p>
					<p class="sub-title benifit-sub flex-start">
						<Icon name="fire-o" />
						爆款限时抢购
					</p>
				</div>
				<p style="color: #999">更多&nbsp;></p>
			</div>
			<div class="flex-space" style="overflow: hidden">
				<div v-for="item in proList3" :key="item.cCode" class="benifit-content" @click="toFood(item.cCode)">
					<img :src="imgPath(item.cPicName)" alt="" />
					<p class="child-title">{{ item.cName }}</p>
					<div class="price">
						<span class="group-price">￥{{ item.cPrice }}</span>
						<span class="orige">￥{{ item.cShowPrice }}</span>
					</div>
				</div>
			</div>
		</section>
		<div>
			<PullRefresh v-model="refreshing" @refresh="onRefresh">
				<div class="hots">
					<div class="main-title flex-start hots-title">
						<img src="../../assets/img/title-left.png" alt="" />
						<div class="title">热门推荐</div>
					</div>
					<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
						<div class="child-content">
							<div class="child" v-for="item in dataList" :key="item.cCode" @click="toFood(item.cCode)">
								<img :src="imgPath(item.cPicName)" alt="" />
								<p class="child-title">{{ item.cName }}</p>
								<div class="price">
									<span class="group-price">￥{{ item.cPrice }}</span>
									<span class="orige">￥{{ item.cShowPrice }}</span>
								</div>
								<div class="foot">
									<!-- &#8776;  -->
									<TAAPrice :mCode="item.mCode" :price="item.cPrice" />
									<!-- <span>预返{{ item.taaPrice }} TAA</span> -->
									<span>已售{{ item.cTotalAmount }}件</span>
								</div>
							</div>
						</div>
					</List>
				</div>
			</PullRefresh>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { Search, PullRefresh, List, Icon } from 'vant'
import { useRouter } from 'vue-router'
// import { showMemberCommodity } from '@/apis/mx'
import { IShowMemberCommodityItem } from '@/apis/model/mxModel'
import { useImgPath } from '@/hooks/mx/useImgPath'
import { useGoodsList } from '@/hooks/mx/useGoodsList'
// import { useEcGasCalc } from '../../hooks/mx/useEcGasCalc'

import TAAPrice from './components/TAAPrice.vue'

export default defineComponent({
	name: 'MxMall-alive',
	components: {
		Search,
		PullRefresh,
		List,
		Icon,
		TAAPrice
	},
	setup() {
		const { currentRoute, push } = useRouter()
		const { imgPath } = useImgPath()

		// const calcPower = useEcGasCalc()
		const proName = currentRoute.value.query.proName as string
		const data = reactive({
			showSearch: false,
			proName: proName,
			params: {
				cInvestType: 0,
				cAuditStatus: 1,
				cName: '',
				pageNum: 0,
				pageSize: 10
			}
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = useGoodsList(data.params)
		// const proList = ref<showMemberCommodityItem[]>([])
		const proList1 = ref<IShowMemberCommodityItem[]>([]) // 热销榜
		const proList2 = ref<IShowMemberCommodityItem[]>([]) // 大红包
		const proList3 = ref<IShowMemberCommodityItem[]>([]) // 限时优惠
		// 标签商品列表
		// const getTagProList = (params: any) => {
		// 	showMemberCommodity(params).then(res => {
		// 		if (res.resultCode === 1) {
		// 			res.data.dataIn.forEach(ele => {
		// 				ele.cPrice = Number(ele.cPrice)
		// 				ele.cShowPrice = Number(ele.cShowPrice)
		// 			})
		// 			if (params.cTag === 1) {
		// 				proList1.value = res.data.dataIn
		// 			} else if (params.cTag === 2) {
		// 				proList2.value = res.data.dataIn
		// 			} else if (params.cTag === 3) {
		// 				proList3.value = res.data.dataIn
		// 			}
		// 		}
		// 	})
		// }
		const toFood = (code: number) => {
			push({ name: 'GoodsDetail', query: { cCode: code } })
		}

		return {
			...toRefs(data),
			proList1,
			proList2,
			proList3,
			refreshing,
			loading,
			finished,
			dataList,
			onLoad,
			onRefresh,
			toFood,
			imgPath
			// calcPower
		}
	},
	beforeRouteEnter: (to, from, next) => {
		next((vm: any) => {
			if (from.name === 'class' && to.query.proName) {
				vm.proName = to.query.proName
				// console.log(from.name, to.query.proName)
				vm.onRefresh()
			}
			// document.documentElement.scrollTop = vm.scrollTop
		})
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.mx-mall {
	padding: 0 10 * @fontSize;
	background: #fff;

	.title {
		color: #060606;
		font-weight: bold;
		font-size: 32 * @fontSize;
		font-family: 'PingFang SC', sans-serif;
	}

	.sub-title {
		margin-left: 20 * @fontSize;
		// line-height: 28*@fontSize;
		padding: 1 * @fontSize 14 * @fontSize;
		color: #ff484e;
		font-size: 20 * @fontSize;
		border-radius: 10px;
	}
	// 每个类别标题
	.main-title {
		img {
			width: 8 * @fontSize;
			margin-right: 10 * @fontSize;
			// height: 40*@fontSize;
		}
	}
	.child-title {
		// font-size: 22*@fontSize;
		margin-top: 10 * @fontSize;
		margin-left: 5 * @fontSize;
		overflow: hidden; /* 一定不能少 超出的内容进行隐藏 */
		color: #333;
		font-weight: bold;
		line-height: 1.3;
		white-space: nowrap; /* 强制在一行显示 */
		text-align: left;
		text-overflow: ellipsis; /* 设置超出内容显示... */
	}
	.price {
		text-align: left;
		.orige {
			// margin-right: 10*@fontSize;
			color: #808080;
			font-size: 14 * @fontSize;
			text-decoration: line-through;
		}
		.group-price {
			margin-right: 10 * @fontSize;
			color: #ed0c17;
			// font-size: 18*@fontSize;
			font-size: 32 * @fontSize;
		}
	}
	.search {
		position: relative;
		padding: 10 * @fontSize 20 * @fontSize;
		background: #fff;
		//.search-img {
		//	position: absolute;
		//	top: 30 * @fontSize;
		//	left: 50 * @fontSize;
		//	width: 37 * @fontSize;
		//	height: 37 * @fontSize;
		//}
		form {
			width: 600 * @fontSize;
		}

		input {
			// width: 580*@fontSize;
			box-sizing: border-box;
			padding: 13 * @fontSize 0 13 * @fontSize 85 * @fontSize;
			border: 1px solid #dcdcdc;
			border-radius: 10 * @fontSize;
		}
		.btn {
			display: inline-block;
			width: 120 * @fontSize;
			margin-left: 10 * @fontSize;
			color: #fff;
			line-height: 70 * @fontSize;
			text-align: center;
			background: #ed0c17;
			border-radius: 10 * @fontSize;

			img {
				width: 25 * @fontSize;
				margin-top: 22 * @fontSize;
				margin-right: 5 * @fontSize;
			}
		}
	}
	.hot-big {
		min-height: 180 * @fontSize;
		margin: 20 * @fontSize 0;
		padding: 20 * @fontSize;
		border-radius: 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);

		& > div {
			width: 48%;

			.hot-sub {
				color: #fff;
				background: linear-gradient(137deg, #8bedff 0%, #00a3ed 100%);
			}

			.big-sub {
				color: #fff;
				background: linear-gradient(135deg, #b68dff 0%, #6b60f2 100%);
			}
		}
	}
	.benifit {
		min-height: 180 * @fontSize;
		padding: 20 * @fontSize;
		border-radius: 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);

		.benifit-sub {
			border: 1px solid #ff484e;
		}
	}
	.pro-content {
		flex: 1;
		width: 50%;
		margin-top: 10 * @fontSize;
		margin-right: 10 * @fontSize;
		overflow: hidden;

		img {
			width: 160 * @fontSize;
			height: 160 * @fontSize;
			// height: 100%;
		}

		.child-title {
			font-size: 22 * @fontSize;
		}
		.price {
			text-align: left;

			.group-price {
				color: #ed0c17;
				font-size: 18 * @fontSize;
			}
		}
	}
	.orige {
		// margin-right: 10*@fontSize;
		color: #808080;
		font-size: 14 * @fontSize;
		text-decoration: line-through;
	}
	.benifit-content {
		flex: 1;
		width: 50%;
		margin-top: 10 * @fontSize;
		margin-right: 10 * @fontSize;
		overflow: hidden;

		img {
			width: 220 * @fontSize;
			height: 220 * @fontSize;
			// height: 100%;
		}

		.child-title {
			font-size: 22 * @fontSize;
		}
		.price {
			text-align: left;
			.orige {
				// margin-right: 10*@fontSize;
				color: #808080;
				font-size: 16 * @fontSize;
				text-decoration: line-through;
			}
			.group-price {
				color: #ed0c17;
				font-size: 18 * @fontSize;
			}
		}
	}
	.hots {
		margin-top: 20 * @fontSize;
		background: #fff;

		.hots-title {
			padding: 20 * @fontSize;
		}

		.child-content {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			box-sizing: border-box;
			// flex: 1;
			// padding-left: 1%;
			// align-items: center;
		}

		.child {
			// width: 345*@fontSize;
			box-sizing: border-box;
			width: 48%;
			margin-top: 20 * @fontSize;
			margin-right: 1%;
			margin-left: 1%;
			padding: 20 * @fontSize 20 * @fontSize 10 * @fontSize;
			// display: inline-block;
			// flex: 1;
			text-align: center;
			border: 1px solid #f4f4f4;
			// margin-left: 20*@fontSize;

			img {
				height: 280 * @fontSize;
				// width: 280*@fontSize;
			}

			.foot {
				// margin-top: -6*@fontSize;
				display: flex;
				justify-content: space-between;
				color: #808080;
				font-size: 20 * @fontSize;
				// align-items:center;
				// span{
				//     display: block;
				// }
			}
		}
	}
}
</style>
