import { RouteRecordRaw } from 'vue-router'
import Home from "../views/Home.vue"
import { Footer } from '@/components/Footer'
import { t } from '../hooks/setting/useI18n'
import { slbRoutes } from './slbRoutes'
import { taoKeRoutes } from './taoKeRoutes'
import { mxRoutes } from './mxRoutes'
import { mineRoutes } from './mineRoutes'
import { tAARoutes } from './tAARoutes'
import { settingsRoutes } from './settingsRoutes'
import { jdRoutes } from './jdRoutes'


const baseRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/Login.vue'),
        meta: {
            title: t('routes.login')
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/login/Register.vue'),
        meta: {
            title: t('routes.register')
        }
    },
    {
        path: '/findPWD',
        name: 'FindPWD',
        component: () => import('../views/login/FindPWD.vue'),
        meta: {
            title: t('routes.findPWD')
        }
    },
    {
        path: '/payResult',
        name: 'PayResult',
        component: () => import('../views/result/PayResult'),
        meta: {
            title: t('routes.payResult')
        }
    },
    // 链上交易结果页面
    {
        path: '/chainPayResult',
        name: 'ChainPayResult',
        component: () => import('../views/result/ChainPayResult'),
        meta: {
            title: t('routes.payResult')
        }
    },
    // 扫码结果页面
    {
        path: '/scanRes',
        name: 'ScanRes',
        component: () => import('../views/result/ScanRes'),
        meta: {
            title: t('routes.scanRes')
        }
    },
    {
        path: '/',
        // name: 'footer',
        component: Footer,
        children: [
            {
                path: '/',
                name: 'Home',
                component: Home,
                meta: {
                    title: t('routes.home'),
                    keepAlive: true
                }
            },
            {
                path: '/mine',
                name: 'Mine',
                component: () => import('../views/mine/index.vue'),
                meta: {
                    title: t('routes.mine')
                }
            },
            // 數聯寶
            {
                path: '/slb',
                name: 'Slb',
                component: () => import('../views/slb/index.vue'),
                meta: {
                    title: t('routes.slb')
                }
            },
            // 秘選首頁
            {
                path: '/mxMall',
                name: 'MxMall',
                component: () => import('../views/mxMall/index.vue'),
                meta: {
                    title: t('routes.mxMall')
                }
            },

            {
                path: '/taoKe/preferential',
                name: 'TBPreferential',
                component: () => import('../views/taoKe/taoBao/TBPreferential.vue'),
                meta: {
                    title: t('taoKe.tb.preferential')
                }
            }
        ]
    },




    // {
    //     path: "/about",
    //     name: "About",
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () =>
    //         import(/* webpackChunkName: "about" */ "../views/About.vue"),
    // },
]


export default [
    ...baseRoutes,
    ...slbRoutes,
    ...mxRoutes,
    ...mineRoutes,
    ...taoKeRoutes,
    ...tAARoutes,
    ...settingsRoutes,
    ...jdRoutes
]
