import { RouteRecordRaw } from 'vue-router'
import { t } from '../hooks/setting/useI18n'

export const mxRoutes: Array<RouteRecordRaw> = [
	// 秘選首頁
	// {
	//     path: '/mxMall/index',
	//     name: 'MxMall',
	//     component: () => import('../views/mxMall/index.vue'),
	//     meta: {
	//         title: t('routes.mxMall')
	//     }
	// },
	// 搜索
	{
		path: '/mxMall/goodsSearch',
		name: 'GoodsSearch',
		component: () => import('../views/mxMall/GoodsSearch.vue'),
		meta: {
			title: t('routes.goodsSearch')
		}
	},
	// 分类
	{
		path: '/mxMall/goodsCategory',
		name: 'GoodsCategory',
		component: () => import('../views/mxMall/GoodsCategory.vue'),
		meta: {
			title: t('routes.goodsCategory')
		}
	},
	// 商品詳情
	{
		path: '/mxMall/goodsDetail',
		name: 'GoodsDetail',
		component: () => import('../views/mxMall/GoodsDetail.vue'),
		meta: {
			title: t('routes.goodsDetail')
		}
	},
	// 提交订单
	{
		path: '/mxMall/goodsSubmit',
		name: 'GoodsSubmit',
		component: () => import('../views/mxMall/GoodsSubmit.vue'),
		meta: {
			title: t('routes.goodsSubmit')
		}
	},
	// 秘選訂單
	{
		path: '/mxMall/myOrder',
		name: 'MyOrder',
		component: () => import('../views/mxMall/MyOrder.vue'),
		meta: {
			title: t('routes.myOrder')
		}
	},
	// 訂單詳情
	{
		path: '/mxMall/myOrderDetail',
		name: 'MyOrderDetail',
		component: () => import('../views/mxMall/MyOrderDetail.vue'),
		meta: {
			title: t('routes.myOrderDetail')
		}
	},
	// 申請退款
	{
		path: '/mxMall/refund',
		name: 'Refund',
		component: () => import('../views/mxMall/Refund.vue'),
		meta: {
			title: t('routes.refund')
		}
	},
	// 秘選支付結果
	{
		path: '/mxMall/payResult',
		name: 'MxPayResult',
		component: () => import('../views/mxMall/PayResult.vue'),
		meta: {
			title: t('routes.payResult')
		}
	}
]
