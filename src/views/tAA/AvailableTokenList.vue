<template>
	<div class="bank-order-list">
		<Sticky :offset-top="offSetTop">
			<div class="top">
				<div class="flex-space" style="padding-top: 10px">
					<div class="balance">
						<p>{{ daysInfo.total }}笔</p>
						<p>记录</p>
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
			<Tabs v-model:active="active">
				<Tab title="全部" :name="-1"></Tab>
				<Tab title="消费赠送" :name="1"></Tab>
				<Tab title="生态建设" :name="2"></Tab>
				<Tab title="节点赠送" :name="3"></Tab>
				<Tab title="分红奖励" :name="4"></Tab>
				<Tab title="空投奖励" :name="5"></Tab>
			</Tabs>
		</Sticky>
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<div class="list">
				<!-- <div class="title">为你推荐</div> -->
				<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<div v-for="(item, idx) in dataList" :key="idx">
						<p>【TAA：{{ item.tokenSum }}】</p>
						<!-- v-if="active" -->
						<div>
							<div class="flex-space">
								<p>订单编号：{{ item.ptCode }}</p>
								<!-- <p>签到时间：{{ item.atdSignDate }}</p> -->
							</div>
							<div class="flex-space">
								<p :class="{ success: item.unlockSetStatus === 2, failed: item.unlockSetStatus === 3 }">
									订单状态：{{ item.unlockSetStatusName }}
								</p>
								<p>{{ item.unlockTime }}</p>
							</div>
						</div>
						<!-- <div v-else>
							<div class="flex-space">
								<p>签到日期：{{ item.createTime }}</p>
							</div>
						</div> -->
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
import { Sticky, PullRefresh, List, Calendar, Tabs, Tab } from 'vant'
// import {
// 	selectAvailableTokenListItem,
// 	selectAvailableTokenListModel,
// 	selectBenefitOrderListModel
// } from '../../apis/model/tAAModel'
import { usePullRefreshPageList } from '@/hooks/web/usePullRefreshPageList'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'
import { useTimeParam } from '@/hooks/web/useTimeParam'
import { selectSignTokenTempTotalListSum } from '@/apis/tAA'
import { ISelectSignTokenTempTotalListItem, ISelectSignTokenTempTotalListModel } from '@/apis/model/tAAModel'
export default defineComponent({
	name: 'AvailableTokenList',
	components: {
		Calendar,
		List,
		PullRefresh,
		Sticky,
		Tabs,
		Tab
	},
	setup() {
		const { offSetTop } = useOffSetTop()
		const { getTimeParams, getFormatTime } = useTimeParam()

		const active = ref(0)
		const daysInfo = reactive({
			total: 0,
			orderBonus: 0
		})
		const dateDisplay = ref('')
		const showTime = ref(false)
		const minDate = ref(new Date('2021/09/25'))
		const maxDate = ref(new Date())
		const idx = ref(0)
		const params = reactive({
			pageSize: 10,
			pageNum: 0,
			startTime: '',
			endTime: '',
			// ttCode: -1,
			// atdCode: -1,
			tokenDescType: -1, //  taa分类: 1消费赠送(会员消费、商家消费)  2生态建设  3节点赠送  4分红奖励  5空投奖励
			unlockSetStatus: -1
			// atdStatusList: null
		})
		onMounted(() => {
			const { startTime, endTime, timeStr } = getTimeParams(6, true)
			dateDisplay.value = timeStr
			params.startTime = startTime
			params.endTime = endTime

			getSum()
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = usePullRefreshPageList<
			ISelectSignTokenTempTotalListItem,
			ISelectSignTokenTempTotalListModel
		>('taa/selectSignTokenTempTotalList', params, { method: 'POST' })

		// 選擇時間
		const onConfirm = (date: Date[]) => {
			showTime.value = false
			const [start, end] = date
			const { startTime, endTime, timeStr } = getFormatTime(start, end, true)
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
			selectSignTokenTempTotalListSum(params).then(res => {
				if (res.resultCode === 1) {
					daysInfo.total = res.data[0].total
					daysInfo.orderBonus = res.data[0].tokenSum
				}
			})
		}

		watch(refreshing, options => {
			// console.log(options)
			if (options) {
				getSum()
			}
		})
		watch(active, newValue => {
			params.tokenDescType = newValue
			onRefresh()
			getSum()
		})
		return {
			active,
			dateDisplay,
			daysInfo,
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
		.success {
			color: #19be6b;
		}
		.failed {
			color: #ee0a24;
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
