/*eslint-disable*/
const slb = window.slb || function (w) {
	// w.androidJsHandle = w.androidJsHandle || {}
	return {
		/**
		 * @description 扫一扫
		 * @param {*} options 预留的参数，暂时无用
		 */
		qrScan: function (options) {
			// M('qrScan', options)
			console.log("qrScan------", w.androidJsHandle)
			w.androidJsHandle && androidJsHandle.qrScan()
		},
		/**
		 * @description 扫一扫
		 * @param {*} options 预留的参数，暂时无用
		 */
		qrScan2: function (options) {
			// M('qrScan', options)
			w.androidJsHandle && androidJsHandle.qrScan2(options)
		},
		/**
		 * @description 扫一扫
		 * @param {*} options 预留的参数，暂时无用
		 */
		qrScan3: function (options) {
			// M('qrScan', options)
			w.androidJsHandle && androidJsHandle.qrScan3()
		},
		/**
		 * @description 唤起tp钱包支付
		 * @param {*} params
		 */
		tokenPocketPaid: function (params) {
			// M('tokenPocketPaid', options)
			// console.log('-------------------------------+-' + androidJsHandle.tokenPocketPaid)
			w.androidJsHandle && androidJsHandle.tokenPocketPaid(JSON.stringify(params))
		},
		/**
		 * @description 清除缓存
		 */
		clearCache: function () {
			w.androidJsHandle && androidJsHandle.clearCache()
		},
		/**
		 * @description 清除缓存
		 * @param {*} url
		 */
		clearCacheHistory: function (url) {
			w.androidJsHandle && androidJsHandle.clearCacheHistory(url)
		},
		/**
		 * @description 清除缓存
		 * @param {*} url
		 */
		clearCacheFile: function (url) {
			w.androidJsHandle && androidJsHandle.clearCacheFile(url)
		},
		/**
		 * @description 打开第三方地址
		 * @param {*} url
		 */
		openAgentManagerUrl: function (url) {
			w.androidJsHandle && androidJsHandle.openAgentManagerUrl(url)
		},
		/**
		 * @description 获取app版本
		 */
		getVersionInfo: function () {
			return w.androidJsHandle && androidJsHandle.getVersionInfo()
		}
	}

	// function M(type, options) {
	// 	w.androidJsHandle && androidJsHandle[type](options)
	// }

	// return slb
}(window)

// console.log(slb)

export default slb
