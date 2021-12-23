<template>
	<div class="pay-list flex-space">
		<div class="item" v-for="item in listNav" :key="item.id" @click="$router.push(item.to)">
			<img :src="item.icon" alt="" />
			<p>{{ item.title }}</p>
		</div>
	</div>
</template>

<script>
// import { CellGroup, Cell, Icon } from 'vant'
// import { isIOSorANDROID } from '../../utils'

// import scImg from '../../../assets/img/payLogo/sc.png'
import slbImg from '../../../assets/img/pay-logo.png'
import tpImg from '../../../assets/img/slb/tp.png'
import naImg from '../../../assets/img/slb/nabox.png'
import { defineComponent } from 'vue'
export default defineComponent({
	name: 'DownloadIndex',
	// components: { CellGroup, Cell, Icon },
	data() {
		// const memCode = localStorage.getItem('memCode')
		return {
			list: [
				// ['500004', '500111', '717260', '500010', '539241', '500012', '999739', '1892076', '657129'].includes(memCode)
				{
					title: '数联宝下载',
					id: 1,
					to: { name: 'DownloadSLB' },
					icon: slbImg,
					iconColor: '#1989fa',
					isShow: true
				},
				// {
				// 	title: '秘密下载',
				// 	id: 2,
				// 	to: { name: 'downloadSC' },
				// 	icon: scImg,
				// 	iconColor: '#1989fa',
				// 	isShow: true
				// },
				{
					title: 'TP钱包下载帮助',
					id: 3,
					to: { name: 'Help', query: { type: 'tp' } },
					icon: tpImg,
					iconColor: '#1989fa',
					isShow: true
				},
				{
					title: 'Nabox钱包下载帮助',
					id: 4,
					to: { name: 'Help', query: { type: 'nb' } },
					icon: naImg,
					iconColor: '#1989fa',
					isShow: true
				}

				// {title: '数点兑换', id: 2, to: {name: 'payForSusd'},  icon: 'after-sale', iconColor: '#ff976a', isShow: true},
				// {title: '信用卡还款', id: 3, to: {name: 'creditCard'},  icon: 'credit-pay', iconColor: '#07c160', isShow: true}
			],
			slbImg
			// device: isIOSorANDROID()
		}
	},
	computed: {
		listNav() {
			return this.list.filter(item => item.isShow)
		}
	}
})
</script>

<style scoped lang="less">
@import '../../../assets/css/local.less';
// @fontSize: 0.01333rem;
.pay-list {
	flex-wrap: wrap;
	box-sizing: border-box;
	padding-top: 20 * @fontSize;
	.item {
		box-sizing: border-box;
		width: 50%;
		height: 200 * @fontSize;
		padding: 20 * @fontSize 0;
		text-align: center;
		background: #fff;
		img {
			width: 100 * @fontSize;
		}
		p {
			margin-top: 10 * @fontSize;
		}
		&:nth-child(odd) {
			border-right: 1px solid #f7f7f7;
			border-bottom: 1px solid #f7f7f7;
		}
	}

	a {
		display: inline-block;
		width: 100%;
		color: #323233;
	}
}
</style>
