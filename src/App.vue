<template>
	<div class="app">
		<Sticky>
			<header class="app-header" :class="{ isNeedBg: isNeedBg }" :style="searchStyle">
				<NavBar :title="title" :border="false" @click-left="goBack">
					<template #left v-if="isShowArrow">
						<Icon name="arrow-left" size="18" />
					</template>
					<template #right>
						<Icon name="search" size="18" @click="goSearch" v-if="isShowSearch" />
						<p class="transfer-record" @click="goTransferRecord" v-if="isShowTransferRecord">转账记录</p>
					</template>
				</NavBar>
			</header>
		</Sticky>
		<!-- <router-view /> -->
		<router-view v-slot="{ Component, route }">
			<keep-alive :exclude="cachList">
				<component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
			</keep-alive>
		</router-view>
	</div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, watch, isReactive } from 'vue'
import { Icon, Sticky, NavBar, Button } from 'vant'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'

import { useI18n } from './hooks/setting/useI18n'
import { useTitle } from './hooks/web/useTitle'
// !如果用'@/utils'，会提示Cannot find module的错误，除非将项目独自用vscode打开，但项目多，不适合每个打开，所以用相对路径，不用别名
import { isIOSorANDROID } from './utils'

export default defineComponent({
	name: 'app',
	components: {
		Icon,
		Sticky,
		NavBar,
		Button
	},
	setup() {
		useTitle()
		const { t } = useI18n()
		// 當前頁面標題
		const title = ref('')
		// 頭部背景色
		const isNeedBg = ref(false)
		// 哪些頁面需要顯示“返回”按鈕
		const isShowArrow = ref(false)
		// 哪些頁面需要顯示搜索按鈕
		const isShowSearch = ref(false)
		// 哪些页面需要显示转账记录
		const isShowTransferRecord = ref(false)
		// 當前路由
		const { currentRoute, push, go } = useRouter()

		let route = currentRoute.value //unref(currentRoute)
		let routeName = route.name as string
		// isWXorALI()
		// console.log(obj, title, currentRoute, isReactive(currentRoute))
		watch(
			() => currentRoute.value.path,
			() => {
				// console.log(currentRoute)
				route = currentRoute.value
				routeName = route.name as string
				isNeedBg.value = ['Home', 'Login', 'Mine', 'Slb', 'PayResult', 'Property', 'Balance'].includes(
					routeName
				)
				isShowArrow.value = !['Login', 'Home', 'Mine', 'MxMall', 'Slb'].includes(routeName)
				isShowSearch.value = [
					'TBIndex',
					'JDIndex',
					'PDDIndex',
					'WPHIndex',
					'JDGridList',
					'pddGridList',
					'TBGridList',
					'WPHGridList'
				].includes(routeName)
				isShowTransferRecord.value = ['Balance'].includes(routeName)
				title.value = t(route.meta.title as string)
			},
			{ immediate: true }
		)
		// 返回上一頁
		const goBack = () => go(-1)
		// 搜索
		const goSearch = () => {
			// console.log(route.path)
			const rout = route.path.split('/')[2]
			push({ path: '/taoKe/search', query: { p: rout } })
		}
		// 转账记录
		const goTransferRecord = () => {
			push('/mine/property/transferRecord')
		}
		const searchStyle = computed(() => {
			let style = {}
			if (isIOSorANDROID() === 'ios') {
				style = {
					height: '90px',
					paddingTop: '44px'
				}
			}
			return style
		})
		const token = computed(() => {
			// console.log(localStorage.token)
			return localStorage.token
		})
		return {
			isNeedBg,
			title,
			isShowArrow,
			isShowSearch,
			isShowTransferRecord,
			searchStyle,
			goBack,
			goSearch,
			goTransferRecord,
			token,
			cachList: /^\w.*(?<!-alive)$/ // /^\w.*(?<!-alive)$/ 不以-alive结尾的，不缓存
		}
	}
})
</script>

<style lang="less">
@import './assets/css/local.less';

body {
	background: #f4f4f4;
}

#app {
	font-family: 'PingFangSC-Medium', 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #000;
	font-size: 28 * @fontSize;

	.app-header {
		background-color: #fff;
		// text-align: right;
		// display: flex;
		// position:relative;
		// justify-content: space-between;
		// padding: 60px 50% 10px 10px;
		height: 46px;
		box-sizing: border-box;
		// padding-top: 44px;
		// padding-bottom: 10px;
		text-align: center;

		.back-arrow {
			width: 20%;
			position: absolute;
		}
	}

	.isNeedBg {
		background: linear-gradient(180deg, @primaryColor 0%, @primaryColor 100%);
		// background: linear-gradient(180deg, #fcd755 0%, #fbcb50 100%);

		.van-nav-bar {
			.van-icon {
				color: #fff;
			}
			background: linear-gradient(90deg, @primaryColor 0%, @primaryColor 100%);
			// background: linear-gradient(180deg, #fcd755 0%, #fbcb50 100%);

			.van-nav-bar__title {
				color: #fff;
			}
		}
	}

	.transfer-record {
		color: #fff;
	}
}

.flex-center {
	display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
	display: -webkit-flex; /* NEW - Chrome */
	align-items: center;
	-webkit-align-items: center;
	justify-content: center;
	-webkit-justify-content: center;
}

.flex-start {
	display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
	display: -webkit-flex; /* NEW - Chrome */
	align-items: center;
	-webkit-align-items: center;
	justify-content: flex-start;
	-webkit-justify-content: flex-start;
}

.flex-space {
	display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
	display: -webkit-flex; /* NEW - Chrome */
	align-items: center;
	-webkit-align-items: center;
	justify-content: space-between;
	-webkit-justify-content: space-between;
}

.flex-end {
	display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
	display: -webkit-flex; /* NEW - Chrome */
	align-items: center;
	-webkit-align-items: center;
	justify-content: flex-end;
	-webkit-justify-content: flex-end;
}

.page-tips {
	border-radius: 5px;
	margin-top: 20 * @fontSize;
	padding: 20 * @fontSize;
	background: #fff;

	.title {
		font-size: 30 * @fontSize;
	}

	& > div {
		font-size: 28 * @fontSize;
		color: #666;
	}
}
</style>
