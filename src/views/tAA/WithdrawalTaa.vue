<template>
	<div class="withdraw">
		<div class="top"></div>
		<div class="money-info">
			<div class="balance">
				<p>可提取(TAA)</p>
				<p>{{ balance }}</p>
			</div>
			<div class="submit">
				<Button type="primary" @click="toSign" :disabled="!dis">
					提取TAA{{ counting ? '(' + current.seconds + 's)' : '' }}
				</Button>
			</div>
		</div>
		<div class="page-tips">
			<p class="title">温馨提示：</p>
			<div>
				<!-- <p>1、提T手续费为：1元/次</p> -->
				<p>1、将TAA提取到数联宝资产账户</p>
				<p>2、提T时，会一次性提取所有余额</p>
			</div>
		</div>

		<!-- 支付 -->
		<!-- <WithdrawPayComponent :show="showComponent" @close="close" /> -->
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { Button, Toast } from 'vant'
import { useCountDown } from '@vant/use'
import { canTakeOut, withdrawalTaa } from '../../apis/tAA'
import { canTakeOutModel } from '../../apis/model/tAAModel'
import { useRouter } from 'vue-router'
// import WithdrawPayComponent from './components/WithdrawPayComponent.vue'

export default defineComponent({
	name: 'withdrawalTaa',
	components: {
		Button
		// WithdrawPayComponent
	},
	setup() {
		const balance = ref(0)
		// const showComponent = ref(false)
		// const loading = ref(false)

		const { push } = useRouter()
		const counting = ref(false)
		const countDown = useCountDown({
			time: 10000,
			onFinish: () => {
				counting.value = false
			}
		})

		const params = reactive<canTakeOutModel>({
			// pageSize: 10,
			// pageNum: 0,
			startTime: '',
			endTime: '',
			ttCode: -1,
			atdCode: -1,
			boCode: -1,
			atdStatusList: [1, 0]
		})

		// 可提現餘額
		const getSum = () => {
			canTakeOut(params).then(res => {
				if (res.resultCode === 1) {
					// daysInfo.total = res.data[0].total
					balance.value = res.data || 0
				}
			})
		}

		// const close = () => {
		// 	showComponent.value = false
		// }

		const dis = computed(() => {
			return balance.value && !counting.value
		})

		const toSign = () => {
			// showComponent.value = true
			countDown.start()
			counting.value = true
			withdrawalTaa().then(res => {
				if (res.resultCode === 1) {
					Toast('操作成功')
					push('/slb')
				}
			})
		}

		onMounted(() => {
			const end = new Date()
			const start = new Date('2021/09/1')
			// start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
			params.startTime = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
			params.endTime = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()

			getSum()
		})

		return {
			balance,
			// loading,
			dis,
			counting,
			current: countDown.current,
			// showComponent,
			toSign
			// close
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.withdraw {
	.top {
		height: 400 * @fontSize;
		background: linear-gradient(180deg, #5cc8b8 0%, #5cc8b8 100%);
		border-bottom-right-radius: 40%;
		border-bottom-left-radius: 40%;
	}
	.money-info {
		// display: flex;
		// justify-content: center;
		// align-items: center;
		// height: 440 * @fontSize;
		border-radius: 10px;
		padding: 100 * @fontSize 0;
		margin: -300 * @fontSize 20 * @fontSize 0 20 * @fontSize;
		// text-align: center;
		background: #fff;
		div {
			flex: 1;
			// padding-left: 43*@fontSize;
			text-align: center;
			font-weight: 400;
			p:nth-child(1) {
				font-size: 24 * @fontSize;
			}
			p:nth-child(2) {
				// margin-top: 10*@fontSize;
				font-size: 60 * @fontSize;
				color: #ff0700;
			}
			&:not(:last-child) {
				border-right: 1px solid #e8e8e8;
			}
		}
	}
	.submit {
		margin-top: 30 * @fontSize;
	}
}
</style>
