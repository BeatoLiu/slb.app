import { refreshGetPayOrder } from '@/apis/slb'
import { Button, Icon } from 'vant'
import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import './payResult.less'
import logoImg from '../../assets/img/pay-logo.png'

export default defineComponent({
	name: 'PayResult',
	setup() {
		const data = reactive({
			timer: 0,
			state: 0,
			stateName: '支付中...'
		})
		const { currentRoute, replace } = useRouter()
		const orderCode = (currentRoute.value.query.orderCode as string) || ''
		const goHome = () => {
			replace('/')
		}
		onMounted(() => {
			let count = 0
			data.timer = setInterval(() => {
				if (count < 60) {
					refreshGetPayOrder({ orderCode: +orderCode })
						.then(res => {
							if (res.resultCode === 1) {
								count++
								data.state = res.data.orderPayStatus
								if (res.data.orderPayStatus === 2 || res.data.orderPayStatus === 3) {
									window.clearInterval(data.timer)
								} else if (res.data.orderPayStatus === 1) {
									data.stateName = '支付确认中...'
								}
							} else {
								data.state = -1
								window.clearInterval(data.timer)
							}
						})
						.catch(() => {
							data.state = -1
							window.clearInterval(data.timer)
						})
				} else {
					data.state = -1
					window.clearInterval(data.timer)
				}
			}, 2000)
		})
		onUnmounted(() => {
			window.clearInterval(data.timer)
		})
		return () => {
			const iconName = data.state === 2 ? 'passed' : 'close'
			const className = data.state === 2 ? 'success content' : 'failed content'
			const descText = data.state === 2 ? '支付成功' : '支付失败'
			const btnType = data.state === 2 ? 'primary' : 'danger'
			let el
			if (data.state !== 2 && data.state !== 3 && data.state !== -1) {
				el = (
					<div class="pay-result">
						<div class="content">
							<div>
								<img src={logoImg} alt="" class="img" />
							</div>
							<p class="state-name">{data.stateName}</p>
						</div>
					</div>
				)
			} else {
				el = (
					<div class="pay-result">
						<div class={className}>
							<p>
								<Icon name={iconName} class="success-icon" />
							</p>
							<p class="desc">{descText}</p>
						</div>
						<Button class="btn" type={btnType} size="large" round onClick={goHome}>
							完成
						</Button>
					</div>
				)
			}
			return el
		}
	}
})
