<template>
	<div class="mine">
		<section>
			<div class="top">
				<div class="flex-start">
					<div class="mine-img">
						<img :src="avatarImg" alt="" />
					</div>
					<div class="name">{{ userName }}<br />ID：{{ memCode }}</div>
				</div>
			</div>
		</section>
		<section class="sc-section">
			<div class="section-container">
				<CellGroup inset>
					<Cell
						v-for="item in activeSecretNav"
						:title="t(item.title)"
						:key="item.title"
						:to="item.to"
						class="flex-start"
						is-link
					>
						<template #icon>
							<Icon :name="item.icon" :color="item.iconColor" class="search-icon" />
						</template>
					</Cell>
				</CellGroup>
			</div>
		</section>
		<section>
			<div class="section-container">
				<CellGroup inset>
					<Cell
						v-for="item in activeMgNav"
						:title="t(item.title)"
						:key="item.title"
						class="flex-start"
						is-link
						@click="goEleManage(item.to)"
					>
						<template #icon>
							<Icon :name="item.icon" :color="item.iconColor" class="search-icon" />
						</template>
					</Cell>
				</CellGroup>
			</div>
		</section>
		<section>
			<div class="section-container">
				<CellGroup inset>
					<Cell
						v-for="item in activeTestNav"
						:title="t(item.title)"
						:key="item.title"
						class="flex-start"
						is-link
						@click="goEleManage(item.to)"
					>
						<template #icon>
							<Icon :name="item.icon" :color="item.iconColor" class="search-icon" />
						</template>
					</Cell>
				</CellGroup>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onActivated, reactive } from 'vue'
import { CellGroup, Cell, Icon } from 'vant'

import { picDisplayPath, locationOrigin } from '@/utils/config'
import slb from '../../utils/jslb-1.0.0'
import { useI18n } from '@/hooks/setting/useI18n'

import { useRouter } from 'vue-router'
import { useStore } from '@/store'

export default defineComponent({
	name: 'Mine-alive',
	components: {
		CellGroup,
		Cell,
		Icon
		// ActionSheet,
		// Button,
		// Field
	},
	setup() {
		const { t } = useI18n()
		const store = useStore()
		const { push, replace } = useRouter()
		// const locMemCode = localStorage.getItem('memCode') || ''
		// const memCode = ref(locMemCode)

		const memCode = computed(() => store.state.user.userInfo.memCode)

		const data = reactive({
			isPayShow: true, // ['500004', '500111', '717260', '500010', '539241', '500012', '999739', '1892076'].includes(memCode),
			avatarImg: picDisplayPath + 'slbApp/logo.png', // picDisplayPath + 'slb/logo.jpg',
			userName: localStorage.getItem('userName'),

			// 秘密相关
			secretNav: [
				{
					title: 'routes.memberCoupleOrder',
					to: { path: '/taoKe/memberCoupleOrder' },
					icon: picDisplayPath + 'slbApp/new-ui/sc-input.png',
					iconColor: '#07c160',
					isShow: true
				},
				{
					title: 'routes.showSelfTaoKeOrder',
					to: { name: 'ShowSelfTaoKeOrderList', params: { status: -1 } },
					icon: picDisplayPath + 'slbApp/new-ui/sc-list.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: 'routes.incomePower',
					to: { path: '/taoKe/incomePower' },
					icon: picDisplayPath + 'slbApp/new-ui/power.png',
					iconColor: '#ff976a',
					isShow: false
				},
				{
					title: 'routes.myOrder',
					to: { path: '/mxMall/myOrder' },
					icon: picDisplayPath + 'slbApp/new-ui/mx-list.png',
					iconColor: '#1989fa',
					isShow: true
				}
			],
			// 展市相关
			mgNav: [
				// {
				// 	title: 'routes.property',
				// 	to: { path: '/mine/property' },
				// 	icon: picDisplayPath + 'slbApp/new-ui/my-money.png',
				// 	iconColor: '#1989fa',
				// 	isShow: true
				// },
				{
					title: 'routes.selectMemberBenefitList',
					to: { path: '/mine/selectMemberBenefitList' },
					icon: picDisplayPath + 'slbApp/new-ui/order-detail.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: 'routes.banCard',
					to: { path: '/mine/banCard' },
					icon: picDisplayPath + 'slbApp/new-ui/credit-card.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: 'routes.takeCashAccount',
					to: { path: '/mine/takeCashAccount' },
					icon: picDisplayPath + 'slbApp/new-ui/zfb.png',
					// icon: 'alipay',
					iconColor: '#3476fe',
					isShow: true
				},
				{
					title: 'routes.bankTrans',
					to: { name: 'BankTransOrderSUSD' },
					icon: picDisplayPath + 'slbApp/new-ui/tran-list.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: 'routes.eleList',
					to: { path: '/mine/eleList' },
					icon: picDisplayPath + 'slbApp/new-ui/ele-list.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: '渠道管理',
					to: '/slmer/index.html',
					icon: picDisplayPath + 'slbApp/new-ui/dis-manage.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: '商家管理',
					to: '/slmer/index.html',
					icon: picDisplayPath + 'slbApp/new-ui/mer-manage.png',
					iconColor: '#1989fa',
					isShow: true
				}
			],
			// 头部相关
			setNav: [
				{
					title: '完善信息',
					to: { name: 'bindPhone' },
					icon: picDisplayPath + 'slbApp/new-ui/info.png',
					iconColor: '#ee0a24',
					isShow: false
				},
				{
					title: 'routes.addressList',
					to: { name: 'AddressList' },
					icon: picDisplayPath + 'slbApp/new-ui/location.png',
					iconColor: '#07c160',
					isShow: true
				},
				{
					title: 'TAA钱包教程',
					to: { name: 'TAAIndex' },
					icon: picDisplayPath + 'slbApp/new-ui/help.png',
					iconColor: '#07c160',
					isShow: true
				}
			],
			// 设置相关
			testNav: [
				// {
				// 	title: 'routes.incomeType',
				// 	to: { path: '/mine/incomeType' },
				// 	icon: picDisplayPath + 'slbApp/new-ui/income-type.png',
				// 	isShow: true
				// },
				{
					title: 'routes.posList',
					to: { name: 'PosList' },
					icon: picDisplayPath + 'slbApp/new-ui/pos.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: '白皮书',
					// to: { path: '/mine/whitePaper' },
					to: '/download/%E6%95%B0%E8%81%94%E5%AE%9D%E7%99%BD%E7%9A%AE%E4%B9%A61.5.pdf',
					icon: picDisplayPath + 'slbApp/new-ui/white-paper.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: '下载',
					to: { name: 'Download' },
					icon: picDisplayPath + 'slbApp/new-ui/download.png',
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: 'routes.settings',
					to: { name: 'Settings' },
					icon: picDisplayPath + 'slbApp/new-ui/setting.png',
					iconColor: '#1989fa',
					isShow: true
				}
			]
		})
		const activeSecretNav = computed(() => data.secretNav.filter(item => item.isShow))
		const activeMgNav = computed(() => data.mgNav.filter(item => item.isShow))
		const activeSetNav = computed(() => data.setNav.filter(item => item.isShow))
		const activeTestNav = computed(() => data.testNav.filter(item => item.isShow))

		// 渠道管理
		const goEleManage = (path: string | object) => {
			if (typeof path === 'string') {
				slb.openAgentManagerUrl(locationOrigin + path)
				// slb.openAgentManagerUrl('http://mg.2qzs.com/slmer/index.html#/')
				// window.location.href = localtionOrigin + path
			} else {
				push(path)
			}
		}
		const logout = () => {
			localStorage.clear()
			replace('/login')
			// window.location.href =
			// 	process.env.NODE_ENV === 'production' ? localtionOrigin + '/slbApp/index.html' : localtionOrigin + '#login'
		}

		onActivated(() => {
			// memCode.value = localStorage.memCode
		})
		// onMounted(() => {
		// })
		const { avatarImg, userName, isPayShow } = data
		return {
			memCode,
			// balanceObj,
			avatarImg,
			userName,
			isPayShow,
			// activeTaaNav,
			activeSecretNav,
			activeMgNav,
			activeSetNav,
			activeTestNav,
			t,
			goEleManage,
			logout
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.mine {
	// margin-top: 46px;
	.top {
		box-sizing: border-box;
		height: 284 * @fontSize;
		color: #fff;
		background-image: url('http://mg.2qzs.com/img/slbApp/login/mine-bg.png');
		background-size: contain;
		// padding-top: 88 * @fontSize;
		.mine-img {
			width: 120 * @fontSize;
			height: 120 * @fontSize;
			margin-right: 40 * @fontSize;
			margin-left: 50 * @fontSize;
			img {
				box-sizing: border-box;
				width: 120 * @fontSize;
				height: 120 * @fontSize;
				border: 2px solid #fff;
				border-radius: 50%;
			}
		}
	}
	section:not(:nth-child(1)) {
		margin-top: 20 * @fontSize;
	}
	// .section-container {
	// padding: 0 20 * @fontSize;
	// border-radius: 10px;
	// }
	section.sc-section {
		margin-top: -60px;
	}
	.search-icon {
		margin-right: 20 * @fontSize;
		font-size: 48 * @fontSize;
	}
}
</style>
