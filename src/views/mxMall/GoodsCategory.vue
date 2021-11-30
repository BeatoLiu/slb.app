<template>
	<div class="class">
		<div class="search">
			<Search
				v-model="proName"
				show-action
				shape="round"
				placeholder="输入您要搜索的产品或口令"
				@fontSizeearch="onSearch"
			>
				<template #action>
					<div @click="onSearch">搜索</div>
				</template>
			</Search>
		</div>
		<div class="class-content">
			<div class="left">
				<div
					class="item"
					:class="{ active: active == item.ccCode }"
					v-for="item in classList"
					:key="item.ccCode"
					@click="chooseItem(item)"
				>
					<div class="active-img flex-start">
						<img src="../../assets/img/title-left.png" alt="" v-if="active == item.ccCode" />
					</div>
					<p>{{ item.ccName }}</p>
				</div>
			</div>
			<div class="list">
				<!-- <div class="list-banner">
					<img src="../../assets/img/class.png" alt="" />
				</div> -->
				<PullRefresh v-model="refreshing" @refresh="onRefresh">
					<div>
						<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
							<div class="item" v-for="item in dataList" :key="item.cCode" @click="toFood(item.cCode)">
								<img :src="imgPath(item.cPicName)" alt="" />
								<div class="info">
									<div class="title">{{ item.cName }}</div>
									<div class="desc flex-space">
										<!-- <p>预返{{ item.taaPrice }} TAA</p> -->
										<TAAPrice :mCode="item.mCode" :price="item.cPrice" />
										<p>已售{{ item.cTotalAmount }}</p>
									</div>
									<div class="pro-price flex-space">
										<span class="price">{{ item.cPrice }}</span>
										<div>
											<Icon name="shopping-cart-o" color="#1989fa" />
										</div>
									</div>
								</div>
							</div>
						</List>
					</div>
				</PullRefresh>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { List, PullRefresh, Search, Icon } from 'vant'
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { showCommodityClassFilterItem } from '../../apis/model/mxModel'
import { showCommodityClassFilter } from '../../apis/mx'
import { useGoodsList } from '../../hooks/mx/useGoodsList'
import { useImgPath } from '../../hooks/mx/useImgPath'

import TAAPrice from './components/TAAPrice.vue'

export default defineComponent({
	name: 'GoodsCategory-alive',
	components: {
		List,
		PullRefresh,
		Search,
		Icon,
		TAAPrice
	},
	setup() {
		const { push } = useRouter()
		const { imgPath } = useImgPath()

		const data = reactive({
			// classList: [], //类列表
			active: 0,
			params: {
				pageNum: 0,
				pageSize: 10,
				cAuditStatus: 1,
				ccRelation: ''
			},
			proName: ''
			// count: 0
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = useGoodsList(data.params)

		const classList = ref<showCommodityClassFilterItem[]>([]) //类列表

		const getClass = () => {
			const params = {
				ccType: 3
			}
			showCommodityClassFilter(params).then(res => {
				if (res.resultCode == 1) {
					classList.value = res.data
					data.active = res.data[0].ccCode
					data.params.ccRelation = res.data[0].ccRelation
				}
			})
		}

		const chooseItem = (item: showCommodityClassFilterItem) => {
			data.active = item.ccCode
			data.params.ccRelation = item.ccRelation
			onRefresh()
		}
		const toFood = (code: number) => {
			push({ name: 'GoodsDetail', query: { cCode: code } })
		}
		const onSearch = () => {
			if (data.proName) push({ name: 'GoodsSearch', query: { proName: data.proName } })
		}

		// onCre(() => {
		getClass()
		// })
		return {
			...toRefs(data),
			classList,
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			chooseItem,
			toFood,
			onSearch,
			imgPath
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.class {
	.class-content {
		display: flex;
		align-items: flex-start;
	}
	.left {
		width: 186 * @fontSize;
		height: calc(100vh - 144px);
		overflow: auto;
		.item {
			border-top: 1px solid #f0f0f0;
			text-align: center;
			line-height: 95 * @fontSize;
		}
		.active {
			background: #fff;
			position: relative;
			.active-img {
				position: absolute;
				left: 20 * @fontSize;
				top: 0;
				bottom: 0;
			}
			img {
				width: 8 * @fontSize;
				height: 40 * @fontSize;
				// margin-right: 20*@fontSize;

				// height: 40*@fontSize;
			}
		}
	}

	.list {
		background: #fff;
		padding-bottom: 30 * @fontSize;
		// padding:0 20*@fontSize;
		flex: 1;
		height: calc(100vh - 144px);
		overflow: auto;
		box-sizing: border-box;
		.list-banner {
			border-top: 1px solid #f0f0f0;
			border-bottom: 1px solid #f0f0f0;
			padding: 20 * @fontSize;
		}
		.item {
			padding: 20 * @fontSize;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #f0f0f0;
			img {
				width: 160 * @fontSize;
				height: 160 * @fontSize;
			}
			.info {
				display: inline-block;
				margin-left: 20 * @fontSize;
				width: calc(100% - 160 * @fontSize);
				.title {
					font-size: 24 * @fontSize;
					// line-height: 1.5;
					// font-weight: bold;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.desc {
					color: #999;
					margin-top: 10 * @fontSize;
					font-size: 24 * @fontSize;
					margin-bottom: 10 * @fontSize;
					p:nth-child(1) {
						color: #ff0000;
					}
				}
				.ori-price {
					font-size: 28 * @fontSize;
					margin-right: 10 * @fontSize;
					text-decoration: line-through;
				}
				.pro-price {
					margin-top: 10 * @fontSize;
					& > div {
						width: 40 * @fontSize;
						height: 40 * @fontSize;
						img {
							width: 100%;
							height: 100%;
						}
					}
				}
				.price {
					color: #ff0700;
					font-size: 30 * @fontSize;
					font-weight: Bold;
					&::before {
						display: inline-block;
						content: '￥';
						font-size: 24 * @fontSize;
					}
				}
			}
		}
	}
}
</style>
