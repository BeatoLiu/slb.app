import { RouteRecordRaw } from 'vue-router'
import { t } from '../hooks/setting/useI18n'

export const taoKeRoutes: Array<RouteRecordRaw> = [
    // 淘客訂單錄入
    {
        path: '/taoKe/memberCoupleOrder',
        name: 'MemberCoupleOrder',
        component: () => import('../views/taoKe/MemberCoupleOrder'),
        meta: {
            title: t('routes.memberCoupleOrder')
        }
    },
    // 淘客訂單列表
    {
        path: '/taoKe/order',
        name: 'ShowSelfTaoKeOrder',
        component: () => import('../views/taoKe/ShowSelfTaoKeOrder.vue'),
        children: [{
            path: ':status',
            name: 'ShowSelfTaoKeOrderList',
            component: () => import('../views/taoKe/components/SelfTaoKeOrderItem.vue'),
            meta: {
                title: t('routes.showSelfTaoKeOrder')
            }
        }]
    },
    // 我的算力
    {
        path: '/taoKe/incomePower',
        name: 'IncomePower',
        component: () => import('../views/taoKe/IncomePower.vue'),
        meta: {
            title: t('routes.incomePower')
        }
    },
    {
        path: '/taoKe/search',
        name: 'Search',
        component: () => import('../views/taoKe/Search.vue'),
        meta: {
            title: t('routes.search')
        }
    },
    {
        path: '/taoKe/searchGoods',
        name: 'SearchGoods',
        component: () => import('../views/taoKe/components/SearchHeader.vue'),
        // meta: {
        //     title: '搜索'
        // }
        children: [
            {
                path: 'tb',
                name: 'tb',
                component: () => import('../views/taoKe/taoBao/TBSearch.vue'),
                meta: {
                    title: t('taoKe.tb.plateName'),
                }
            },
            {
                path: 'jd',
                name: 'jd',
                component: () => import('../views/taoKe/jingDong/JDSearch.vue'),
                meta: {
                    title: t('taoKe.jd.plateName'),
                }
            },
            {
                path: 'pdd',
                name: 'pdd',
                component: () => import('../views/taoKe/pinDuoDuo/PDDSearch.vue'),
                meta: {
                    title: t('taoKe.pdd.plateName'),
                }
            },
            {
                path: 'wph',
                name: 'wph',
                component: () => import('../views/taoKe/weiPinHui/WPHSearch.vue'),
                meta: {
                    title: t('taoKe.others.wphName'),
                }
            }
        ]
    },
    {
        path: '/taoke/tb',
        name: 'TBIndex',
        component: () => import('../views/taoKe/taoBao/index.vue'),
        meta: {
            title: t('taoKe.tb.plateName'),
        }
    },
    {
        path: '/taoke/jd',
        name: 'JDIndex',
        component: () => import('../views/taoKe/jingDong/index.vue'),
        meta: {
            title: t('taoKe.jd.plateName'),
        }
    },
    {
        path: '/taoke/pdd',
        name: 'PDDIndex',
        component: () => import('../views/taoKe/pinDuoDuo/index.vue'),
        meta: {
            title: t('taoKe.pdd.plateName'),
        }
    },
    {
        path: '/taoke/wph',
        name: 'WPHIndex',
        component: () => import('../views/taoKe/weiPinHui/index.vue'),
        meta: {
            title: t('taoKe.others.wphName'),

        }
    },
    {
        path: '/taoke/jd/gridList',
        name: 'JDGridList',
        component: () => import('../views/taoKe/jingDong/GridGoodsList.vue'),
        meta: {
            title: t('taoKe.jd.plateName')
        }
    },
    {
        path: '/taoke/tb/gridList',
        name: 'TBGridList',
        component: () => import('../views/taoKe/taoBao/GridGoodsList.vue'),
        meta: {
            title: t('taoKe.tb.plateName')
        }
    },
    {
        path: '/taoke/wph/gridList',
        name: 'WPHGridList',
        component: () => import('../views/taoKe/weiPinHui/GridGoodsList.vue'),
        meta: {
            title: t('taoKe.others.wphName')
        }
    }
]