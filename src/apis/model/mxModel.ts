import { IBasePageParams, IBaseResList, IBaseResPageList, IBaseResT } from './base'

// 具體規格描述
interface IParamsItem {
	pcdSubCode: number
	pcdSubName: string
	input: string
	pcName: string
}
// 規格描述
export interface IPrdCsSkuCollectionItem {
	pcName: string
	pcCode: number
	// pcdSubCode: number;
	pcSourceType: number

	params: IParamsItem[]
}
/**
 *
 */
export type IShowMemberCommodityModel = IBasePageParams & {
	cInvestType?: number //
	cAuditStatus: number // 审核状态
	cName?: string
	ccRelation?: string
}
export interface IShowMemberCommodityItem {
	csTaaPrice: number
	createTime: string
	cPrice: number
	cShowPrice: number
	mCode: number
	mName: string
	sePower: string
	cCode: number
	cPicName: string
	cName: string
	cTotalAmount: number
}
export type IShowMemberCommodityRes = IBaseResPageList<IShowMemberCommodityItem>

export interface ICDetailPicItem {
	utPath: string
	utCode: number
}
export interface ICsbListItem {
	csPrice: number
	csPrice1: number
	csPrice2: number
	csPrice3: number
	csWholesalePrice: number
	csPointPrice: number
	csStockAmount: number
	cCode: number
	csCode: number
	csPicName: string
	csSkuCollection: IPrdCsSkuCollectionItem[]
	buyNum?: number
	connectName?: string
}
/**
 * 商品详情
 */
export interface IShowCommodityDetailInfo extends IShowMemberCommodityItem {
	cUnitPrice: number
	cWholesalePrice: number
	cRecPayType: string
	cStockAmount: number
	cDetailPic: ICDetailPicItem[]
	cSpuCollection: IPrdCsSkuCollectionItem[]
	csbList: ICsbListItem[]
}
export type IShowCommodityDetailRes = IBaseResT<IShowCommodityDetailInfo>
/**
 * @description 會員的秘選訂單列表
 * @param payStatus 支付狀態
 * @param oStatus 訂單狀態
 */
export type IShowSelfOrderDetailModel = IBasePageParams & {
	payStatus: number //
	oStatus: number // 审核状态
}
// 會員秘選訂單記錄信息
export interface IShowSelfOrderDetailItem {
	podCode: number
	poCode: number
	prdCCode: number
	mName: string
	podStatusName: string
	prdCsPicName: string
	prdCName: string
	className: string
	pointMCode: number
	pointNumber: number
	prdCount: number
	prdSum: number
	orderPayTypeName: string
	podStatus: number
	prdCsSkuCollection: IPrdCsSkuCollectionItem[]
}

/**
 * @description 確認收貨
 * @param podCode 訂單編號
 */
export interface IConfirmTakeDeliveryModel {
	podCode: number
}

// 订单详情
export interface IGetMallPrdOrderDetailMode {
	podCode: number
}
export interface IGetMallPrdOrderDetailItem extends IShowSelfOrderDetailItem {
	podRemark: string
	prdSentTime: string
	prdReceivedTime: string
	prdFactSum: number
	prdPrice: number
	prdType: number
	poMobile: string
	poLinkName: string
	poAddr: string
	createTime: string
	orderPayType: number
}
export type IGetMallPrdOrderDetailRes = IBaseResT<IGetMallPrdOrderDetailItem>

// 退款
export interface IInsertRefundOrderModel {
	podCode: number // 产品编号
	roType: number // 退货类型
	roRecType: number // 是否已收货
	roReasonType: number // 退货原因
	remark: string //  备注
}

// 商品分類類型列表
export interface IShowCommodityClassFilterItem {
	ccCode: number
	pCcCode: number
	ccType: number
	ccName: string
	ccRelation: string
	ccRation: number
}
export type IShowCommodityClassFilterRes = IBaseResList<IShowCommodityClassFilterItem>
