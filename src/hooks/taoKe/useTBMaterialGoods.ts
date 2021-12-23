// import { httpRequest } from "@/apis/axios"
// import { baseResList } from "@/apis/model/base"
// import { pullRefreshListRes } from "@/apis/model/commonModel"
import { IShowTaoKeGoodsBymaterialIdModel } from "@/apis/model/taoKeModel"
import { showTaoKeGoodsBymaterialId } from "@/apis/taoKe"
// import { Method } from "axios"
import { onUnmounted, ref } from "vue"

/**
 * @description 淘寶淘客根據物料id查詢商品
 * @param p 請求參數，各頁面不盡相同
 * @returns 淘寶淘客根據物料id查詢商品
 */
export function useTBMaterialGoods(p: IShowTaoKeGoodsBymaterialIdModel) {
    // 是否處於加載狀態中（下拉）
    const refreshing = ref(false)
    // 是否處於加載狀態（List）
    const loading = ref(false)
    // 是否已加載完成
    const finished = ref(false)
    // 接口返回數據列表
    const dataList = ref([])
    // 記錄總條數
    const total = ref(0)
    // !定義一個定時器(有的組件(ShowSelfTaoKeOrder)在離開時List會觸發一次load事件,還不知道是怎麼回事。用定時器，可以在組件銷毀時，去除定時器，便可不用調用load裏的接口)
    const timer = ref(0)
    // 獲取數據
    const getData = async () => {
        // let res = await httpGet<baseResList<V>>(api, p)
        const res = await showTaoKeGoodsBymaterialId(p)
        loading.value = false
        if (res.resultCode === 1) {
            const data = res.data ? JSON.parse(res.data) : {}
            data.result_list.map_data.forEach((item: any) => {
                dataList.value.push(item as never)
            })
            total.value = data.total_results
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
        // p.pageNum = 0
        onLoad()
    }
    // 加載列表
    const onLoad = () => {
        // console.log(1111)
        timer.value = window.setTimeout(() => {
            // p.pageNum++
            loading.value = true
            getData()
        }, 500)
    }
    onUnmounted(() => {
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
