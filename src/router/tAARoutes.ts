import { RouteRecordRaw } from 'vue-router'
import { t } from '../hooks/setting/useI18n'

export const tAARoutes: Array<RouteRecordRaw> = [

    {
        path: '/TAA/index',
        name: 'TAAIndex',
        component: () => import('../views/tAA/index.vue'),
        meta: {
            title: t('routes.tAAIndex')
        }
    },
    // taa錢包地址錄入
    {
        path: '/TAA/updateWallet',
        name: 'UpdateWallet',
        component: () => import('../views/tAA/UpdateWallet.vue'),
        meta: {
            title: t('routes.updateWallet')
        }
    },
    // 訂單列表
    {
        path: '/TAA/orderList',
        name: 'TAAOrderList',
        component: () => import('../views/tAA/OrderList.vue'),
        meta: {
            title: t('routes.tAAOrderList')
        }
    },
    // 解鎖列表
    {
        path: '/TAA/availableTokenList',
        name: 'AvailableTokenList',
        component: () => import('../views/tAA/AvailableTokenList.vue'),
        meta: {
            title: t('routes.availableTokenList')
        }
    },
    // 提幣列表
    {
        path: '/TAA/takenTokenList',
        name: 'TakenTokenList',
        component: () => import('../views/tAA/TakenTokenList.vue'),
        meta: {
            title: t('routes.takenTokenList')
        }
    },
    // 提幣
    {
        path: '/TAA/withdrawalTaa',
        name: 'WithdrawalTaa',
        component: () => import('../views/tAA/WithdrawalTaa.vue'),
        meta: {
            title: t('routes.withdrawalTaa')
        }
    },
    // 幫助
    {
        path: '/TAA/help',
        name: 'Help',
        component: () => import('../views/tAA/Help.vue'),
        meta: {
            title: t('routes.help')
        }
    },
]