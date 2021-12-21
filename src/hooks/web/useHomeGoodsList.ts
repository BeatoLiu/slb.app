import { reactive, ref } from "vue";

import { showTaoKeGoodsFromApi } from '@/apis/taoKe'

export const useHomeGoodsList = () => {
    const loading = ref(false)
    const finished = ref(false)
    const list = reactive([])
    const params = reactive({
        sortType: 'total_sales', // 销量（total_sales），淘客佣金比率（tk_rate）， 累计推广量（tk_total_sales），总支出佣金（tk_total_commi），价格（price
        sortPattern: 'des', // des（降序）,asc（升序） (ortType不为空时候，不能为空)
        pageNum: 0,
        gName: '',
        pageSize: 10,
        hasCoupon: false
    })

    const getData = () => {
		params.pageNum++
        showTaoKeGoodsFromApi(params).then(res => {
            // 加载状态结束
            // console.log(JSON.parse(res.data))
            loading.value = false
            if (res.resultCode === 1) {
                const resData = res.data ? JSON.parse(res.data as string) : {}
                // console.log(resData.result_list.map_data)
                if (resData.result_list && resData.result_list.map_data) {
                    // data.list = data.list.concat(resData.result_list.map_data)
                    resData.result_list.map_data.forEach((item: any) => {
                        list.push(item as never)
                    })
                    // 本想用解构，但因有类型问题，而本菜鸡又不知道怎么解决，只好用上面的方法了
                    // list.push(...resData.result_list.map_data)
                    const total = resData.total_results
                    // 数据全部加载完成
                    if (list.length >= total) {
                        finished.value = true
                    }
                }
                // console.log(data.list)
            }
        })
    }
    // const { list, loading, finished } = data
    return { list, loading, finished, getData }
}
