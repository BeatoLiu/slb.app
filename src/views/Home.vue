<template>
	<div class="home">
		<Sticky :offset-top="offSetTop">
			<header>
				<!-- 搜索框 -->
				<div class="search">
					<Search
						v-model="keywords"
						shape="round"
						background="transparent"
						input-align="center"
						:placeholder="t('common.searchPlaceholder')"
						@click="$router.push('/taoKe/search')"
					></Search>
				</div>
				<!-- 頂部標籤欄 -->
				<!-- <div class="tabs">
					<Tabs background="transparent" color="#fff" v-model:active="activeTab">
						<Tab title-class="tabs-tab" v-for="item in tabsList" :key="item.catId" :name="item.catId">
							<template #title>
								<span class="tabs-tab">{{ t(item.title) }}</span>
							</template>
						</Tab>
					</Tabs>
				</div> -->
			</header>
		</Sticky>
		<!-- 搜索框下面部分 -->
		<div class="search-bottom">
			<div class="fun-list flex-space">
				<div v-for="item in topListNav" :key="item.id" @click="topFunc(item, item.id)">
					<div>
						<Icon :name="item.icon"></Icon>
					</div>
					<p>{{ t(item.title) }}</p>
				</div>
			</div>
		</div>
		<!-- 轮播 -->
		<!-- <section>
			<div class="my-swipe">
				<Swipe :autoplay="3000" indicator-color="white">
					<SwipeItem v-for="(item, index) in swipeImages" :key="index" @click="changeImg(item.url)">
						<img :src="item.img" />
					</SwipeItem>
				</Swipe>
			</div>
		</section> -->
		<!-- 導航 -->
		<section class="nav-content">
			<div class="nav-container">
				<div class="platform-list flex-space">
					<div v-for="item in platformList" :key="item.plateName" @click="goPlatform(item)">
						<div><van-image :src="item.icon" /></div>
						<p>{{ t(item.plateName) }}</p>
					</div>
				</div>
			</div>
		</section>
		<!-- 获得taa 轮播 -->
		<!-- <section>
			<div class="mx-notice">
				<NoticeBar left-icon="volume-o" background="#fff" :scrollable="false">
					<Swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
						<SwipeItem v-for="(item, idx) in memTAAList" :key="idx"
							>编号{{ ('' + item.memCode).substr(0, 3) + '****' + ('' + item.memCode).substr(4) }}秘选购物奖励{{
								item.tokenSUm
							}}sie</SwipeItem
						>
					</Swipe>
				</NoticeBar>
			</div>
		</section> -->
		<!--理財入口 @click="$router.push({ name: 'YiDuoBao' })" -->
		<section>
			<div class="lc-index">
				<div>
					<!-- <img :src="picPath + 'custom/secret/point-index.jpg'" alt=""> -->
					<img :src="lcImg" alt="" />
				</div>
			</div>
		</section>
		<!-- 特惠热销 -->
		<section>
			<div class="benifit">
				<div class="benifit-container">
					<div class="flex-space" style="align-items: stretch; height: 100%">
						<div class="tehui" @click="$router.push({ name: 'TBPreferential' })">
							<div class="benifit-left">
								<!-- <p>9.9购</p> -->
								<p>特惠</p>
								<p>全场促销 5折起步</p>
								<p>立即抢购</p>
							</div>
							<!-- <div class="benifit-left">
								<van-image :src="teHuiImg" />
							</div> -->
						</div>
						<div class="benifit-top flex-space" style="margin-left: 5px; align-items: stretch">
							<div class="flex-space" @click="goTaoBao('yiTao', '淘宝')">
								<div class="benifit-left">
									<p>快抢</p>
									<p>每天领取大红包</p>
								</div>
								<div>
									<van-image :src="dhbImg" />
								</div>
							</div>
							<div class="flex-space" @click="goTaoBao('baoPin', '淘宝')">
								<div class="benifit-left">
									<p>每日精选</p>
									<p>舒适贴身 价格亲民</p>
								</div>
								<div>
									<van-image :src="bagImg" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- 分类 -->
		<section>
			<div class="cat-list">
				<div class="cat-container">
					<p class="cat-title flex-start main-title">
						<img src="../assets/img/title-left.png" alt="" />每日必逛<span>发现更多好货</span>
					</p>
					<div class="cat-top flex-space">
						<!-- :style="{'backgroundImage': 'url(' + item.icon + ')'}" -->
						<div v-for="item in catList" :key="item.title" @click="getGridId(item)">
							<!-- <p>淘宝</p> -->
							<p>{{ item.title }}</p>
							<p>{{ item.subtitle }}</p>
							<div>
								<img :src="item.icon" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- 熱門推薦 -->
		<section>
			<div class="hot-recom">
				<div class="hot-title">
					<p>{{ t('taoKe.others.hotText') }}</p>
				</div>
				<div class="flex-space hot-content">
					<div class="flex-start">
						<p>热门精选 · 排行榜</p>
						<p>TOP RANKING</p>
					</div>
					<p>{{ t('common.moreText') }}<Icon name="arrow" /></p>
				</div>
			</div>
		</section>
		<!-- 商品列表 -->
		<div class="list">
			<List v-model:loading="loading" :finished="finished" :finished-text="t('common.noDataText')" @load="onload">
				<!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
				<!-- {{ list }} -->
				<div class="item flex-start" v-for="item in list" :key="item.category_id">
					<!-- {{ item.short_title }} -->
					<div class="item-left"><img :src="item.pict_url" alt="" /></div>
					<div class="item-right">
						<div class="goods-title">{{ item.short_title }}</div>
						<div class="shop-title">{{ item.shop_title }}</div>
						<div class="return-power">预计返{{ calcSie(item) }}TAA</div>
						<div class="flex-space price-content">
							<div>
								<p class="volume">已售{{ item.volume }}</p>
								<p class="price">{{ item.zk_final_price }}</p>
							</div>
							<div class="go-buy" @click="goShopping(item)">马上抢</div>
						</div>
					</div>
				</div>
			</List>
		</div>
	</div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, computed, onActivated } from 'vue'
import { Button, Search, Tabs, Tab, Swipe, SwipeItem, List, Image, NoticeBar, Icon, Dialog, Toast, Sticky } from 'vant'

import { picDisplayPath } from './../utils/config'
import slb from './../utils/jslb-1.0.0'

import { useI18n } from './../hooks/setting/useI18n'
import { useHomeGoodsList } from '../hooks/web/useHomeGoodsList'
import { useOffSetTop } from '../hooks/web/useOffSetTop'
import { useCalcPower } from '../hooks/web/useCalcPower'
import { useGetTAAPrice } from '../hooks/web/useGetTAAPrice'
import { useRouter } from 'vue-router'

// import { addAdvertising } from '../apis/tAA'

export default defineComponent({
	name: 'home-alive',
	components: {
		Button,
		Search,
		Tabs,
		Tab,
		Swipe,
		SwipeItem,
		List,
		NoticeBar,
		Icon,
		Sticky,
		[Image.name]: Image
	},
	setup() {
		onActivated(() => {
			// window.adCb = adCb
			window.scanRes = scanRes
		})
		const { t } = useI18n()
		const { push } = useRouter()
		const { offSetTop } = useOffSetTop()
		// taa價格
		const { taaPrice } = useGetTAAPrice()
		// 產品返利taa數量
		const calcSie = item => {
			const { commission_rate, zk_final_price } = item
			const gCommission = (zk_final_price * commission_rate) / 10000
			const calcPower = useCalcPower(gCommission)
			return calcPower / taaPrice.value
		}
		const data = reactive({
			// picDisplayPath,
			// 搜索關鍵字，可能不需要
			keywords: '',
			// 輪播圖
			swipeImages: [
				{ img: picDisplayPath + 'secret/banners/ele-entry.png', url: 'http://mg.2qzs.com/slmer/index.html' }
			],

			// 最上面菜单
			topList: [
				{
					id: 1,
					title: '扫一扫',
					icon: picDisplayPath + 'slbApp/home/scan.png',
					iconColor: '#fff',
					to: '',
					isShow: true
				},
				{
					id: 4,
					title: '收款',
					icon: picDisplayPath + 'slbApp/home/make-collections.png',
					iconColor: '#fff',
					to: { name: 'CollectionsQR' },
					isShow: true
				},

				{
					id: 3,
					title: 'routes.payForSUSD',
					icon: picDisplayPath + 'slbApp/home/recharge.png',
					iconColor: '#fff',
					to: { name: 'PayForSUSD' },
					isShow: true
				},
				{
					id: 2,
					title: '信用卡还款',
					icon: picDisplayPath + 'slbApp/home/credit.png',
					iconColor: '#fff',
					to: { name: 'CreditCard' },
					isShow: true
				}

				// {
				// 	id: 4,
				// 	title: '节点申请',
				// 	icon: picDisplayPath + 'slbApp/home/ele.png',
				// 	iconColor: '#fff',
				// 	to: 'http://mg.2qzs.com/slmer/index.html#/',
				// 	isShow: true
				// }
			],
			// 各平臺list
			platformList: [
				{ plateName: 'taoKe.tb.plateName', icon: picDisplayPath + 'slbApp/home/tb.png', to: 'TBIndex' },
				{ plateName: 'taoKe.jd.plateName', icon: picDisplayPath + 'slbApp/home/jd.png', to: 'JDIndex' },
				{
					plateName: 'taoKe.tb.elmName',
					icon: picDisplayPath + 'slbApp/home/elm.png',
					to: 'https://s.click.ele.me/HVzfsnu',
					type: '_blank'
				},
				{ plateName: 'taoKe.others.wphName', icon: picDisplayPath + 'slbApp/home/wph.png', to: 'WPHIndex' },
				{ plateName: 'taoKe.pdd.plateName', icon: picDisplayPath + 'slbApp/home/pdd.png', to: 'PDDIndex' },
				{
					plateName: 'taoKe.tb.tmName',
					icon: picDisplayPath + 'slbApp/home/tm.png',
					to: 'taobao://s.click.taobao.com/t?union_lens=lensId%3AOPT%401602760358%400b5996e3_0ec9_1752bf639c9_e4ea%4001%3BeventPageId%3A20150318019999659&e=m%3D2%26s%3DR%2FXxNtE%2Fd5Jw4vFB6t2Z2iperVdZeJviU%2F9%2F0taeK29yINtkUhsv0B1RVA3Mk9CvA4NubRp%2Bh3fFwuxlvvcqslm8qW4P%2BzTEuudk%2FF1RTTLTDz05MmO4rcZs%2FlxbxCv%2Fogfc9UhHI0lKaJluSZBCVo5N7u7NTPnpvgfyVVUAbkzCbAGjvJeFYhvzeiceWLrTM7kxpdONUAK2ZesAkYM2UrHfv3%2BBYcPW%2FknKiHyNnnzx2TVyAt4KVV6jEit7Q%2BTTDDIVBsijSCjzGbClblec8wZuqbA1a%2BDEQLQFOpoRkV6yOsMozO%2BVvnxPh9IGwtCqZA1eON6i3S4Cld0SfNEBg9uNrcWnRI1T%2FwM%2FEqaICMTs%2BS44FcFJ9I2W8V7dx%2BtpotIIAR%2FK5Kni%2BR%2FIz1fMNA%3D%3D'
				},
				{
					plateName: 'taoKe.others.mtName',
					icon: picDisplayPath + 'slbApp/home/mt.png',
					to: 'imeituan://www.meituan.com/web?lch=cps:waimai:3:f4a39a1b4d941c8a6495e883598a5429:zs186581877889958425&url=https%3A%2F%2Fclick.meituan.com%2Ft%3Ft%3D1%26c%3D1%26p%3DOWMpZ-uzIFOVe6JyOONs3dXuqV0qcAf-r-KCvHdXiNfIMGLDenU9eNeSS39KvPnR3aH7L-yA6SRm2_TrsCUj99pkcrKEcIWa_JwB2WXzKFPdcxMJuo6e94TFHjPKta6wMVobopHG5RVy3Jk12eYEI--Roiyiw5K46nmWP20OwSsBVHtUbTRL1FY7cj-hhsk2D2nXU-yvpv-zXjuRABJ662C0sjla3ufPjrE-452Uyu4xXk_CkCcEBI81eYse9z40pdNZyqt1u_2AgQy1l7GfpGUknlUvFIWWo85nx7a1kMFg6Grl4zIVM89c10wiIwtp3jVynK7xSH_LsQya7yhLxfmPLvRGjiOVC51ucCdyTzQfbL5rH1oD5K12DBtJhB3mE0to2hUSR2EWAe-TkcEXCFpGvi7cRf1Zpa-3_DiBNuC9AT7oPeE8NcMZuuV-loUlZnvFIOJKrzivZhjO8pD3LQCUVjTW2uNpnNnbwf54qbhP1UC4Y_aZ9k_HmalO2fYql0D4h_Vz5dI1B-ZW51mRlNd1CTCRxFMLVT0xOYuSYky45J_kckZcJAZg1YsPwb2XWFXjN9W3RbDXby9LnwzyiS1SeFKO90lndFACALbOQPr-KbcIPELLyBXskaSpmAjUey80oKS1z4rlf02t_EuLDUcFk_yww1sD76H-GdXQ2YWk8N90BLgjraKtAc_HgOgYwYekeIiU2Ty1JF1Rmy0u5ikKNH3wGxDX5PSZZUsqUEs'
				},
				{
					plateName: 'taoKe.others.tjjdName',
					icon: picDisplayPath + 'slbApp/home/tjjd.png',
					to: 'http://hotels.ctrip.com/?AllianceID=1277137&sid=3509633&ouid=&popup=close&autoawaken=close',
					type: '_blank'
				},
				{
					plateName: 'taoKe.others.tjjpName',
					icon: picDisplayPath + 'slbApp/home/tjjp.png',
					to: 'http://flights.ctrip.com/?AllianceID=1277137&sid=3509633&popup=close&autoawaken=close&sourceid=&ouid',
					type: '_blank'
				},
				{
					plateName: 'taoKe.others.xclyName',
					icon: picDisplayPath + 'slbApp/home/xcly.png',
					to: 'http://www.ctrip.com/?AllianceID=1277137&sid=3509633&ouid=&app=0101F00',
					type: '_blank'
				}
			],
			catList: [
				{
					title: '潮流范',
					subtitle: '爱自己',
					icon: 'http://mg.2qzs.com/img/taoke/cat-5.png',
					to: 'TBGridList',
					type: 'fashion',
					materialId: 4093
				},
				{
					title: '母婴主题',
					subtitle: '爱宝宝',
					icon: 'http://mg.2qzs.com/img/taoke/cat-6.png',
					to: 'TBGridList',
					type: 'mom',
					materialId: 4040
				},
				{
					title: '高算力',
					subtitle: '更多算力',
					icon: 'http://mg.2qzs.com/img/taoke/cat-7.png',
					to: 'TBGridList',
					type: 'benifit',
					materialId: 13366
				},
				// {title: '拼好货', subtitle: '品质好货', icon: cat8, to: 'pddHomeList', type: 'life', materialId: 2},
				{
					title: '热销',
					subtitle: '款款好物',
					icon: 'http://mg.2qzs.com/img/taoke/cat-9.png',
					to: 'TBGridList',
					type: 'hot',
					materialId: 28026
				},
				{
					title: '大额券',
					subtitle: '大额券等你拿',
					icon: 'http://mg.2qzs.com/img/taoke/cat-10.png',
					to: 'TBGridList',
					type: 'ticket',
					materialId: 27446
				},
				{
					title: '淘生活',
					subtitle: '小惊喜',
					icon: 'http://mg.2qzs.com/img/taoke/cat-11.png',
					to: 'TBGridList',
					type: 'life',
					materialId: 30443
				}
				// {title: '拼爆款', icon: cat9, to: 'pddHomeList', type: 'life', materialId: 1},
				//
			],
			// 獲得taa的滾動消息
			memTAAList: [],
			lcImg: picDisplayPath + 'slbApp/home/lc-banner.png',
			teHuiImg: picDisplayPath + 'slbApp/home/9.9.png',
			dhbImg: picDisplayPath + 'slbApp/home/dhb.png',
			bagImg: picDisplayPath + 'slbApp/home/bag.png'
		})
		const taoBaoUrl = reactive({
			//  一淘补贴，天天领补贴，0门槛就能获得最高100元
			yiTao:
				'taobao://mo.m.taobao.com/etao/tmpl_mini_butie_b?pid=mm_911310084_1347250169_110094300209&union_lens=lensId%3APUB%401602759619%400bb69853_0e37_1752beaf1d5_03f0%4001',
			// 淘宝特卖精选, 精选淘宝/天猫最热门优惠券
			teMaiJingXuan:
				'taobao://temai.m.taobao.com/index.htm?pid=mm_911310084_1347250169_110094300209&union_lens=lensId%3APUB%401602760072%400b1b8c89_0e03_1752bf1dcba_03fb%4001',
			// 飞猪
			feiZhu:
				'taobao://s.click.taobao.com/t?e=m%3D2%26s%3DeT1Ml9ifoWkcQipKwQzePCperVdZeJviEViQ0P1Vf2kguMN8XjClAjp77uCLCVtq2KO1Zj%2BdyQPFwuxlvvcqslm8qW4P%2BzTEuudk%2FF1RTTJyVjRk%2BCrnz5lcE%2BT7wujnfu6rqwtgiq7RDtA7JsJpDL0CYBEjBf0rnE0ssjA9BPadpikUEh8L%2FRhnzH0Xe5mrtIgnkDsvGLXC13C4s4MKnasauD0yTXqwRIvEu7eKTPyETlcjedV8dDlYbm1JWdqaomfkDJRs%2BhU%3D',
			// 爆品库
			baoPin:
				'taobao://mo.m.taobao.com/union/chaojidanpin20181201?pid=mm_911310084_1347250169_110094300209&union_lens=lensId%3APUB%401602760275%400b152c4e_0e78_1752bf4f567_03f9%4001',
			// 天猫国际
			tianMaoGuoJi:
				'taobao://s.click.taobao.com/t?union_lens=lensId%3AOPT%401602760358%400b5996e3_0ec9_1752bf639c9_e4ea%4001%3BeventPageId%3A20150318019999659&e=m%3D2%26s%3DR%2FXxNtE%2Fd5Jw4vFB6t2Z2iperVdZeJviU%2F9%2F0taeK29yINtkUhsv0B1RVA3Mk9CvA4NubRp%2Bh3fFwuxlvvcqslm8qW4P%2BzTEuudk%2FF1RTTLTDz05MmO4rcZs%2FlxbxCv%2Fogfc9UhHI0lKaJluSZBCVo5N7u7NTPnpvgfyVVUAbkzCbAGjvJeFYhvzeiceWLrTM7kxpdONUAK2ZesAkYM2UrHfv3%2BBYcPW%2FknKiHyNnnzx2TVyAt4KVV6jEit7Q%2BTTDDIVBsijSCjzGbClblec8wZuqbA1a%2BDEQLQFOpoRkV6yOsMozO%2BVvnxPh9IGwtCqZA1eON6i3S4Cld0SfNEBg9uNrcWnRI1T%2FwM%2FEqaICMTs%2BS44FcFJ9I2W8V7dx%2BtpotIIAR%2FK5Kni%2BR%2FIz1fMNA%3D%3D',
			// 天猫超市，领券199减100 2021-09-29
			tianMaoQuanJian:
				'taobao://s.click.taobao.com/t?union_lens=lensId%3AOPT%401602760456%400b5830b7_0ecd_1752bf7b941_dcd4%4001%3BeventPageId%3A20150318020000721&e=m%3D2%26s%3D2nEL9bC%2F8Mxw4vFB6t2Z2iperVdZeJviU%2F9%2F0taeK29yINtkUhsv0B1RVA3Mk9CvrcrByUYMQxbFwuxlvvcqslm8qW4P%2BzTEuudk%2FF1RTTLTDz05MmO4rcZs%2FlxbxCv%2Fogfc9UhHI0lKaJluSZBCVo5N7u7NTPnpvgfyVVUAbkzCbAGjvJeFYhvzeiceWLrTM7kxpdONUAK2ZesAkYM2UrHfv3%2BBYcPW%2FknKiHyNnnwFvmlJ8Nzy3cBly1OFl7MvnxdpjbTh11t4roDJo31w0WSTCs7hXMhm42eZNU8odRUChHoTLkHOJA82D9J78nkhSq%2FXw%2Bm40ahnm%2F0osGmDCldoCfOaow%2ByIYULNg46oBA%3D',
			// 天猫超市休闲食品50元，2021-08-24
			tianMao50ShiPin:
				'taobao://s.click.taobao.com/t?union_lens=lensId%3AOPT%401602815856%400b14dbdd_0f1b_1752f450fb1_a709%4001%3BeventPageId%3A20150318019999984&e=m%3D2%26s%3DKKNlw9n%2BaFNw4vFB6t2Z2iperVdZeJviU%2F9%2F0taeK29yINtkUhsv0E%2F1hheTT4j0hnTW7YStT8LFwuxlvvcqslm8qW4P%2BzTEuudk%2FF1RTTLTDz05MmO4rcZs%2FlxbxCv%2Fogfc9UhHI0lKaJluSZBCVo5N7u7NTPnpvgfyVVUAbkzCbAGjvJeFYhvzeiceWLrTM7kxpdONUAK2ZesAkYM2UrHfv3%2BBYcPW%2FknKiHyNnnwFqMlk%2BHscgsxly4mDws6anxdpjbTh11t4roDJo31w0WSTCs7hXMhm42eZNU8odRWK60WglVTt1z2smWwdEifi9MMBQPxkkOu9Gf2zmUiveQ%3D%3D'
		})
		// 產品列表
		let { list, loading, finished, getData } = useHomeGoodsList()
		const onload = () => {
			// 异步更新数据
			setTimeout(() => {
				// data.params.pageNum++
				// loading.value = true
				getData()
			}, 500)
		}
		const activeTab = ref(1)

		// 点击轮播图片
		const changeImg = url => {
			if (url) {
				if (typeof url === 'string') {
					window.location.href = url
				} else {
					push(url)
				}
			}
		}
		// 点击各平台
		const goPlatform = async item => {
			// if (item.title === 'slb.adTAA') {
			// 	// window.SetAppTitle = 123
			// 	// Window.SetAppTitle = 123
			// 	if (window.hasOwnProperty('handleAd')) {
			// 		window.handleAd.postMessage('2')
			// 	}
			// }
			if (item.plateName === 'taoKe.others.mtName') {
				await Dialog.alert({
					title: '美团提示',
					message: '必须使用【天天神券】红包，才有返利',
					messageAlign: 'left'
				})

				var loadDateTime = new Date()
				let timer = window.setTimeout(function () {
					var timeOutDateTime = new Date()
					if (timeOutDateTime - loadDateTime < 5000) {
						Toast(`请先下载美团App`)
						window.clearTimeout(timer)
					} else {
						window.close()
					}
				}, 3000)
				window.location.href = item.to
			} else if (item.type === '_blank') {
				// console.log(item)
				window.location.href = item.to
			} else {
				push({ name: item.to })
			}
		}
		// 顶部菜单点击事件
		const topFunc = (item, id) => {
			if (id === 1) {
				// if (process.env.VUE_APP_ENV === 'test') {
				try {
					slb.openScan()
				} catch (err) {
					// console.log(typeof err)
					// Toast(JSON.stringify(err))
				}
				// }
				// } else if (id === 2) {
				// 	Toast('敬请期待')
			} else if (id === 2 || id === 3 || id === 4) {
				push(item.to)
				// } else if (id === 4) {
				// 	window.location.href = 'http://mg.2qzs.com/slmer/index.html#/'
			}
		}
		// 打开淘宝各活动
		const goTaoBao = async (urlTitle, platformName) => {
			// console.log(this)
			if (urlTitle === 'feiZhu') {
				await Dialog.alert({
					title: '飞猪提示',
					message:
						'<p>1、航旅的当面付、火车票或者理财保险类商品，无法获得算力</p><p>2、若订单使用红包或购物券后佣金有可能支付给红包推广者而没有算力</p>',
					messageAlign: 'left'
				})
			}
			var loadDateTime = new Date()
			let timer = window.setTimeout(function () {
				var timeOutDateTime = new Date()
				if (timeOutDateTime - loadDateTime < 5000) {
					Toast(`请先下载${platformName}App`)
					// console.log(1)
					window.clearTimeout(timer)
				} else {
					window.close()
				}
				// console.log(1)
			}, 3000)
			window.location.href = taoBaoUrl[urlTitle]
		}

		// 品类
		const getGridId = item => {
			// console.log(item)
			push({ name: item.to, query: { ...item } })
		}

		const goShopping = item => {
			const url = 'taobao:' + (item.coupon_share_url ? item.coupon_share_url : item.url)
			// if (this.$evnIsBrowser) {
			var loadDateTime = new Date()
			let timer = window.setTimeout(function () {
				var timeOutDateTime = new Date()
				if (timeOutDateTime - loadDateTime < 5000) {
					Toast(`请先下载淘宝App`)
					window.clearTimeout(timer)
				} else {
					window.close()
				}
			}, 3000)
			window.location.href = url
			// } else {
			// 	const options = {
			// 		title: `跳转到淘宝APP`,
			// 		url: url
			// 	}
			// 	sc.openApp(options, (result) => {
			// 		if (!(result && result.status === 200)) {
			// 			Toast('没有安装淘宝APP', JSON.stringify(result))
			// 		}
			// 	})
			// }
		}
		// const adCb = result => {
		// 	addAdvertising({ adCode: result }).then(res => {
		// 		// console.log(res)
		// 	})
		// }
		// 扫一扫回调
		const scanRes = res => {
			const strArr = res.split('?id=')

			// 如果是支付码
			if (strArr[0] === 'http://slpay.2qzs.com/slpay/index.html#/payDetail') {
				let subArr = strArr[1].split('&mqcCode=')
				let params = {
					id: subArr[0],
					mqcCode: subArr[1]
				}
				push({ name: 'PayForShop', query: params })
			}
			// 如果是钱包二维码
			else if (/^0xzs00/.test(res) && res.length === 40) {
				push({ path: '/mine/property/transferFromScan', query: { res } })
			}
			// 如果是url(暂时粗略的判断一下头部)
			else if (/^https?:\/\//.test(res)) {
				slb.openAgentManagerUrl(res)
			}
			// 啥也不是
			else {
				push({ name: 'ScanRes', query: { res } })
			}
		}

		const topListNav = computed(() => {
			return data.topList.filter(item => item.isShow)
		})

		return {
			...toRefs(data),
			// gainTAAListNav,
			topListNav,
			offSetTop,
			activeTab,
			list,
			loading,
			finished,
			onload,
			changeImg,
			goPlatform,
			// goGainTAA,
			topFunc,
			goTaoBao,
			getGridId,
			goShopping,
			calcSie,
			t
		}
	}
})
</script>
<style lang="less" scoped>
@import '../assets/css/local.less';
.home {
	header {
		background: linear-gradient(180deg, @primaryColor 0%, @primaryColor 100%);
		// height: 450 * @fontSize;
		// padding: 0 36 * @fontSize;
		.search {
			// margin-top: 70 * @fontSize;
		}

		.tabs {
			color: #fff;
			.tabs-tab {
				font-size: 28 * @fontSize;
				color: #fff;
			}
		}
		// 解決垂直邊界重合問題
		&::before {
			content: '';
			display: table;
		}
	}
	.search-bottom {
		padding: 20 * @fontSize 82 * @fontSize;
		color: #fff;
		text-align: center;
		box-sizing: border-box;
		// line-height: 32 * @fontSize;
		// width: 100%;
		height: 166 * @fontSize;
		// background: linear-gradient(180deg, @primaryColor 0%, @primaryColor 100%);
		background-image: url('http://mg.2qzs.com/img/slbApp/login/mine-bg.png');
		background-size: cover;
		background-repeat: no-repeat;
		i {
			// width: 96 * @fontSize;
			// height: 96 * @fontSize;
			font-size: 72 * @fontSize;
		}
		p {
			margin-top: 20 * @fontSize;
			font-size: 24 * @fontSize;
		}
	}
	// 轮播
	.my-swipe {
		margin-top: -160 * @fontSize;
		padding: 0 20 * @fontSize;
		text-align: center;
		height: 262 * @fontSize;
		img {
			width: 100%;
		}
	}
	// 導航
	.nav-content {
		padding: 20 * @fontSize;
		color: #060606;
		.nav-container {
			border-radius: 5px;
			background: #fff;
			font-size: 24 * @fontSize;
		}
		.gaintaa-list {
			font-weight: 400;
			// border-radius: 5px;
			padding: 20 * @fontSize 40 * @fontSize;
			& > div {
				width: 25%;
				text-align: center;
				.van-image {
					width: 102 * @fontSize;
				}
			}
		}
		.platform-list {
			// background: #fff;
			font-size: 24 * @fontSize;
			// border-radius: 5px;
			padding-bottom: 20 * @fontSize;
			flex-wrap: wrap;
			& > div {
				margin-top: 20 * @fontSize;
				width: 20%;
				text-align: center;
				.van-image {
					width: 80 * @fontSize;
				}
			}
		}
	}
	// 购物轮播
	.mx-notice {
		padding: 0 20 * @fontSize;
		.notice-swipe {
			height: 40px;
			line-height: 40px;
			color: #000;
		}
	}
	// 理財入口
	.lc-index {
		// margin: 20 * @fontSize 0;
		padding: 20 * @fontSize;
		// background: #fff;
		img {
			border-radius: 5px;
		}
	}
	// 优惠热销
	.benifit {
		padding: 0 20 * @fontSize;
		.benifit-container {
			background: #fff;
			border-radius: 5 * @fontSize;
			padding: 10 * @fontSize;
			box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.14);
			height: 352 * @fontSize;
			.tehui {
				background: linear-gradient(180deg, #fff1eb 100%, #ffd4be 100%);
				color: #000;
				border-radius: 5 * @fontSize;
				font-size: 12 * @fontSize;
				width: 50%;
				height: 100%;
				box-sizing: border-box;
				// padding-left: 5 * @fontSize;
				& > div {
					height: 315 * @fontSize;
					width: 100%;
					background-image: url('http://mg.2qzs.com/img/slbApp/home/9.9.png');
					background-size: contain;
					background-position: center;
					background-repeat: no-repeat;
					padding-left: 25 * @fontSize;
					padding-top: 15 * @fontSize;
					& > p:nth-child(1) {
						font-size: 32 * @fontSize;
						font-weight: bold;
						line-height: 48 * @fontSize;
						color: #f66343;
					}
					& > p:nth-child(2) {
						font-size: 24 * @fontSize;
						font-weight: bold;
						line-height: 48 * @fontSize;
						color: #a58171;
					}
					& > p:nth-child(3) {
						font-size: 20 * @fontSize;
						font-weight: bold;
						line-height: 48 * @fontSize;
						background: #fff;
						width: 50%;
						text-align: center;
						border-radius: 20px;
						color: #ff0000;
					}
				}
			}
			.benifit-top {
				// margin-left: 5*@fontSize;
				width: 50%;
				height: 100%;
				flex-direction: column;
				& > div {
					// width: 100%;
					height: 50%;
					padding: 0 20 * @fontSize;
					border-radius: 5 * @fontSize;
				}
				& > div:nth-child(1) {
					background: linear-gradient(360deg, #ffc0dc 0%, #ffeced 100%);
					.van-image {
						height: 115 * @fontSize;
						width: 115 * @fontSize;
					}
					p:nth-child(1) {
						font-size: 32 * @fontSize;
						font-weight: bold;
						color: #e32722;
					}
					p:nth-child(2) {
						font-size: 24 * @fontSize;
						font-weight: bold;
						color: #000;
					}
				}
				& > div:nth-child(2) {
					margin-top: 5 * @fontSize;
					.van-image {
						height: 98 * @fontSize;
						width: 98 * @fontSize;
					}
					p:nth-child(1) {
						font-size: 32 * @fontSize;
						font-weight: bold;
						color: #226fc4;
					}
					p:nth-child(2) {
						font-size: 24 * @fontSize;
						font-weight: bold;
						color: #8fafd2;
					}
					background: linear-gradient(360deg, #ecf8ff 0%, #bfddff 100%);
				}
			}
		}
	}
	.cat-list {
		// margin-top: 5 * @fontSize;
		padding: 20 * @fontSize;
		.cat-container {
			background: #fff;
			border-radius: 10 * @fontSize;
			padding: 20 * @fontSize;
			box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.14);
			.cat-title {
				font-size: 32 * @fontSize;
				font-weight: bold;
				span {
					padding-left: 20 * @fontSize;
					color: rgba(0, 0, 0, 0.3);
					font-size: 24 * @fontSize;
				}
			}
			.cat-top {
				display: flex;
				align-content: flex-start;
				flex-wrap: wrap;
				margin-top: 10 * @fontSize;
				text-align: center;
				& > div {
					width: 210 * @fontSize;
					height: 210 * @fontSize;
					background-repeat: no-repeat;
					background-size: 50%;
					background-position: 50% 100%;
					padding-top: 10 * @fontSize;
					p:nth-child(1) {
						font-size: 28 * @fontSize;
					}
					p:nth-child(2) {
						font-size: 20 * @fontSize;
						color: rgba(0, 0, 0, 0.3);
					}
					div {
						height: 96 * @fontSize;
						margin-top: 10 * @fontSize;
						img {
							height: 100%;
						}
					}
				}
			}
		}
	}
	// 熱門推薦
	// .hot-section {
	.hot-recom {
		margin-top: 20 * @fontSize;
		padding: 0 20 * @fontSize;
		.hot-title {
			font-size: 34 * @fontSize;
			font-family: PingFang SC;
			font-weight: bold;
			line-height: 51 * @fontSize;
			color: #06121e;
			opacity: 1;
		}
		.hot-content {
			height: 84 * @fontSize;
			background-image: url('http://mg.2qzs.com/img/slbApp/home/tj-title.png');
			background-size: 100%;
			background-repeat: no-repeat;
			color: #fff;
			padding: 0 20 * @fontSize;
			& > div {
				p:nth-child(1) {
					font-size: 30 * @fontSize;
				}
				p:nth-child(2) {
					font-size: 20 * @fontSize;
					margin-left: 30 * @fontSize;
				}
			}
			& > p:nth-child(2) {
				background: #fab848;
				width: 113 * @fontSize;
				text-align: center;
				border-radius: 24px;
			}
		}
	}
	// }
	// 產品列表
	.list {
		padding: 20 * @fontSize;
		.item {
			font-size: 24 * @fontSize;
			background: #fff;
			// height: 300 * @fontSize;
			// width: 100%;
			padding: 20 * @fontSize;
			margin-top: 20 * @fontSize;
			align-items: flex-start;
			border-radius: 5px;
			&-left {
				width: 36%;
				// width: 260 * @fontSize;
				// height: 260 * @fontSize;
				img {
					// height: 100%;
					width: 100%;
				}
			}
			&-right {
				width: 64%;
				margin-left: 10 * @fontSize;
				font-size: 24 * @fontSize;
				font-weight: 400;
				line-height: 40 * @fontSize;
				.goods-title {
					width: 100%;
				}
				.shop-title,
				.volume {
					color: #999;
				}
				.return-power {
					margin-top: 15 * @fontSize;
					color: #f00;
				}
				.price-content {
					align-items: flex-end;
					margin-top: 30 * @fontSize;
					.price {
						font-size: 32 * @fontSize;
						font-weight: bold;
						color: #ef0401;
						&:before {
							content: '￥';
							display: inline-block;
							font-size: 24 * @fontSize;
						}
					}
					.go-buy {
						width: 150 * @fontSize;
						line-height: 60 * @fontSize;
						height: 60 * @fontSize;
						color: #fff;
						text-align: center;
						border-radius: 5px;
						background: linear-gradient(90deg, #fc346e 0%, #fb0201 100%);
					}
				}
			}
		}
	}
	// 每个类别标题
	.main-title {
		img {
			width: 10 * @fontSize;
			margin-right: 20 * @fontSize;
			// height: 40*@s;
		}
	}
}
</style>
