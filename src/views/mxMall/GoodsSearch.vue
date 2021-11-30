<template>
	<div class="group">
		<!-- <img src="../../assets/img/mixuan/banner.png" alt="" > -->
		<div class="search flex-center">
			<form action="javascript:return true">
				<Search v-model="params.cName" shape="round" placeholder="输入您要搜索的产品或口令" @search="searchProList">
				</Search>
			</form>
			<div class="btn">
				<img src="../../assets/img/class.png" alt="" />
				<span @click="$router.push({ name: 'GoodsCategory' })">分类</span>
			</div>
		</div>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="hots">
				<div class="title">
					<div class="name">{{ title }}</div>
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
								<!-- <span>预返{{ item.taaPrice }} TAA</span> -->
								<TAAPrice :mCode="item.mCode" :price="item.cPrice" />
								<span>已售{{ item.cTotalAmount }}件</span>
							</div>
						</div>
					</div>
				</List>
			</div>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { PullRefresh, List, Search } from 'vant'
import { defineComponent, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useGoodsList } from '../../hooks/mx/useGoodsList'
import { useImgPath } from '../../hooks/mx/useImgPath'

import TAAPrice from './components/TAAPrice.vue'

export default defineComponent({
	name: 'GoodsSearch-alive',
	components: {
		PullRefresh,
		List,
		Search,
		TAAPrice
	},
	setup() {
		const { currentRoute, push } = useRouter()
		const { imgPath } = useImgPath()

		const proName = currentRoute.value.query.proName as string
		const title = currentRoute.value.query.title as string
		const data = reactive({
			scrollTop: 0,
			params: {
				cInvestType: 0,
				cAuditStatus: 1,
				pageNum: 0,
				pageSize: 10,
				cName: proName || ''
				// cTag: ''
			},
			title: title || '热门推荐'
		})

		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = useGoodsList(data.params)

		//搜索商品
		const searchProList = () => {
			//  ￥cF8xNzI5NTAy￥
			// console.log(data.proName)
			let codeStr = data.params.cName
			// Dialog.confirm({message: data.proName})
			// Dialog.confirm({message: /^￥\w+￥$/.test(data.proName)})
			if (/^￥\w+=*￥$/.test(data.params.cName)) {
				// 判断输入的是不是口令
				// alert(codeStr + '---1')
				codeStr = codeStr.split('￥')[1]
				// codeStr = Base64.decode(codeStr) // 苹果手机里该方法有问题
				codeStr = window.atob(codeStr)
				// alert(codeStr + '---3')
				let codeArr = codeStr.split('_')
				// alert(codeArr.toString() + '---4')
				// Dialog.confirm({message: codeArr.toString() + '---4'})
				if (codeArr[0] === 'p') {
					// 商品
					toFood(+codeArr[1])
				} else if (codeArr[0] === 'g') {
					// 团购
					push({ name: 'food', query: { cCode: codeArr[1], gpoCode: codeArr[2] } })
				}
			} else {
				// data.parms.pageNum = 0
				// data.proList = []
				// data.finished = false
				// data.onLoad()
				onRefresh()
			}
		}
		const toFood = (code: number) => {
			push({ name: 'GoodsDetail', query: { cCode: code } })
		}
		return {
			...toRefs(data),
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			imgPath,
			searchProList,
			toFood
		}
	},
	//在页面离开时记录滚动位置
	beforeRouteLeave(to, from, next) {
		this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
		next()
	},
	//进入该页面时，用之前保存的滚动位置赋值
	beforeRouteEnter(to, from, next) {
		// console.log(to)
		next((vm: any) => {
			// console.log(from)
			if (from.name === 'GoodsCategory' && to.query.proName) {
				vm.params.cName = to.query.proName
				vm.onRefresh()
			}
			document.documentElement.scrollTop = vm.scrollTop
		})
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.group {
	.search {
		padding: 10 * @fontSize 20 * @fontSize;
		position: relative;
		background: #fff;
		form {
			width: 600 * @fontSize;
		}
		input {
			// width: 580*@fontSize;
			border: 1px solid #dcdcdc;
			padding: 13 * @fontSize 0 13 * @fontSize 85 * @fontSize;
			border-radius: 10 * @fontSize;
			box-sizing: border-box;
		}
		.btn {
			display: inline-block;
			margin-left: 10 * @fontSize;
			width: 120 * @fontSize;
			line-height: 70 * @fontSize;
			background: #ed0c17;
			text-align: center;
			border-radius: 10 * @fontSize;
			color: #fff;
			img {
				width: 25 * @fontSize;
				margin-top: 22 * @fontSize;
				margin-right: 5 * @fontSize;
			}
		}
	}
	// .hots {
	// 	background: #fff;
	// 	padding: 0 20 * @fontSize 0 30 * @fontSize;
	// 	.title {
	// 		// height: 80*@fontSize;
	// 		display: flex;
	// 		align-items: center;
	// 		img {
	// 			width: 25 * @fontSize;
	// 		}
	// 		.name {
	// 			color: #ff5252;
	// 			font-size: 26 * @fontSize;
	// 			font-weight: bold;
	// 			margin-left: 10 * @fontSize;
	// 			flex: 1;
	// 			span {
	// 				font-size: 22 * @fontSize;
	// 				font-weight: normal;
	// 				color: #696969;
	// 				margin-left: 10 * @fontSize;
	// 			}
	// 		}
	// 	}
	// }
	.hots {
		background: #fff;
		margin-top: 20 * @fontSize;
		padding: 0;
		.title {
			padding: 0 20 * @fontSize;
			padding-top: 20 * @fontSize;
			.name {
				font-size: 32 * @fontSize;
				font-weight: 800;
				margin-left: 0;
				span {
					color: #ff9914;
					font-size: 32 * @fontSize;
					font-weight: 800;
				}
			}
		}
		.child-content {
			display: flex;
			flex-wrap: wrap;
			box-sizing: border-box;
			// flex: 1;
			// padding-left: 1%;
			justify-content: flex-start;
			// align-items: center;
		}
		.child {
			// width: 345*@fontSize;
			width: 48%;
			margin-left: 1%;
			margin-right: 1%;
			border: 1px solid #f4f4f4;
			// display: inline-block;
			// flex: 1;
			padding: 20 * @fontSize 20 * @fontSize 10 * @fontSize;
			box-sizing: border-box;
			text-align: center;
			// margin-left: 20*@fontSize;
			margin-top: 20 * @fontSize;
			.child-title {
				// font-size: 30*@fontSize;
				font-weight: bold;
				line-height: 1.3;
				color: #333;
				text-align: left;
				margin-top: 10 * @fontSize;
				margin-left: 5 * @fontSize;
				white-space: nowrap; /*强制在一行显示*/
				text-overflow: ellipsis; /*设置超出内容显示...*/
				overflow: hidden; /*一定不能少 超出的内容进行隐藏*/
			}
			.price {
				text-align: left;
				.orige {
					text-decoration: line-through;
					margin-right: 10 * @fontSize;
					color: #808080;
				}
				.group-price {
					color: #ed0c17;
					font-size: 32 * @fontSize;
					margin-right: 10 * @fontSize;
				}
			}
			img {
				height: 280 * @fontSize;
				// width: 280*@fontSize;
			}
			.foot {
				// margin-top: -6*@fontSize;
				font-size: 20 * @fontSize;
				color: #808080;
				display: flex;
				// align-items:center;
				justify-content: space-between;
				// span{
				//     display: block;
				// }
				.tuan {
					height: 50 * @fontSize;
					// margin-left: 10*@fontSize;
				}
			}
		}
	}
}
</style>
