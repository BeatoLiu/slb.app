<template>
	<div class="food">
		<img :src="cPicName" alt="" class="main-img" />
		<div class="cont">
			<div class="title"><span v-if="hasPattern">【超级拼团】</span>{{ name }}</div>
			<div class="tip" v-if="hasPattern">
				团购件数满 <span>{{ low }}</span> 件，按照团购价正常发货
			</div>
			<div class="price flex-space" v-if="disPrice">
				<p>
					￥<span>{{ disPrice }}</span> <span class="discount" v-if="hasPattern">拼团价</span>
				</p>
				<p>预返{{ sePower }} TAA</p>
			</div>
			<!-- <div class="price" v-if="!disPrice && merCode == 0">￥<span>{{cPrice}}</span> </div>
            <div class="price" v-if="!disPrice && merCode > 0">￥<span>{{cWholesalePrice}}</span> (店主) </div>
            <div class="ori-price" v-if="disPrice || merCode > 0">原价 <span>￥{{cWholesalePrice}}</span> </div> -->
			<div class="ori-price">
				原价 <span>￥{{ cWholesalePrice }}</span>
			</div>

			<div class="freight flex-space">
				<p>销售量：{{ cTotalAmount }}</p>
				<p>库存：{{ cStockAmount }}</p>
			</div>
			<div class="ok">保证产地 保证质量 质量赔付</div>
		</div>
		<div v-if="gpoList && gpoList.length">
			<div class="group">
				<div class="title">以下小伙伴正在发起拼团，你可以直接参加</div>
				<div class="item" v-for="item in gpoList" :key="item.gpoCode">
					<!-- <img :src="item.memWxHeadImgUrl" alt=""> -->
					<img src="../../assets/img/tuan.png" alt="" />
					<div class="info">
						<div class="name">{{ item.memWxNickName }}</div>
						<div class="desc" v-if="low > item.gpoValidCount">
							还差<span>{{ low - item.gpoValidCount }}</span
							>件成团,价格{{ disPrice }}元
						</div>
						<div class="desc" v-if="low <= item.gpoValidCount">已成团({{ item.gpoValidCount }}人)</div>
					</div>
					<div class="btn" @click="joinGroup(item)">去拼团</div>
				</div>
			</div>
			<div class="group-foot">按照团购价支付开团<span @click="showRule = true">玩法详情&#155;&#155;</span></div>
		</div>

		<!-- <Eval></Eval> -->
		<div class="pro-detail">
			<div class="pro-detail-title">商品详情</div>
			<div class="pro-detail-list" v-for="item in cSpuCollection" :key="item.pcCode">
				<div class="name">{{ item.pcName }}</div>
				<div class="val" v-for="ele in item.params" :key="ele.pcdSubCode">
					<span v-if="item.pcSourceType === 1 || item.pcSourceType === 2">{{ ele.pcdSubName }}</span>
					<span v-if="item.pcSourceType === 0 || item.pcSourceType === 3">{{ ele.input }}</span>
					<span v-if="item.pcSourceType === 4 || item.pcSourceType === 5"
						>{{ ele.input }} {{ ele.pcdSubName }}</span
					>
				</div>
			</div>
		</div>
		<div class="detail-img">
			<img :src="item.utPath" alt="" v-for="item in cDetailPic" :key="item.utCode" />
		</div>
		<div class="foot">
			<div class="open-group" @click="openGroup" v-if="hasPattern">开团</div>
			<div class="alone" @click="buyAlone">￥{{ cPrice }}单买</div>
		</div>

		<Popup v-model:show="show" round closeable position="bottom" class="van-sku-container" safe-area-inset-bottom>
			<template #default>
				<Sku
					:sku="sku"
					:goods="goods"
					:quota="quota"
					:show-add-cart-btn="false"
					:goods-id="cCode"
					:hide-stock="sku.hide_stock"
					@buy-clicked="onBuyClicked"
				/>
			</template>
		</Popup>

		<Popup v-model:show="showRule" round closeable :style="{ width: '90%' }">
			<div class="rule">
				<p>拼团规则：</p>
				<p>
					1、团购件数满 <span>{{ low }}</span> 件，按照团购价正常发货
				</p>
				<p>
					2、倒计时结束后，团购件数不够 <span>{{ low }}</span> 件则订单作废
				</p>
				<!-- <p>3、团购件数满 <span>{{low}}</span> 件后，进入冲刺阶段，团购件数满 <span>{{lowTwo}}</span> 件后，有返利</p> -->
				<!-- <p>4、倒计时结束后，团购件数满 <span>{{low}}</span> 件不足 <span>{{lowTwo}}</span> 件，则参团人员全部按照团购价进行发货，无返利</p> -->
				<div class="rule-tip">注：倒计时结束后，此单拼团结束。</div>
			</div>
		</Popup>
		<div class="share" id="logNumber" :data-clipboard-text="shareCode" @click="copyWaybillNo">
			<div>
				<Icon name="share-o" />
			</div>
			<div>分享</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { Popup, Icon, Dialog, Toast } from 'vant'
import Clipboard from 'clipboard'
import { Base64 } from 'js-base64'
import { useRouter } from 'vue-router' // from '../../components/Sku'
import { ICDetailPicItem, ICsbListItem, IPrdCsSkuCollectionItem } from '@/apis/model/mxModel'
import { getEcTaaCalcPower, showCommodityDetail } from '@/apis/mx'
import { useImgPath } from '@/hooks/mx/useImgPath'
import { SkuData } from './types/sku'
import { useStore } from '@/store'
const Sku = defineAsyncComponent(() => import('../../components/Sku'))

interface baseMode {
	[key: string]: any
}
export default defineComponent({
	name: 'goodsDetail',
	components: {
		Popup,
		Icon,
		Sku
	},
	setup() {
		const { push, currentRoute } = useRouter()
		const { imgPath } = useImgPath()
		const store = useStore()

		const data = reactive({
			show: false, // 显示商品规格选择
			cPicName: '', // 商品头像
			mCode: 0, // 商家Id
			mName: '',
			cCode: '', // 产品编号
			cPrice: '', // 售卖价
			cWholesalePrice: '', // 原价
			disPrice: '', // 折扣价
			cTotalAmount: 0, // 销售量
			// csbList: [], //产品信息
			gpoList: [], // 拼团信息
			pwdGpoCode: '', // 从口令而来的团编号
			// cDetailPic: [], //图片详情
			// cSpuCollection: [], //商品详情
			poGroupType: 1, // 开团类型  0： 单买，1：开团
			dis: 10,
			proCode: 0, // 模板开团code
			hasPattern: false, // 是否有团购配置
			cStockAmount: 0, // 库存
			shareCode: '', // 分享口令
			cRecPayType: '', // 接受的支付方式
			sePower: '', // 算力
			name: '', // 标题
			showRule: false, // 显示玩法详情
			low: 1, // 最低人数开团
			lowTwo: 1, // 反红包最低人数
			quota: 0, // 限购数

			goods: {
				// 商品标题
				title: '商品',
				// 默认商品 sku 缩略图
				picture: ''
			}
			// shareCode: '', // 分享口令
		})
		const cDetailPic = ref<ICDetailPicItem[]>([])
		const cSpuCollection = ref<IPrdCsSkuCollectionItem[]>([])
		const csbList = ref<ICsbListItem[]>([])
		const sku = reactive<SkuData>({
			// 数据结构见下方文档
			tree: [
				{
					k: '',
					v: [
						{
							id: '',
							name: '',
							imgUrl: '',
							img_url: '',
							previewImgUrl: ''
						}
					],
					k_s: ''
				}
			],
			// 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
			list: [
				{
					id: 0,
					s1: '',
					s2: '',
					s3: '',
					price: 0,
					stock_num: 0
				}
			],
			price: '1.00', // 默认价格（单位元）
			stock_num: 227, // 商品总库存
			none_sku: false, // 是否无规格商品
			hide_stock: false, // 是否隐藏剩余库存
			collection_id: 0
		})
		// 商品详情
		const getDetail = () => {
			showCommodityDetail({ cCode: data.cCode }).then(res => {
				if (res.resultCode === 1) {
					data.name = res.data.cName
					data.cPicName = imgPath(res.data.cPicName)
					data.goods.picture = data.cPicName
					data.goods.title = data.name
					data.cTotalAmount = res.data.cTotalAmount
					cDetailPic.value = res.data.cDetailPic || []
					cSpuCollection.value = res.data.cSpuCollection || []
					data.cPrice = Number(res.data.cUnitPrice).toFixed(2)
					data.cWholesalePrice = Number(res.data.cWholesalePrice).toFixed(2)
					data.disPrice = Number(res.data.cPrice).toFixed(2) // 现在直接取后端的值
					data.cRecPayType = res.data.cRecPayType
					data.cStockAmount = res.data.cStockAmount
					// let pcPattern = ''
					// if (res.data.pbList && res.data.pbList.length != 0) {
					// 	data.hasPattern = true
					// 	pcPattern = res.data.pbList[0].pcParam //折扣模板
					// 	data.low = pcPattern.split(',')[0].split(':')[1]
					// 	data.dis = pcPattern.split(',')[1].split(':')[1]
					// 	data.lowTwo = pcPattern.split(',')[2].split(':')[1]
					// 	// data.disPrice = (data.dis*data.cPrice/10).toFixed(2)
					// 	data.proCode = res.data.pbList[0].proCode
					// }
					csbList.value = res.data.csbList
					// console.log(csbList.value)
					data.mCode = res.data.mCode
					data.mName = res.data.mName
					// if (data.pwdGpoCode) {
					// 	// 如果有团编号
					// 	data.gpoList = res.data.gpoList.filter(item => item.gpoCode === +data.pwdGpoCode)
					// } else {
					// 	data.gpoList = res.data.gpoList
					// }
					// if (data.gpoList && data.gpoList.length != 0) {
					// 	data.gpoList.forEach(ele => {
					// 		ele.pcPattern = pcPattern
					// 	})
					// }
					if (cDetailPic.value && cDetailPic.value.length !== 0) {
						cDetailPic.value.forEach(ele => {
							ele.utPath = imgPath(ele.utPath)
						})
					}
					// 算力
					getEcTaaCalcPower({ mCode: +data.mCode, price: +data.disPrice }).then(result => {
						if (result.resultCode === 1) {
							// ele.sePower = result.data // 产品算力
							data.sePower = result.data
						}
					})
					// console.log(data.cDetailPic)
				}
			})
		}
		// 处理数据为有赞数据结构
		const getSku = () => {
			const dataArr: any[] = []
			// console.log(data.csbList)
			sku.list = []
			// console.log(data.csbList)
			csbList.value.forEach((ele: any) => {
				const obj: any = {
					id: ele.csCode, // skuId，下单时后端需要
					// data.poGroupType == 1 ? ele.csPrice*data.dis/10*100 : localStorage.merCode == 0 ? ele.csPrice * 100 : ele.csWholesalePrice * 100
					// price: data.poGroupType == 1 ? ele.csPrice*data.dis/10*100 : ele.csPrice * 100, // 价格（单位分）

					// !不是很清楚具体用哪个字段了，先用下面这个ele.csWholesalePrice * 100
					price: data.poGroupType === 1 ? ele.csPrice1 * 100 : ele.csPrice1 * 100, // 价格（单位分）现在折扣价由后端给
					// price:
					stock_num: ele.csStockAmount // 当前 sku 组合对应的库存
				}
				// data.sku.price = obj.price/100
				sku.price = data.poGroupType === 1 ? data.disPrice : data.cPrice
				sku.stock_num = ele.csStockAmount
				ele.csSkuCollection.forEach((mapItem: any) => {
					obj[mapItem.pcName] = mapItem.params[0].pcdSubName
					// dataArr.push({ k: mapItem.pcName,k_s: mapItem.pcName, v: [mapItem.params[0]]})
					// console.log(dataArr.length)
					if (dataArr.length === 0) {
						dataArr.push({ k: mapItem.pcName, k_s: mapItem.pcName, v: [mapItem.params[0]] })
					} else {
						const res = dataArr.some((item: any) => {
							// 判断相同日期，有就添加到当前项
							if (item.k === mapItem.pcName) {
								item.v.forEach((v: any) => {
									if (v.pcdSubName !== mapItem.params[0].pcdSubName) {
										//  imgUrl: imgPath(ele.csPicName)
										item.v.push({ ...mapItem.params[0] })
									}
								})
								return true
							}
							return false
						})

						if (!res) {
							// 如果没找相同日期添加一个新对象
							dataArr.push({ k: mapItem.pcName, k_s: mapItem.pcName, v: [mapItem.params[0]] })
						}
					}
				})
				sku.list.push(obj)
			})
			dataArr.forEach(ele => {
				const arr: any[] = []
				const obj: baseMode = {}
				ele.v.forEach((e: any) => {
					e.id = e.pcdSubName
					e.name = e.pcdSubName
					obj[e.pcdSubName] = e
				})
				// console.log(obj)
				for (const item in obj) {
					arr.push(obj[item])
				}
				ele.v = arr
			})
			// console.log(dataArr)
			sku.tree = dataArr
			// console.log(sku)
		}
		// 单买
		const buyAlone = () => {
			// Toast('暂不开放此功能！')
			// console.log(111)
			getSku()
			data.poGroupType = 0
			data.show = true
		}
		// 开团
		const openGroup = () => {
			data.show = true
			data.poGroupType = 1
			getSku()
			// console.log(data.sku)
		}
		// 参团
		const joinGroup = (item: any) => {
			item.name = data.name
			item.cPrice = data.cPrice
			item.disPrice = data.disPrice
			item.csbList = csbList.value
			item.mCode = data.mCode
			item.cPicName = data.cPicName
			item.cCode = data.cCode
			item.cRecPayType = data.cRecPayType
			push({ name: 'GroupDetail', query: { ...item } })
		}

		const submitOrder = (obj: any) => {
			const poPayFactSum =
				data.poGroupType === 1
					? (obj.csWholesalePrice * obj.buyNum).toFixed(2)
					: (obj.csPrice1 * obj.buyNum).toFixed(2)
			data.show = false
			const params = {
				memSecretOpenid: localStorage.openId,
				cRecPayType: data.cRecPayType,
				name: data.name,
				mName: data.mName,
				className: obj.connectName,
				dis: data.dis,
				cPicName: data.cPicName,
				poGroupType: data.poGroupType,
				poMCode: localStorage.merCode, // 店主merCode
				poPaySum: poPayFactSum,
				poPayFactSum: poPayFactSum,
				poCount: obj.buyNum,
				poType: 0, // 0销售，1退货
				gpoType: 1, // 1：团长  0：团员
				gpoCode: 0, // 开团code
				proCode: data.proCode,
				poAttach: {
					daCode: '',
					gpoType: 1, // 1：团长  0：团员
					gpoCode: 0, // 开团code
					proCode: data.proCode
				},
				orderList: [
					{
						podList: [
							{
								prdCsCode: obj.csCode,
								prdPrice: obj.csPrice1.toFixed(2),
								prdCount: obj.buyNum,
								prdSum: poPayFactSum,
								// prdFactSum: (obj.csPrice * obj.buyNum * data.dis /10).toFixed(2)
								prdFactSum: poPayFactSum
							}
						],
						// oPayFactSum: (obj.csPrice * obj.buyNum * data.dis /10).toFixed(2),
						oPaySum: poPayFactSum,
						oPayFactSum: poPayFactSum,
						mCode: data.mCode,
						oCount: obj.buyNum
					}
				],
				detailList: [
					{
						prdCCode: obj.cCode,
						prdCsCode: obj.csCode,
						prdPrice: obj.csPrice1.toFixed(2),
						prdCount: obj.buyNum,
						prdSum: poPayFactSum,
						// prdFactSum: (obj.csPrice * obj.buyNum * data.dis /10).toFixed(2)
						prdFactSum: poPayFactSum,
						prdCName: data.name
					}
				]
			}
			// console.log(parms)
			store.dispatch('user/buyProduct', params)
			push({ name: 'GoodsSubmit' })
		}

		const onBuyClicked = (data: any) => {
			console.log(data)
			data.show = false
			const id = data.selectedSkuComb.id
			// console.log(data.csbList)
			csbList.value.forEach((ele: any) => {
				if (ele.csCode === id) {
					ele.buyNum = data.selectedNum
					ele.connectName = ''
					ele.csSkuCollection.forEach((item: any) => {
						ele.connectName += item.params[0].pcdSubName + ' '
					})
					// debugger
					submitOrder(ele)
				}
			})
		}

		const copyWaybillNo = () => {
			const clipboard = new Clipboard('#logNumber')
			// console.log(clipboard)
			clipboard.on('success', function (e) {
				Dialog.alert({
					title: '口令复制成功',
					message: '在秘选商城中输入口令，即可搜索商品'
				})
				clipboard.destroy()
			})
			clipboard.on('error', function (e) {
				Toast('您的浏览器不支持点击复制')
				clipboard.destroy()
			})
		}

		onMounted(() => {
			data.cCode = currentRoute.value.query.cCode as string
			data.pwdGpoCode = currentRoute.value.query.gpoCode as string
			const codeStr = 'p_' + data.cCode
			const codeBase = Base64.encode(codeStr)
			// console.log(codeBase)
			data.shareCode = '￥' + codeBase + '￥'
			getDetail()
		})
		return {
			...toRefs(data),
			cDetailPic,
			cSpuCollection,
			sku,
			buyAlone,
			openGroup,
			joinGroup,
			onBuyClicked,
			copyWaybillNo
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.food {
	padding-bottom: 100 * @fontSize;
	.main-img {
		width: 750 * @fontSize;
	}
	.group-time {
		padding: 0 20 * @fontSize;
		color: #fff;
		font-size: 30 * @fontSize;
		line-height: 72 * @fontSize;
		background: #ed0c17;
		.time {
			float: right;
			font-size: 24 * @fontSize;
		}
	}
	.cont {
		padding: 0 20 * @fontSize;
		background: #fff;
		.title {
			padding-top: 20 * @fontSize;
			color: #4d4d4d;
			font-size: 30 * @fontSize;
		}
		.tip {
			margin-top: 10 * @fontSize;
			color: #808080;
			font-size: 24 * @fontSize;
			line-height: 1;
		}
		.price {
			display: flex;
			align-items: center;
			margin-top: 30 * @fontSize;
			color: #4d4d4d;
			font-weight: bold;
			span {
				font-size: 36 * @fontSize;
			}
			.discount {
				margin-left: 40 * @fontSize;
				padding: 0 8 * @fontSize;
				color: #ed0c17;
				font-weight: normal;
				font-size: 24 * @fontSize;
				border: 3 * @fontSize solid #ed0c17;
				border-radius: 5 * @fontSize;
			}
		}
		.ori-price {
			margin-top: 26 * @fontSize;
			padding-bottom: 40 * @fontSize;
			color: #808080;
			line-height: 1;
			border-bottom: 1px solid #e6e6e6;
			span {
				margin-left: 5 * @fontSize;
				text-decoration: line-through;
			}
		}
		.freight {
			margin-top: 20 * @fontSize;
			color: #808080;
			font-size: 24 * @fontSize;
			line-height: 1;
			span {
				margin-left: 110 * @fontSize;
			}
		}
		.ok {
			padding: 40 * @fontSize 0 20 * @fontSize;
			color: #ed0c17;
			font-size: 24 * @fontSize;
			line-height: 1;
		}
	}

	.group {
		margin-top: 20 * @fontSize;
		padding: 20 * @fontSize 20 * @fontSize 0;
		background: #fff;
		.title {
			color: #333;
		}
		.item {
			display: flex;
			align-items: center;
			margin-top: 30 * @fontSize;
			img {
				width: 57 * @fontSize;
			}
			.info {
				flex: 1;
				margin-left: 30 * @fontSize;
				font-size: 20 * @fontSize;
				.desc {
					color: #808080;
					span {
						color: #ed0c17;
					}
				}
			}
			.btn {
				width: 109 * @fontSize;
				color: #ed0c17;
				line-height: 60 * @fontSize;
				text-align: center;
				border: 3 * @fontSize solid #ed0c17;
				border-radius: 5 * @fontSize;
			}
			&:last-child {
				padding-bottom: 20 * @fontSize;
				border-bottom: 1px solid #e6e6e6;
			}
		}
	}
	.group-foot {
		padding: 0 20 * @fontSize;
		overflow: hidden;
		color: #4d4d4d;
		font-size: 24 * @fontSize;
		line-height: 68 * @fontSize;
		background: #fff;
		span {
			float: right;
			color: #808080;
		}
	}
	.pro-detail {
		margin-top: 20 * @fontSize;
		padding: 0 20 * @fontSize;
		background: #fff;
		&-title {
			padding: 20 * @fontSize 0;
			font-weight: bold;
			font-size: 30 * @fontSize;
		}
		&-list {
			display: flex;
			align-items: center;
			padding-bottom: 20 * @fontSize;
			.name {
				flex-shrink: 0;
				width: 220 * @fontSize;
				color: #808080;
			}
		}
	}
	.foot {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		background: #fff;
		box-shadow: 0 -3px 4px 0 rgba(49, 50, 50, 0.21);
		.service,
		.car {
			width: 126 * @fontSize;
			color: #808080;
			text-align: center;
			border-right: 1px solid #f7f7f7;
			img {
				width: 40 * @fontSize;
			}
			p {
				margin-top: 5 * @fontSize;
				font-size: 24 * @fontSize;
				line-height: 1;
			}
		}
		.alone,
		.open-group {
			flex: 1;
			color: #fff;
			font-size: 30 * @fontSize;
			line-height: 90 * @fontSize;
			text-align: center;
		}
		.alone {
			background: #fc8c28;
		}
		.open-group {
			background: #ed0c17;
		}
	}
	.detail-img {
		img {
			width: 750 * @fontSize;
		}
	}
	.fix-right {
		position: fixed;
		top: 50%;
		right: 45 * @fontSize;
		margin-top: -160 * @fontSize;
		.item {
			width: 80 * @fontSize;
			height: 80 * @fontSize;
			margin-top: 20 * @fontSize;
			text-align: center;
			background: #fff;
			border-radius: 40 * @fontSize;
			box-shadow: 0 1px 5px 0 rgba(49, 50, 50, 0.33);
		}
	}
	.rule {
		// margin-top: 40*@fontSize;
		padding: 30 * @fontSize 30 * @fontSize;
		font-size: 20 * @fontSize;
		span {
			color: #ed0c17;
			font-size: 24 * @fontSize;
		}
		.rule-tip {
			margin-top: 20 * @fontSize;
			color: #ed0c17;
			font-size: 18 * @fontSize;
		}
	}
	.share {
		position: fixed;
		right: 10px;
		bottom: 160px;
		width: 40px;
		height: 40px;
		text-align: center;
		background: #fff;
		border-radius: 50%;
		box-shadow: 0 0 2px #000;
		i {
			color: red;
			font-size: 20px;
		}
		div:nth-child(2) {
			margin-top: -10px;
		}
	}
}
</style>
