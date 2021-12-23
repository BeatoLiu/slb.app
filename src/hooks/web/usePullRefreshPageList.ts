import { httpRequest } from "@/apis/axios"
import { IBasePageParams, IBaseResPageList } from "@/apis/model/base"
import { IPullRefreshListRes } from "@/apis/model/commonModel"
import { Method } from "axios"
// import { stringify } from "qs"
import { onDeactivated, onUnmounted, ref } from "vue"

interface optionsType {
    method: Method;
    // 是否要loading
    showLoading?: boolean,
    // 接口地址
    type?: string;
}
/**
 * @description 用於下拉刷新和無限加載列表（數據有分頁）(其實我也不知道這個范型要怎麼弄，各種試，花了一下午，僅是沒報錯，還不甚理解)
 * @param api 請求路徑
 * @param p 請求參數，各頁面不盡相同
 * @param options
 * @returns 返回組件所需屬性及頁面渲染所需數據dataList
 */
export function usePullRefreshPageList<V, K extends IBasePageParams>(api: string, p: K, options: optionsType = { method: 'GET' }): IPullRefreshListRes<V> {
    // 是否處於加載狀態中（下拉）
    const refreshing = ref(false)
    // 是否處於加載狀態（List）
    const loading = ref(false)
    // 是否已加載完成
    const finished = ref(false)
    // 接口返回數據列表
    const dataList = ref<V[]>([])
    // 記錄總條數
    const total = ref(0)
    // !定義一個定時器(有的組件(ShowSelfTaoKeOrder)在離開時List會觸發一次load事件,還不知道是怎麼回事。用定時器，可以在組件銷毀時，去除定時器，便可不用調用load裏的接口)
    const timer = ref(0)
    // 獲取數據
    const getData = async () => {
        const res = await httpRequest<IBaseResPageList<V>>(options.method, api, p, options)

        loading.value = false
        if (res.resultCode === 1) {
            res.data.dataIn.forEach((item: any) => {
                dataList.value.push(item as never)
            })
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
        // console.log(1111)
        timer.value = window.setTimeout(() => {
            p.pageNum++
            loading.value = true
            getData()
        }, 500)
    }
    onUnmounted(() => {
        // console.log('unmounted')
        window.clearTimeout(timer.value)
    })
    onDeactivated(() => {
        // console.log('deactivated')
        window.clearTimeout(timer.value)
    })
    return {
        refreshing,
        loading,
        finished,
        dataList,
        onRefresh,
        onLoad
    } as IPullRefreshListRes<V>
}
