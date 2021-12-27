import { IBasePageParams } from './base';

/**
 * @description 淘宝产品
 * @param sortType 销量（total_sales），淘客佣金比率（tk_rate）， 累计推广量（tk_total_sales），总支出佣金（tk_total_commi），价格（price
 * @param sortPattern des（降序）,asc（升序） (ortType不为空时候，不能为空)
 */
export type IShowTaoKeGoodsFromApiModel = IBasePageParams & {
	sortType: string,
	sortPattern: string,
	// pageNum: 0,
	gName: string,
	// pageSize: 10,
	hasCoupon: boolean
}

/**
 * @description 淘宝产品(根據物料id查詢)
 * @param materialId 物料id
 */
export type IShowTaoKeGoodsBymaterialIdModel = IBasePageParams & {
	materialId: number
}

/**
 *@description 會員通過我們平臺購買的淘客商品，需要在本平臺錄入訂單
 * @param orderId 订单编号
 */
export interface IMemberCoupleOrderModel {
	orderId: string
}

/**
 * @description 淘客訂單總算力
 * @param oScRetStatus 结算状态
 */
export interface IShowSelfTaokeOrderSumModel {
	oScRetStatus: number
}


/**
 * @description會員淘客訂單列表
 */
export type IShowSelfTaoKeOrderModel = IBasePageParams & IShowSelfTaokeOrderSumModel
/**
 * @description 淘客訂單信息
 */
export interface IShowSelfTaoKeOrderItem {
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
 *@description 京東商品列表
 */
export type IShowJdGoodsByFromApiModel = IBasePageParams & {
	keyword: string;
	sortName: string;
	sort: string
}
/**
 *@description 京東商品列表(物料)
 */
export interface IJdGoodsListModel extends IBasePageParams {
	eliteId: number;
	sortName: string;
	sort: string
}

/**
 * @description 拼多多商品列表
 */
export type IShowPddGoodsFromApiModel = IBasePageParams & {
	keyword: string;
	sortType: number
}

export type IVopSelectItemsByKeywordModel = IBasePageParams & {
	keyword: string;
	fieldName: string;
	// sort: 'asc'
	orderType: number
}

/**
 * @param channelType 频道类型:0-超高佣，1-出单爆款; 当请求类型为频道时必传
 * @param sourceType 请求源类型：0-频道，1-组货
 */
export interface IVopSelectGoodsListModel extends IBasePageParams {
	pageNo: number;
	// pageSize: 10,
	fieldName: string;
	// sort: 'asc'
	orderType: number;
	channelType: number;
	sourceType: number;
	jxCode: string;
}
