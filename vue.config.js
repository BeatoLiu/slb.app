// vue.config.js
// const path = require('path')
// function resolve(dir) {
//     return path.join(__dirname, dir)
// }

const outputDir = () => {
	let dir
	// console.log(process.env.NODE_ENV)
	switch (process.env.VUE_APP_ENV) {
		case 'development':
			dir = '/api' // 这里是本地的请求url
			break
		case 'test': // 注意这里的名字要和设置的模式名字对应起来
			dir = 'slbAppTest' // 这里是测试环境中的url
			break
		case 'production':
			dir = 'slbApp' // 生产环境url
			break
	}
	return dir
}

module.exports = {
	publicPath: './', // outputDir: 'slbApp',
	outputDir: outputDir(),
	productionSourceMap: false,
	filenameHashing: true,
	lintOnSave: false,
	devServer: {
		port: 8092, // 端口号
		https: false, // https:{type:Boolean}
		open: true, // 配置自动启动浏览器
		proxy: {
			'/api': {
				// target: 'http://localhost:9007/',
				// target: 'http://192.168.0.10:9007/',
				target: 'http://192.168.0.161:9007/', // 王
				// target: locationOrigin,
				// target: "http://tk.2qzs.com",
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
				}
			},
			'/pay': {
				// target: 'http://localhost:9009/',
				// target: 'http://192.168.0.10:9009/',
				target: 'http://192.168.0.161:9009/', // 王
				// target: 'http://60.186.192.1:9009/',
				// target: payName,
				// target: 'http://192.168.0.112:9002/mg',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/pay': '/' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
				}
			}
		} // 配置多个代理
	},
	// configureWebpack: {
	//     resolve: {
	//         alias: {
	//             '@': 'src'
	//         }
	//     }
	// },
	chainWebpack: config => {
		config.plugins.delete('prefetch')
		config.resolve.symlinks(true)
		// config.resolve.alias.set('@', resolve('src'))
	}
}
