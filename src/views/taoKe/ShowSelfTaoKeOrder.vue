<template>
	<header class="header-nav-wrap">
		<nav class="flex-space header-nav load-wrap flex-center">
			<router-link
				tag="div"
				active-class="load-active"
				class="load-link"
				v-for="(item, idx) in links"
				:to="item.to"
				:key="idx"
				replace
				>{{ item.name }}</router-link
			>
		</nav>
		<!-- <router-view></router-view> -->
		<router-view v-slot="{ Component, route }">
			<keep-alive :include="cachList">
				<component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
			</keep-alive>
		</router-view>
	</header>
</template>

<script>
import { defineComponent } from 'vue'

/*
 * orders导航
 * @params
 */
export default defineComponent({
	name: 'showSelfTaoKeOrder',
	data() {
		return {
			links: {
				left: {
					to: { name: 'ShowSelfTaoKeOrderList', params: { status: -1 } },
					name: '全部'
				},
				right0: {
					to: { name: 'ShowSelfTaoKeOrderList', params: { status: 0 } },
					name: '返利中'
				},
				right1: {
					to: { name: 'ShowSelfTaoKeOrderList', params: { status: 1 } },
					name: '返利成功'
				},
				right2: {
					to: { name: 'ShowSelfTaoKeOrderList', params: { status: 2 } },
					name: '返利失败'
				}
			},
			cachList: /^\w.*-alive$/
		}
	}
})
</script>
<style lang="less">
@import '../../assets/css/local.less';
nav {
	display: flex;
}
.load-wrap {
	background: #fff;
	text-align: center;
}
.load-link {
	flex-grow: 1;
	font: 28 * @fontSize 'Microsoft Yahei';
	border-bottom: 3px solid #afafaf;
}
.load-link {
	line-height: 76 * @fontSize;
}
.load-link span {
	color: #505050;
}
.load-active {
	border-bottom: 3px solid #ed0c17;
}
.load-active span {
	color: #e85352;
}
.left-enter-active,
.left-leave-active {
	transition: opacity 0.5s;
}
.left-enter,
.left-leave-active {
	opacity: 0;
}
</style>
