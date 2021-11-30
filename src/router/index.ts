import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteLocationNormalized } from 'vue-router'
import routes from './routes'
export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const LOGIN_PAGE_NAME = 'Login'
const HOME_PAGE = 'Home'

const whiteList = ['Login', 'FindPWD', 'Register'] // no redirect whitelist



router.beforeEach((to: RouteLocationNormalized, from, next) => {

    const token = window.localStorage.token
    const userInfo = window.localStorage.userInfo

    if (token && userInfo) {
        if (to.name === LOGIN_PAGE_NAME) {
            next({
                name: HOME_PAGE // 跳转到homeName页
            })
        } else {
            next()
        }
    } else {
        if (whiteList.includes(to.name as string)) {
            next()
        } else {
            next({
                name: LOGIN_PAGE_NAME // 跳转到登录页
            })
        }
    }
})

export const setupRouter = (app: App) => {
    app.use(router)
}
