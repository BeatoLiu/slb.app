import { RouteRecordRaw } from 'vue-router'

export const slbPlusRoutes: Array<RouteRecordRaw> = [
	{
		path: '/slbPlus/mrJo',
		name: 'MrJo',
		component: () => import('../views/slbPlus/MrJo'),
		meta: {
			title: '乔老爷酒业'
		}
	},
	{
		path: '/slbPlus/huaYiTang',
		name: 'HuaYiTang',
		component: () => import('../views/slbPlus/HuaYiTang/index.vue'),
		meta: {
			title: '华一堂'
		}
	}
]
