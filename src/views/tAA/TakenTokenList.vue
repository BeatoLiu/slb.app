<template>
	<div class="bank-order-list">
		<Sticky :offset-top="offSetTop">
			<div class="top">
				<div class="flex-space" style="padding-top: 10px">
					<div class="balance">
						<p>{{ daysInfo.total }}笔</p>
						<p>订单</p>
					</div>
					<div class="withdraw">
						<p>{{ daysInfo.orderBonus }}</p>
						<p>TAA</p>
					</div>
				</div>
				<div class="time flex-space" @click="showTime = true">
					<div class="balance">选择日期区间</div>
					<div class="withdraw">{{ dateDisplay }}</div>
				</div>
			</div>
		</Sticky>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<!-- <div class="title">为你推荐</div> -->
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<div v-for="item in dataList" :key="item.ttCode">
						<p>【TAA：{{ item.ttSum }}】</p>
						<div class="flex-space">
							<p>订单编号：{{ item.ttCode }}</p>
							<p>提T时间：{{ item.createTime }}</p>
						</div>
						<div class="flex-space">
							<p>提T状态：{{ item.ttSetStatusName }}</p>
							<!-- <p>{{ item.ttSetStatus }}</p> -->
							<Button
								type="primary"
								size="small"
								@click="singleWithdraw(item.ttCode)"
								v-if="!item.ttSetStatus"
								>提T</Button
							>
						</div>
					</div>
				</List>
			</div>
		</PullRefresh>
		<Calendar
			allow-same-day
			v-model:show="showTime"
			:min-date="minDate"
			:max-date="maxDate"
			type="range"
			@confirm="onConfirm"
		/>
		<!-- 支付 -->
		<!-- <WithdrawPayComponent :show="showComponent" @close="close" :ttCode="chooseTtCode" /> -->
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch } from 'vue'
import { Sticky, PullRefresh, List, Button, Calendar, Toast } from 'vant'
import { ISelectTakenTokenListItem, ISelectTakenTokenListModel } from '@/apis/model/tAAModel'
import { usePullRefreshPageList } from '@/hooks/web/usePullRefreshPageList'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'
import { useTimeParam } from '@/hooks/web/useTimeParam'
import { selectTakeTokenDetailListSum, singleOnlinePay, singleWithdrawal } from '@/apis/tAA'

export default defineComponent({
	name: 'SelectTakenTokenList',
	components: {
		Button,
		Calendar,
		List,
		PullRefresh,
		Sticky
		// WithdrawPayComponent
	},
	setup() {
		const { offSetTop } = useOffSetTop()
		const { getFormatTime, getTimeParams } = useTimeParam()

		// 显示支付
		const showComponent = ref(false)
		// 订单统计
		const daysInfo = reactive({
			total: 0,
			orderBonus: 0
		})
		// 时间
		const dateDisplay = ref('')
		// 选择时间Model
		const showTime = ref(false)
		const minDate = ref(new Date('2021/09/1'))
		const maxDate = ref(new Date())
		const chooseTtCode = ref(0)
		const params = reactive<ISelectTakenTokenListModel>({
			pageSize: 10,
			pageNum: 0,
			startTime: '',
			endTime: '',
			ttCode: -1,
			ttSetStatus: -1
		})
		onMounted(() => {
			const { startTime, endTime, timeStr } = getTimeParams(6)
			dateDisplay.value = timeStr
			params.startTime = startTime
			params.endTime = endTime

			getSum()
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = usePullRefreshPageList<
			ISelectTakenTokenListItem,
			ISelectTakenTokenListModel
		>('taa/selectTakeTokenDetailList', params, { method: 'GET' })

		// 選擇時間
		const onConfirm = (date: Date[]) => {
			showTime.value = false
			const [start, end] = date
			const { startTime, endTime, timeStr } = getFormatTime(start, end)
			dateDisplay.value = timeStr
			params.startTime = startTime
			params.endTime = endTime
			params.pageNum = 0
			loading.value = true
			finished.value = false
			onRefresh()
		}
		// 相應條件下訂單的總額
		const getSum = () => {
			selectTakeTokenDetailListSum(params).then(res => {
				if (res.resultCode === 1) {
					daysInfo.total = res.data[0].total
					daysInfo.orderBonus = res.data[0].ttSum
				}
			})
		}

		watch(refreshing, options => {
			// console.log(options)
			if (options) {
				getSum()
			}
		})
		// 提币
		const singleWithdraw = (ttCode: number) => {
			singleWithdrawal({ ttCode }).then(res => {
				if (res.resultCode === 1) {
					Toast('操作成功')
					onRefresh()
				} else if (res.resultCode === 2) {
					singleOnlinePay({ ttCode }).then(res => {
						if (res.resultCode === 1) {
							Toast('操作成功')
							onRefresh()
						}
					})
				}
			})
		}
		// const close = () => {
		// 	showComponent.value = false
		// }
		return {
			dateDisplay,
			showComponent,
			daysInfo,
			showTime,
			minDate,
			maxDate,
			chooseTtCode,
			offSetTop,
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			onConfirm,
			singleWithdraw
			// close
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.bank-order-list {
	.top {
		height: 200 * @fontSize;
		color: #fff;
		text-align: center;
		background-color: #5cc8b8;
		.balance {
			margin-left: 50 * @fontSize;
		}
		.withdraw {
			margin-right: 50 * @fontSize;
		}
		.time {
			padding: 10px 0;
			color: #fff;
			background-color: transparent;
			// margin-top: 40 * @fontSize;
		}
	}
	.van-list {
		& > div {
			margin-top: 20 * @fontSize;
			padding: 20 * @fontSize;
			background: #fff;
			p {
				padding: 10 * @fontSize 0;
				color: #999;
			}
			& > p:nth-child(1) {
				color: #000;
				font-size: 32 * @fontSize;
				border-bottom: 1px solid #f4f4f4;
			}
		}
	}
	.img-item {
		padding-top: 20 * @fontSize;
		border-top: 1px solid #ebedf0;
		border-bottom: 1px solid #ebedf0;
		p {
			margin-right: 40 * @fontSize;
		}
	}
}
</style>
