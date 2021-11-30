import { basePageParams } from './base'
/**--------------------------------request----------------------------------------------------*/
// 淘宝产品
export type showTaoKeGoodsFromApiModel = basePageParams & {
    sortType: string, // 销量（total_sales），淘客佣金比率（tk_rate）， 累计推广量（tk_total_sales），总支出佣金（tk_total_commi），价格（price
    sortPattern: string, // des（降序）,asc（升序） (ortType不为空时候，不能为空)
    // pageNum: 0,
    gName: string,
    // pageSize: 10,
    hasCoupon: boolean
}

// 淘宝产品(根據物料id查詢)
export type showTaoKeGoodsBymaterialIdModel = basePageParams & {
    materialId: number
}

/**
 * 會員通過我們平臺購買的淘客商品，需要在本平臺錄入訂單
 */
export interface memberCoupleOrderModel {
    orderId: string
}

/**
 * 淘客訂單總算力
 */
export interface showSelfTaokeOrderSumModel {
    oScRetStatus: number
}


/**
 * 會員淘客訂單列表
 */
export type showSelfTaoKeOrderModel = basePageParams & showSelfTaokeOrderSumModel
/**淘客訂單信息 */
export interface showSelfTaoKeOrderItem {
    createTime: string;
    oTaobaoSubId: string;
    gId: string;
    gMainPic: string;
    gName: string;
    oPlatformType: string;
    gSellerShopName: string;
    oPayStatusDesc: string;
    oPlatformSource: number;
    gPrice: number;
    gCount: number;
    oTaobaoOrderId: string;
    oApplyStatus: number;
    oScRetStatusDesc: string;
    oCommissionSum: number;
    oScRetSumMock: number;
    oScRetTime: string
}

/**
 * 京東商品列表
 */
export type showJdGoodsByFromApiModel = basePageParams & {
    keyword: string;
    sortName: string;
    sort: string // desc
}
/**
 * 京東商品列表(物料)
 */
export interface jdGoodsListModel extends basePageParams {
    eliteId: number;
    sortName: string;
    sort: string
}

/**
 * 拼多多商品列表
 */
export type showPddGoodsFromApiModel = basePageParams & {
    keyword: string;
    sortType: number // desc
}


export type vopSelectItemsByKeywordModel = basePageParams & {
    keyword: string;
    fieldName: string; // PRICE
    // sort: 'asc'
    orderType: number
}
export interface vopSelectGoodsListModel extends basePageParams {
    pageNo: number,
    // pageSize: 10,
    fieldName: string, // PRICE
    // sort: 'asc'
    orderType: number,
    channelType: number, // 频道类型:0-超高佣，1-出单爆款; 当请求类型为频道时必传
    sourceType: number, // 请求源类型：0-频道，1-组货
    jxCode: string
}