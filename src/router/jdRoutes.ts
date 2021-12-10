import { RouteRecordRaw } from 'vue-router'
import { t } from '../hooks/setting/useI18n'

export const jdRoutes: Array<RouteRecordRaw> = [
    // 京东首页
    {
        path: '/jd',
        name: 'Jd',
        component: () => import('../views/jd'),
        meta: {
            title: t('taoKe.jd.plateName')
        }
    }
]
