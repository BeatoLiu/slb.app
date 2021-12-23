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
					<div v-for="item in dataList" :key="item.boCode">
						<p>【TAA：{{ item.orderBonus }}】</p>
						<div class="flex-space">
							<p>订单编号：{{ item.boCode }}</p>
							<p>日释放：{{ item.orderBonusPerDay }}</p>
						</div>
						<div class="flex-space">
							<p>{{ item.createTime }}</p>
							——
							<p>{{ item.orderEndTime }}</p>
							<!-- <p>应得：{{ item.orderPayFactSum }}</p> -->
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
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch } from 'vue'
import { Sticky, PullRefresh, List,  Calendar } from 'vant'

import { ISelectBenefitOrderListItem, ISelectBenefitOrderListModel } from '@/apis/model/tAAModel'
import { usePullRefreshPageList } from '@/hooks/web/usePullRefreshPageList'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'
import { useTimeParam } from '@/hooks/web/useTimeParam'
import { selectBenefitOrderListSum } from '@/apis/tAA'
export default defineComponent({
	name: 'BankTransOrderSUSD',
	components: {
		Calendar,
		List,
		PullRefresh,
		Sticky
	},
	setup() {
		const { offSetTop } = useOffSetTop()
		const { getFormatTime, getTimeParams } = useTimeParam()
		const daysInfo = reactive({
			total: 0,
			orderBonus: 0
		})
		const dateDisplay = ref('')
		const showTime = ref(false)
		const minDate = ref(new Date('2021/09/1'))
		const maxDate = ref(new Date())
		const idx = ref(0)
		const params = reactive<ISelectBenefitOrderListModel>({
			pageSize: 10,
			pageNum: 0,
			startTime: '',
			endTime: '',
			boCode: -1,
			bizOrderCode: -1
			// orderType: 1
		})
		onMounted(() => {
			const { startTime, endTime, timeStr } = getTimeParams(6)
			dateDisplay.value = timeStr
			params.startTime = startTime
			params.endTime = endTime

			getSum()
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = usePullRefreshPageList<
			ISelectBenefitOrderListItem,
			ISelectBenefitOrderListModel
		>('taa/selectBenefitOrderList', params, { method: 'POST' })

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
			selectBenefitOrderListSum(params).then(res => {
				console.log(res)
				if (res.resultCode === 1) {
					daysInfo.total = res.data[0].total
					daysInfo.orderBonus = res.data[0].orderBonus
				}
			})
		}

		watch(refreshing, options => {
			// console.log(options)
			if (options) {
				getSum()
			}
		})
		return {
			daysInfo,
			dateDisplay,
			showTime,
			minDate,
			maxDate,
			idx,
			offSetTop,
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			onConfirm
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
		background-color: #fc3e38;
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
