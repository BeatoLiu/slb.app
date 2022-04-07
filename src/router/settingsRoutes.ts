import { RouteRecordRaw } from 'vue-router'
import { t } from '@/hooks/setting/useI18n'

export const settingsRoutes: Array<RouteRecordRaw> = [
	// 设置
	{
		path: '/settings',
		name: 'Settings',
		component: () => import('../views/settings'),
		meta: {
			title: t('routes.settings')
		}
	}
]
