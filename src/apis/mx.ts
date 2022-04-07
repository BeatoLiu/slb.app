import { httpGet, httpPost } from './axios'
import {
	IShowCommodityClassFilterRes,
	IInsertRefundOrderModel,
	IGetMallPrdOrderDetailMode,
	IGetMallPrdOrderDetailRes,
	IConfirmTakeDeliveryModel,
	IShowMemberCommodityRes,
	IShowCommodityDetailRes,
	IShowMemberCommodityModel
} from './model/mxModel'
import { IBaseResT } from './model/base'

enum Api {
	SHOW_MEMBER_COMMODITY = 'mall/commodity/showMemberCommodity',
	GET_EC_GAS_CALC_POWER = 'mall/commodity/getEcGasCalcPower',
	GET_EC_TAA_CALC_POWER = 'mall/commodity/getEcTaaCalcPower',
	CONFIRM_TAOKE_DELIVERY = 'mem/order/confirmTakeDelivery',
	GET_MALL_PRD_ORDER_DETAIL = 'mem/order/getMallPrdOrderDetail',
	GET_LOGISTICS_INFO_BY_LOG_CODE = 'mall/logistics/getLogisticsInfoByLogCode',
	UPLOAD_PIC = 'mall/refund/uploadPic',
	INSERT_REFUND_ORDER = 'mall/refund/insertRefundOrder',
	MALL_PAY_ONLINE = 'mg/ytpay/mallPayOnline',
	MALL_PAY_ONLINE_DETAIL = 'mg/ytpay/mallPayOnlineDetail',
	SELECT_PAY_ORDER_BY_BIZ_ORDER_CODE = 'mg/order/selectPayOrderByBizOrderCode',
	SHOW_COMMODITY_DETAIL = 'mall/commodity/showCommodityDetail',
	SUBMIT_EC_BILL = 'mall/order/submitEcBill',
	SHOW_COMMODITY_CLASS_FILTER = 'mall/commodityClass/showCommodityClassFilter'
}

/**
 * 查询秘选商城产品列表
 * @param p
 * @returns
 */
export const showMemberCommodity = (p: IShowMemberCommodityModel) =>
	httpGet<IShowMemberCommodityRes>(Api.SHOW_MEMBER_COMMODITY, p)

/**
 * 查询秘选商城产品详情
 * @param p
 * @returns
 */
export const showCommodityDetail = (p: { cCode: string }) =>
	httpGet<IShowCommodityDetailRes>(Api.SHOW_COMMODITY_DETAIL, p)

/**
 * 商品算力(gas)
 * @param p
 * @returns
 */
export const getEcGasCalcPower = (p: { mCode: number; price: number }) =>
	httpGet<IBaseResT<string>>(Api.GET_EC_GAS_CALC_POWER, p)

/**
 * 商品算力(TAA)
 * @param p
 * @returns
 */
export const getEcTaaCalcPower = (p: { mCode: number; price: number }) =>
	httpGet<IBaseResT<string>>(Api.GET_EC_TAA_CALC_POWER, p)

/**
 * @description 確認收貨
 * @param p.podCode 訂單編號
 * @returns 返回操作是否成功
 */
export const confirmTakeDelivery = (p: IConfirmTakeDeliveryModel) => httpGet<IBaseResT>(Api.CONFIRM_TAOKE_DELIVERY, p)

/**
 * @description 查看订单详情
 * @param p.podCode 訂單編號
 * @returns 返回操作是否成功
 */
export const getMallPrdOrderDetail = (p: IGetMallPrdOrderDetailMode) =>
	httpGet<IGetMallPrdOrderDetailRes>(Api.GET_MALL_PRD_ORDER_DETAIL, p)

/**
 * @description 查看订单物流信息
 * @param p.podCode 訂單編號
 * @returns 返回操作是否成功
 */
export const getLogisticsInfoByLogCode = (p: IGetMallPrdOrderDetailMode) =>
	httpGet<IBaseResT>(Api.GET_LOGISTICS_INFO_BY_LOG_CODE, p)

/**
 * @description 退款時上傳圖片
 * @param p.podCode 訂單編號
 * @returns 返回操作是否成功
 */
export const uploadPic = (p: FormData) => httpPost<IBaseResT>(Api.UPLOAD_PIC, p)

/**
 * @description 退款時上傳圖片
 * @param p.podCode 訂單編號
 * @returns 返回操作是否成功
 */
export const insertRefundOrder = (p: IInsertRefundOrderModel) => httpPost<IBaseResT>(Api.INSERT_REFUND_ORDER, p)

/**
 * @description 生成秘选订单
 * @param p
 * @returns
 */
export const submitEcBill = (p: any) => httpPost(Api.SUBMIT_EC_BILL, p)

/**
 * @description 秘選訂單支付
 * @param p.poCode 訂單編號
 * @returns 返回操作是否成功
 */
export const mallPayOnline = (p: { payPlat: string; poCode: number }) => httpGet<IBaseResT>(Api.MALL_PAY_ONLINE, p)

/**
 * @description 待支付秘選訂單支付
 * @param p.podCode 訂單編號
 * @returns 返回操作是否成功
 */
export const mallPayOnlineDetail = (p: { payPlat: string; podCode: number }) =>
	httpGet<IBaseResT>(Api.MALL_PAY_ONLINE_DETAIL, p)

/**
 * @description 查看訂單支付狀態（新建訂單）
 * @param p.podCode 訂單編號
 * @returns 返回操作是否成功
 */
export const selectPayOrderByBizOrderCode = (p: { orderBizType: number; orderBizCode: number }) =>
	httpGet<IBaseResT>(Api.SELECT_PAY_ORDER_BY_BIZ_ORDER_CODE, p, { showLoading: false })

/**
 * @description 查詢有名下有商品的分類
 * @returns
 */
export const showCommodityClassFilter = (p: { ccType: number }) =>
	httpGet<IShowCommodityClassFilterRes>(Api.SHOW_COMMODITY_CLASS_FILTER, p)
