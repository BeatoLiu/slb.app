import { useStore } from '@/store'
import { CellGroup, Cell, Toast } from 'vant'
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import slb from './../../utils/jslb-1.0.0'

interface IList {
	title: string
	id: string
	to: string | object
	isShow: boolean
	value?: number | string
}
export default defineComponent({
	name: 'Settings',
	setup() {
		const { replace, push } = useRouter()
		const store = useStore()
		const version = slb.getVersionInfo() || '1.1.0'
		// console.log('------------------------', version)

		const hasWallet = computed(() => store.state.user.userInfo.hasAllianceWalletPwd === '有')
		const list = ref<IList[][]>([
			[
				{
					title: '设置支付密码',
					id: 'setPayPWD',
					to: { name: 'SetPayPWD' },
					isShow: true
				},
				{
					title: '修改支付密码',
					id: 'updatePayPWD',
					to: { name: 'UpdatePayPWD' },
					isShow: true
				}
			],
			[
				{
					title: '清理缓存',
					id: 'clearCache',
					to: '',
					isShow: true
				},
				{
					title: 'clearCacheHistory',
					id: 'clearCacheHistory',
					to: '',
					isShow: false
				},
				{
					title: 'clearCacheFile',
					id: 'clearCacheFile',
					to: '',
					isShow: false
				},
				{
					title: '关于数联宝',
					id: 'getVersionInfo',
					to: '',
					isShow: true,
					value: '版本' + version
				}
			]
		])
		const listNav = computed(() => {
			return list.value.map(item =>
				item.filter(v => {
					if (v.id === 'setPayPWD') {
						return v.isShow && !hasWallet.value
					} else if (v.id === 'updatePayPWD') {
						return v.isShow && hasWallet.value
					} else {
						return v.isShow
					}
				})
			)
		})

		const noLinkList = ref<IList[]>([
			{
				title: '退出登录',
				id: 'logout',
				to: '',
				isShow: true
			}
		])
		const noLinkListNav = computed(() => {
			return noLinkList.value.filter(item => item.isShow)
		})

		const handler = (item: IList) => {
			// 退出登录
			if (item.id === 'logout') {
				localStorage.clear()
				replace('/login')
				// window.location.href =
				// 	process.env.NODE_ENV === 'production' ? localtionOrigin + '/slbApp/index.html' : localtionOrigin + '#login'
			}
			// 清除缓存
			else if (item.id === 'clearCache') {
				// slb.clearCache()
				location.reload()
				Toast('清理中')
			} else if (item.id === 'clearCacheHistory') {
				// slb.clearCache()
				slb.clearCacheHistory('')
			} else if (item.id === 'clearCacheFile') {
				slb.clearCacheFile('')
			} else {
				push(item.to)
			}
		}

		return () => {
			return (
				<div class="pay-list">
					{listNav.value.map(item => {
						return (
							<section style={{ marginTop: '10px' }}>
								<CellGroup>
									{item.map(i => {
										return (
											<Cell
												title={i.title}
												key={i.id}
												class="flex-start"
												is-link
												onClick={() => handler(i)}
											>
												{{
													value: () => <p>{i.value}</p>
												}}
											</Cell>
										)
									})}
								</CellGroup>
							</section>
						)
					})}

					<section style={{ marginTop: '10px' }}>
						<CellGroup>
							{noLinkListNav.value.map(item => {
								return (
									<Cell key={item.id} class="flex-start" clickable onClick={() => handler(item)}>
										{{
											value: () => <p style={{ textAlign: 'center' }}>{item.title}</p>
										}}
									</Cell>
								)
							})}
						</CellGroup>
					</section>
				</div>
			)
		}
	}
})
