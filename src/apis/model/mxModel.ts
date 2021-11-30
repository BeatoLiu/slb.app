import { basePageParams, baseResList, baseResPageList, baseResT } from './base'

// 具體規格描述
interface paramsItem {
    pcdSubCode: number;
    pcdSubName: string;
    input: string;
    pcName: string;
}
// 規格描述
export interface prdCsSkuCollectionItem {
    pcName: string;
    pcCode: number;
    // pcdSubCode: number;
    pcSourceType: number;

    params: paramsItem[]
}
/**
 * 
 */
export type showMemberCommodityModel = basePageParams & {
    cInvestType?: number; //
    cAuditStatus: number; // 审核状态
    cName?: string;
    ccRelation?: string
}
export interface showMemberCommodityItem {
    createTime: string;
    cPrice: number;
    cShowPrice: number;
    mCode: number;
    mName: string;
    sePower: string;
    cCode: number;
    cPicName: string;
    cName: string;
    cTotalAmount: number;
}
export type showMemberCommodityRes = baseResPageList<showMemberCommodityItem>


export interface cDetailPicItem {
    utPath: string;
    utCode: number;
}
export interface csbListItem {
    csPrice: number;
    csPrice1: number;
    csPrice2: number;
    csPrice3: number;
    csWholesalePrice: number;
    csPointPrice: number;
    csStockAmount: number;
    cCode: number;
    csCode: number;
    csPicName: string;
    csSkuCollection: prdCsSkuCollectionItem[];
}
/**
 * 商品详情
 */
export interface showCommodityDetailInfo extends showMemberCommodityItem {

    cUnitPrice: number;
    cWholesalePrice: number;
    cRecPayType: string;
    cStockAmount: number;
    cDetailPic: cDetailPicItem[];
    cSpuCollection: prdCsSkuCollectionItem[];
    csbList: csbListItem[]
}
export type showCommodityDetailRes = baseResT<showCommodityDetailInfo>
/**
 * @description 會員的秘選訂單列表
 * @param payStatus 支付狀態
 * @param oStatus 訂單狀態
 */
export type showSelfOrderDetailModel = basePageParams & {
    payStatus: number; //
    oStatus: number // 审核状态
}
// 會員秘選訂單記錄信息
export interface showSelfOrderDetailItem {
    podCode: number;
    poCode: number;
    prdCCode: number;
    mName: string;
    podStatusName: string;
    prdCsPicName: string;
    prdCName: string;
    className: string;
    pointMCode: number;
    pointNumber: number;
    prdCount: number;
    prdSum: number;
    orderPayTypeName: string;
    podStatus: number,
    prdCsSkuCollection: prdCsSkuCollectionItem[]
}

/**
 * @description 確認收貨
 * @param podCode 訂單編號
 */
export interface confirmTakeDeliveryModel {
    podCode: number
}

// 订单详情
export interface getMallPrdOrderDetailMode {
    podCode: number;
}
export interface getMallPrdOrderDetailItem extends showSelfOrderDetailItem {
    podRemark: string;
    prdSentTime: string;
    prdReceivedTime: string;
    prdFactSum: number;
    prdPrice: number;
    prdType: number;
    poMobile: string;
    poLinkName: string;
    poAddr: string;
    createTime: string;
    orderPayType: number,

}
export type getMallPrdOrderDetailRes = baseResT<getMallPrdOrderDetailItem>

// 退款
export interface insertRefundOrderModel {
    podCode: number; // 产品编号
    roType: number; // 退货类型
    roRecType: number; // 是否已收货
    roReasonType: string, // 退货原因
    remark: string, //  备注
}

// 商品分類類型列表
export interface showCommodityClassFilterItem {
    ccCode: number;
    pCcCode: number;
    ccType: number;
    ccName: string;
    ccRelation: string;
    ccRation: number
}
export type showCommodityClassFilterRes = baseResList<showCommodityClassFilterItem>