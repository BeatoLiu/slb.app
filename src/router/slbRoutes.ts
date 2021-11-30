import { RouteRecordRaw } from 'vue-router'
import { t } from '../hooks/setting/useI18n'

export const slbRoutes: Array<RouteRecordRaw> = [
    // 數點兌換
    {
        path: '/slb/payForSUSD',
        name: 'PayForSUSD',
        component: () => import('../views/slb/PayForSUSD/index.vue'),
        meta: {
            title: t('routes.payForSUSD')
        }
    },
    // 到店支付
    {
        path: '/slb/payForShop',
        name: 'PayForShop',
        component: () => import('../views/slb/payForShop/index.vue'),
        meta: {
            title: t('routes.payForShop')
        }
    },
    // 信用卡还款
    {
        path: '/slb/creditCard',
        name: 'CreditCard',
        component: () => import('../views/slb/creditCard'),
        meta: {
            title: t('routes.creditCard')
        }
    },
    // 添加/修改信用卡
    {
        path: '/slb/addCreditCard',
        name: 'AddCreditCard',
        component: () => import('../views/slb/creditCard/AddCreditCard'),
        meta: {
            title: t('routes.addCreditCard')
        }
    },
    {
        path: '/slb/payForCredit',
        name: 'PayForCredit',
        component: () => import('../views/slb/creditCard/PayForCredit'),
        meta: {
            title: t('routes.payForCredit')
        }
    },
    // 数联宝中，支付方式为银行卡转账的
    {
        path: '/slb/bankTrans',
        name: 'BankTrans',
        component: () => import('../components/BankTransNav'),
        children: [
            {
                path: 'SUSD',
                name: 'BankTransOrderSUSD',
                component: () => import("../views/slb/PayForSUSD/BankTransOrder.vue"),
                meta: {
                    title: 'routes.bankTrans',
                }
            },
            {
                path: 'yiDuoBao',
                name: 'BankTransOrderYDB',
                component: () => import("../views/slb/YiDuoBao/BankTransOrder.vue"),
                meta: {
                    title: 'routes.bankTrans',
                }
            }
        ]
    },
    // 溢多寶
    {
        path: '/slb/yiDuoBao',
        name: 'YiDuoBao',
        component: () => import('../views/slb/YiDuoBao/index.vue'),
        meta: {
            title: t('routes.yiDuoBao')
        }
    },
    // 溢多寶支付
    {
        path: '/slb/yiDuoBao/payForYDB',
        name: 'PayForYDB',
        component: () => import('../views/slb/YiDuoBao/PayForYDB.vue'),
        meta: {
            title: t('routes.payForYDB')
        }
    },
    // 下载
    {
        path: '/slb/download',
        name: 'Download',
        component: () => import('../views/slb/download/index.vue'),
        meta: {
            title: t('routes.download')
        }
    },
    // 数联宝下载
    {
        path: '/slb/download/slb',
        name: 'DownloadSLB',
        component: () => import('../views/slb/download/SlbDownload.vue'),
        meta: {
            title: t('routes.downloadSLB')
        }
    }
]