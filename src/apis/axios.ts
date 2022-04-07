/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, Method } from 'axios'
import { stringify } from 'qs'
import { Toast } from 'vant'

import { hostName, payName } from '@/utils/config'
// import logoImg from '../assets/img/pay-logo.png'

// 接口配置项
interface configInter {
	// 是否要loading
	showLoading?: boolean
	// 接口地址
	type?: string
}

axios.defaults.timeout = 60000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

axios.defaults.withCredentials = true

// const token = localStorage.token
// console.log(token)
// axios.defaults.headers.common["token"] = token
// document.cookie = `token=${token}`
// console.log(document.cookie)

axios.defaults.baseURL = hostName

axios.interceptors.request.use(config => {
	// const token = localStorage.token
	config.headers.token = localStorage.token
	// document.cookie = `token=${token}`
	return config
})

// 返回状态判断(添加响应拦截器)
// axios.interceptors.response.use((res) => {
//     // if (res.data.resultCode > 0) {
//     //     return Promise.resolve(res.data)
//     // } else {
//     //     if (res.data.msg) {
//     //         Toast(res.data.msg)
//     //         return Promise.reject(res.data)
//     //     } else {
//     //         Toast('网络异常 ' + res.data.resultCode)
//     //         return Promise.reject({
//     //             msg: '网络异常 ' + res.data.resultCode
//     //         })
//     //     }
//     // }
//     // console.log(2)
//     return res.data
// }, (error) => {
//     // Toast('网络超时')
//     // return Promise.reject({
//     //     msg: '网络超时'
//     // })
//     return error
// })

const ajaxMain = <T = any>(method: Method, url: string, params: any, config: configInter): Promise<T> => {
	return new Promise((resolve, reject) => {
		// const notBodyMethod = ["GET", "DELETE"];

		const configObj: AxiosRequestConfig = {
			method,
			url
		}

		// if (notBodyMethod.indexOf(method) > -1) {
		if (method === 'GET') {
			configObj.url = configObj.url + '?' + stringify(params)
		} else {
			configObj.data = params
		}
		// } else {
		//     configObj.data = params;
		// }

		if (config.showLoading) {
			Toast.loading({
				// icon: logoImg,
				mask: true,
				duration: 5000,
				forbidClick: true, // 禁用背景点击
				message: '加载中...'
			})
		}
		// 接口地址
		if (config.type === 'pay') {
			// console.log(payName)
			configObj.baseURL = payName
		}
		// else {
		//     configObj.baseURL = hostName
		// }
		axios(configObj)
			.then(function (response) {
				// console.log(1)
				Toast.clear()
				resolve(response.data as unknown as Promise<T>)
				if (response.data.resultCode < 1) {
					if (response.data.msg) {
						Toast(response.data.msg)
					}
					if (response.data.resultCode === -6 || response.data.resultCode === -66) {
						localStorage.clear()
						window.location.href = location.origin + location.pathname + '#/login'
					}
					// reject(response.data.msg)
				}
			})
			.catch(function (error) {
				reject(error)
				Toast.clear()
			})
	})
}

// export default {
/**
 * { showLoading = true, type }: configInter = {}
 * 此句作用相当天设置可选参数
 */
export function httpGet<T = any>(
	url: string,
	params?: any,
	{ showLoading = true, type }: configInter = {}
): Promise<T> {
	const config: configInter = { showLoading, type }
	return ajaxMain('GET', url, params, config)
}
export function httpPost<T = any>(
	url: string,
	params?: any,
	{ showLoading = true, type }: configInter = {}
): Promise<T> {
	const config: configInter = { showLoading, type }
	return ajaxMain('POST', url, params, config)
}
export const httpDelete = (url: string, params?: any, { showLoading = true, type }: configInter = {}) => {
	const config: configInter = { showLoading, type }
	return ajaxMain('DELETE', url, params, config)
}
export const httpPut = (url: string, params?: any, { showLoading = true, type }: configInter = {}) => {
	const config: configInter = { showLoading, type }
	return ajaxMain('PUT', url, params, config)
}

/**
 * @description 提供給某些需要自定義請求方式的頁面使用
 * @param method 請求方式
 * @param url 請求地址
 * @param params 參數
 * @param param3 配置信息
 * @returns
 */
export const httpRequest = <T = any>(
	method: Method,
	url: string,
	params: any,
	{ showLoading = true, type }: configInter = {}
): Promise<T> => {
	const config: configInter = { showLoading, type }
	return ajaxMain(method, url, params, config)
}
