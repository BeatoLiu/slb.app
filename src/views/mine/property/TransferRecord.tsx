import { ISelectTakenTokenListItem, ISelectTakenTokenListModel } from "@/apis/model/tAAModel"
import { selectTakeTokenDetailListSum } from "@/apis/tAA"
import { useFormatDayMonth } from "@/hooks/web/useFormatDayMonth"
import { useOffSetTop } from "@/hooks/web/useOffSetTop"
import { usePullRefreshPageList } from "@/hooks/web/usePullRefreshPageList"
import { useStore } from "@/store"
import { gold } from "@/utils"
import { Calendar, List, PullRefresh, Sticky } from "vant"
import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue"

import './TransferRecord.less'

interface IExtend {
    ttBizType: number;
    ttCurrencyType: number
}

export default defineComponent({
    name: 'TransferRecord',

    setup() {
        const { offSetTop } = useOffSetTop()
        const { formatDayMonth } = useFormatDayMonth()
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
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            dateDisplay.value = `${formatDayMonth(start)} - ${formatDayMonth(end)}`
            params.startTime = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
            params.endTime = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()

            getSum()
        })
        const { refreshing, loading, finished, dataList, onRefresh, onLoad } =
            usePullRefreshPageList<ISelectTakenTokenListItem, ISelectTakenTokenListModel>('taa/selectTakeTokenDetailList', params, { method: 'GET' })

        // 選擇時間
        const onConfirm = (date: any) => {
            const [start, end] = date
            showTime.value = false
            dateDisplay.value = `${formatDayMonth(start)} - ${formatDayMonth(end)}`
            params.startTime = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate()
            params.endTime = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
            params.pageNum = 0
            loading.value = true
            finished.value = false
            onRefresh()
        }
        // 相應條件下訂單的總額
        const getSum = () => {
            selectTakeTokenDetailListSum(params).then(res => {
                if (res.resultCode === 1) {
                    daysInfo.total = res.data.dataIn[0].total
                    daysInfo.orderBonus = res.data.dataIn[0].ttSum
                }
            })
        }

        watch(refreshing, (options) => {
            // console.log(options)
            if (options) {
                getSum()
            }
        })
        const des = (item: ISelectTakenTokenListItem) => {
            const { ttBizType } = item
            let title = '其它'
            if (ttBizType === 1) {
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
                        <div class="time flex-space" onClick={() => {showTime.value = true}}>
                            <div class="balance">选择日期区间</div>
                            <div class="withdraw">{dateDisplay.value}</div>
                        </div>
                    </div>
                </Sticky>
                <PullRefresh v-model={refreshing.value} onRefresh={onRefresh}>
                    <div class="list">
                        <List v-model={[loading.value, "loading"]} finished={finished.value} finished-text="没有更多了" onLoad={onLoad}>
                            {
                                dataList.value.map(item => (
                                    <div class="list-content" key={item.ttCode}>
                                        <div class="flex-space">
                                            <p class={(item.ttBizType === 6 ? 'title failed' : 'title')}>{des(item)}({item.ttSetStatusName})</p>
                                            <p
                                                class={(item.ttBizType === 3 || item.ttBizType === 5) ? 'gain' : ''}
                                            >
                                                {(item.ttBizType === 3 || item.ttBizType === 5 || item.ttBizType === 6) ? '+' : '-'}{gold(item.ttSum)} {currencyTypeName.value}
                                            </p>
                                        </div>
                                        <div class="flex-space list-bottom">
                                            <p>{item.createTime}</p>
                                            <p>订单：{item.ttCode}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </List>
                    </div>
                </PullRefresh>
                <Calendar
                    allow-same-day
                    v-model={[showTime.value, "show"]}
                    min-date={minDate.value}
                    max-date={maxDate.value}
                    type="range"
                    onConfirm={onConfirm}
                />
            </div>
        )
    }
})
