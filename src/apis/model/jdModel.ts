import { IBaseResList, IBaseResT } from "./base";

export interface ISku {
    sku: number
}


export interface IGetProductDetailStyleModel extends ISku {
    queryExts: string[]
}


export interface IGetProductSkuImageMode {
    skuIdList: number[]
}
export interface IGetProductSkuImageItem {
    id: number;
    path: string;
    isPrimary: number;
    orderSort: number
}
interface IGetProductSkuImageInfo {
    [key: string]: IGetProductSkuImageItem[]
}
export type IGetProductSkuImageRes = IBaseResT<IGetProductSkuImageInfo>
