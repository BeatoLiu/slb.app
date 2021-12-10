import { baseResList, baseResT } from "./base";

export interface Isku {
    sku: number
}


export interface getProductDetailStyleModel extends Isku {
    queryExts: string[]
}


export interface getProductSkuImageMode {
    skuIdList: number[]
}
export interface getProductSkuImageItem {
    id: number;
    path: string;
    isPrimary: number;
    orderSort: number
}
interface getProductSkuImageInfo {
    [key: string]: getProductSkuImageItem[]
}
export type getProductSkuImageRes = baseResT<getProductSkuImageInfo>
