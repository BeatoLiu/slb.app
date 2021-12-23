import { IShowMemberCommodityItem, IShowMemberCommodityModel } from "@/apis/model/mxModel"
import { showMemberCommodity } from "@/apis/mx"
import { onDeactivated, onUnmounted, ref } from "vue"


/**
 * @description 用於查詢秘選的商品列表
 * @param p 請求參數，各頁面不盡相同
 * @returns 返回組件所需屬性及頁面渲染所需數據dataList
 */
export function useGoodsList(p: IShowMemberCommodityModel) {
    // console.log(p)
    // 是否處於加載狀態中（下拉）
    const refreshing = ref(false)
    // 是否處於加載狀態（List）
    const loading = ref(false)
    // 是否已加載完成
    const finished = ref(false)
    // 接口返回數據列表
    const dataList = ref<IShowMemberCommodityItem[]>([])
    // 記錄總條數
    const total = ref(0)
    // !定義一個定時器(有的組件(ShowSelfTaoKeOrder)在離開時List會觸發一次load事件,還不知道是怎麼回事。用定時器，可以在組件銷毀時，去除定時器，便可不用調用load裏的接口)
    const timer = ref(0)
    // 獲取數據
    const getData = async () => {
        const res = await showMemberCommodity(p)
        loading.value = false
        if (res.resultCode === 1) {

            dataList.value.push(...res.data.dataIn)
            total.value = res.data.total
            if (dataList.value.length >= total.value) {
                finished.value = true
            }
        } else {
            finished.value = true
        }
    }
    // 下垃操作
    const onRefresh = () => {
        // 清空列表数据
        finished.value = false;

        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        loading.value = true;
        refreshing.value = false
        dataList.value = []
        p.pageNum = 0
        onLoad()
    }
    // 加載列表
    const onLoad = () => {
        timer.value = window.setTimeout(() => {
            p.pageNum++
            loading.value = true
            getData()
        }, 500)
    }
    onUnmounted(() => {
        window.clearTimeout(timer.value)
    })
    onDeactivated(() => {
        window.clearTimeout(timer.value)
    })
    return {
        refreshing,
        loading,
        finished,
        dataList,
        onRefresh,
        onLoad
    }
}
