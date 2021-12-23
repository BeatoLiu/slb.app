import { IPrdCsSkuCollectionItem } from "@/apis/model/mxModel"

/**
 * @description 拼接商品的規格名稱
 */
export const useSkuName = () => {
    /**
     *
     * @param prdCsSkuCollection 商品規格集合
     * @returns 商品規格名稱拼接成的字符串
     */
    const skuName = (prdCsSkuCollection: Array<IPrdCsSkuCollectionItem>) => {
        let text = ''
        prdCsSkuCollection.forEach(i => {
            text = text + i.params[0].pcdSubName + ' '
        })
        return text
    }

    return { skuName }
}
