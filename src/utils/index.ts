import { Dialog, Toast } from 'vant'

/**
 * @description 校驗手機號碼是否正確
 * @param value 手機號碼
 * @returns 正確為true，錯誤為false
 */
export const checkPhone = (value: string): boolean => {
	const reg = /^1[3-9][0-9]\d{8}$/
	if (reg.test(value)) {
		return true
	} else {
		Toast('请输入正确的手机号')
		return false
	}
}

/**
 * @description 校驗登錄密碼格式是否正確
 * @param value 密碼
 * @returns 正確為true，錯誤為false
 */
export const checkPassWord = (value: string): boolean => {
	const reg = /^[a-zA-Z0-9_-]{6,20}$/
	if (reg.test(value)) {
		return true
	} else {
		Toast('密码必须由6-20位字母、数字、下划线组成')
		return false
	}
}

/**
 * @description 校驗驗證碼格式是否正確（6位）
 * @param value 驗證碼
 * @returns 正確為true，錯誤為false
 */
export const checkCode6 = (value: string): boolean => {
	const reg = /^\d{6}$/
	if (reg.test(value)) {
		return true
	} else {
		Toast('验证码为六位数字')
		return false
	}
}

/**
 * @description 判斷設備是IOS还是Android
 * @returns 蘋果為'io's，安卓為'android'，未知為''
 */
export const isIOSorANDROID = (): string => {
	const u = navigator.userAgent
	// var isXiaomi = u.indexOf('XiaoMi') > -1; // 小米手机
	const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // 其它安卓
	const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios
	if (isAndroid) {
		return 'android'
	} else if (isIOS) {
		return 'ios'
	}
	return ''
}

/**
 * 判断打开的平台
 * @param {*} p
 */
export const platform = () => {
	const ua = window.navigator.userAgent.toLowerCase()
	Dialog.alert({
		message: ua
	})
	if (ua.indexOf('micromessenger') > 0) {
		return 'wx'
	} else if (ua.indexOf('alipay') > 0) {
		return 'ali'
	} else if (ua.indexOf('_zs_slb') > 0) {
		return 'slb'
	}
	return ''
}

/**
 * @description 对金额进行处理，最多保留6位
 * @param value 金额
 * @returns 格式化后的金额
 */
export const gold = (value: number | string) => {
	// console.log(value, typeof value)
	const arr = value.toString().split('.')
	if (arr.length === 2) {
		if (arr[1].length > 6) {
			return Number(value).toFixed(6)
		}
	}
	return value
}

