import { defineComponent, reactive, ref } from 'vue'
import { Tabbar, TabbarItem } from 'vant'
import slb from '@/utils/jslb-1.0.0'
import { assetsOrigin, locationOrigin } from '@/utils/config'

export default defineComponent({
	name: 'MrJo',
	setup() {
		const navList = reactive([
			{ to: { name: 'MrJo' }, title: '首页', icon: 'home-o' },
			{ to: '/slmer/index.html', title: '我的', icon: 'user-o' }
		])
		const handleClick = (path: string | Record<string, string>) => {
			if (typeof path === 'string') {
				slb.openAgentManagerUrl(locationOrigin + path)
			}
		}
		const active = ref(0)
		return () => (
			<div>
				<img
					src={assetsOrigin + '/img/slbApp/slb-plus/mr-jo.jpg'}
					alt="乔老爷酒业简介"
					style={{ marginBottom: '50px' }}
				/>
				<Tabbar active-color="#39b9b9" v-model={active.value}>
					{navList.map(item => {
						return (
							// 如果要使route模式生效，貌似只能to={{ name: item.name }}，其它诸如to='/mine,to={path: 'Mine'}的写法都不行
							<TabbarItem key={item.title} icon={item.icon} onClick={() => handleClick(item.to)}>
								{item.title}
							</TabbarItem>
						)
					})}
				</Tabbar>
			</div>
		)
	}
})
