import { ISelectTakenTokenListItem, ISelectTakenTokenListModel } from '@/apis/model/tAAModel'
import { selectTakeTokenDetailListSum } from '@/apis/tAA'
import { useOffSetTop } from '@/hooks/web/useOffSetTop'
import { usePullRefreshPageList } from '@/hooks/web/usePullRefreshPageList'
import { useStore } from '@/store'
import { gold } from '@/utils'
import { Calendar, List, PullRefresh, Sticky } from 'vant'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'

import './TransferRecord.less'
import { useTimeParam } from '@/hooks/web/useTimeParam'

interface IExtend {
	ttBizType: number
	ttCurrencyType: number
}

export default defineComponent({
	name: 'TransferRecord',
	setup() {
		const { offSetTop } = useOffSetTop()
		// const { formatDayMonth } = useFormatDayMonth()
		const { getTimeParams, getFormatTime } = useTimeParam()
		const store = useStore()
		const currencyType = computed(() => store.state.user.walletBalance.mwCurrencyType)
		const currencyTypeName = computed(() => store.state.user.walletBalance.mwCurrencyTypeName)

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
		// <selectTakenTokenListModel>
		const params = reactive<ISelectTakenTokenListModel & IExtend>({
			pageSize: 10,
			pageNum: 0,
			startTime: '',
			endTime: '',
			ttCode: -1,
			ttSetStatus: -1,
			ttBizType: -1,
			ttCurrencyType: currencyType.value
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
			const [start, end] = date
			showTime.value = false
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
					daysInfo.total = res.data.total
					daysInfo.orderBonus = res.data.ttSum
				}
			})
		}

		watch(refreshing, options => {
			// console.log(options)
			if (options) {
				getSum()
			}
		})
		const des = (item: ISelectTakenTokenListItem) => {
			const { ttBizType } = item
			let title = '其它'
			if (ttBizType === 0) {
				title = '系统释放'
			} else if (ttBizType === 1) {
				title = '转账-转到其它钱包'
			} else if (ttBizType === 2) {
				title = '提T'
			} else if (ttBizType === 3) {
				title = '转账-来自其它钱包'
			} else if (ttBizType === 4) {
				title = '转账-转到会员'
			} else if (ttBizType === 5) {
				title = '转账-来自会员'
			} else if (ttBizType === 6) {
				title = '转账-失败'
			} else if (ttBizType === 14) {
				title = '开通节点质押'
			} else if (ttBizType === 15) {
				title = '质押完成'
			} else if (ttBizType === 16) {
				title = '质押退还'
			}
			return title
		}
		return () => (
			<div class="bank-order-list">
				<Sticky offset-top={offSetTop}>
					<div class="top">
						<div class="flex-space" style="padding-top: 10px">
							<div class="balance">
								<p>{daysInfo.total}笔</p>
								<p>订单</p>
							</div>
							<div class="withdraw">
								{/* <p>{daysInfo.orderBonus}</p> */}
								<p>{currencyTypeName.value}</p>
							</div>
						</div>
						<div
							class="time flex-space"
							onClick={() => {
								showTime.value = true
							}}
						>
							<div class="balance">选择日期区间</div>
							<div class="withdraw">{dateDisplay.value}</div>
						</div>
					</div>
				</Sticky>
				<PullRefresh v-model={refreshing.value} onRefresh={onRefresh}>
					<div class="list">
						<List
							v-model={[loading.value, 'loading']}
							finished={finished.value}
							finished-text="没有更多了"
							onLoad={onLoad}
						>
							{dataList.value.map(item => (
								<div class="list-content" key={item.ttCode}>
									<div class="flex-space">
										<p class={item.ttBizType === 6 ? 'title failed' : 'title'}>
											{des(item)}({item.ttSetStatusName})
										</p>
										<p
											class={
												item.ttBizType === 3 ||
												item.ttBizType === 5 ||
												item.ttBizType === 6 ||
												item.ttBizType === 16
													? 'gain'
													: ''
											}
										>
											{item.ttBizType === 3 ||
											item.ttBizType === 5 ||
											item.ttBizType === 6 ||
											item.ttBizType === 16
												? '+'
												: '-'}
											{gold(item.ttSum)} {currencyTypeName.value}
										</p>
									</div>
									<div class="flex-space list-bottom">
										<p>{item.createTime}</p>
										<p>订单：{item.ttCode}</p>
									</div>
								</div>
							))}
						</List>
					</div>
				</PullRefresh>
				<Calendar
					allow-same-day
					v-model={[showTime.value, 'show']}
					min-date={minDate.value}
					max-date={maxDate.value}
					type="range"
					onConfirm={onConfirm}
				/>
			</div>
		)
	}
})
