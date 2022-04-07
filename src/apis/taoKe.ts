import { httpGet } from './axios'
import { IBaseRes, IBaseResT } from './model/base'
import {
	IShowTaoKeGoodsFromApiModel,
	IShowTaoKeGoodsBymaterialIdModel,
	IVopSelectItemsByKeywordModel,
	IVopSelectGoodsListModel,
	IShowPddGoodsFromApiModel,
	IJdGoodsListModel,
	IShowJdGoodsByFromApiModel,
	IShowSelfTaokeOrderSumModel,
	IMemberCoupleOrderModel
} from './model/taoKeModel'

enum Api {
	SHOW_TAOKE_GOODS_FROM_API = 'mg/taoke/showTaoKeGoodsFromApi',
	MEMBER_COUPLE_ORDER = 'mg/taoke/memberCoupleOrder',
	SHOW_SELF_TAOKE_ORDER_SUM = 'mg/taoke/showSelfTaokeOrderSum',
	SHOW_JD_GOODS_BY_FROM_API = 'mg/taoke/showJdGoodsByFromApi',
	SHOW_PDD_GOODS_FROM_API = 'mg/taoke/showPddGoodsFromApi',
	VOP_SELECT_ITEMS_BY_KEY_WORD = 'mg/taoke/vopSelectItemsByKeyword',
	GET_JD_LINK = 'mg/taoke/getJdLink',
	GET_PDD_LINK = 'mg/taoke/getPddLink',
	VOP_GET_LINK = 'mg/taoke/vopGetLink',
	SHOW_TAOKE_GOODS_BY_MATERIAL_ID = 'mg/taoke/showTaoKeGoodsBymaterialId',
	SHOW_JDJX_BY_ELITE_ID = 'mg/taoke/showJdjxByEliteId',
	VOP_SELECT_GOODS_LIST = 'mg/taoke/vopSelectGoodsList'
}

/**
 * 查询淘客产品列表
 * @param p
 * @returns
 */
export const showTaoKeGoodsFromApi = (p: IShowTaoKeGoodsFromApiModel) =>
	httpGet<IBaseResT>(Api.SHOW_TAOKE_GOODS_FROM_API, p)

/**
 * 查询淘客产品列表（根據物料Id）
 * @param p
 * @returns
 */
export const showTaoKeGoodsBymaterialId = (p: IShowTaoKeGoodsBymaterialIdModel) =>
	httpGet<IBaseResT>(Api.SHOW_TAOKE_GOODS_BY_MATERIAL_ID, p)

/**
 * 訂單錄入（會員通過本平臺購買的淘客商品，需要在本平臺錄入訂單）
 * @param p.orderId 訂單編號
 * @returns 錄入結果
 */
export const memberCoupleOrder = (p: IMemberCoupleOrderModel) => httpGet<IBaseRes>(Api.MEMBER_COUPLE_ORDER, p)

/**
 * @description 統計淘客訂單總算力
 * @param p.orderId oScRetStatus 訂單狀態（為1，才有算力）
 * @returns 總算力
 */
export const showSelfTaokeOrderSum = (p: IShowSelfTaokeOrderSumModel) =>
	httpGet<IBaseResT>(Api.SHOW_SELF_TAOKE_ORDER_SUM, p)

/**
 * 查询京東产品列表
 * @param p
 * @returns
 */
export const showJdGoodsByFromApi = (p: IShowJdGoodsByFromApiModel) =>
	httpGet<IBaseResT>(Api.SHOW_JD_GOODS_BY_FROM_API, p)

/**
 * 查询京東产品列表(物料id)
 * @param p
 * @returns
 */
export const showJdjxByEliteId = (p: IJdGoodsListModel) => httpGet<IBaseResT>(Api.SHOW_JDJX_BY_ELITE_ID, p)

/**
 * 京东推广链接
 * @param p
 * @returns
 */
export const getJdLink = (p: { url: string; couponUrl?: string }) => httpGet<IBaseResT>(Api.GET_JD_LINK, p)

/**
 * 查询拼多多产品列表
 * @param p
 * @returns
 */
export const showPddGoodsFromApi = (p: IShowPddGoodsFromApiModel) => httpGet<IBaseResT>(Api.SHOW_PDD_GOODS_FROM_API, p)

/**
 * 拼多多推广链接
 * @param p
 * @returns
 */
export const getPddLink = (p: { goodsSign: string }) => httpGet<IBaseResT>(Api.GET_PDD_LINK, p)

/**
 * 查询維品會产品列表
 * @param p
 * @returns
 */
export const vopSelectItemsByKeyword = (p: IVopSelectItemsByKeywordModel) =>
	httpGet<IBaseResT>(Api.VOP_SELECT_ITEMS_BY_KEY_WORD, p)

/**
 * 查询維品會产品列表(商品组货码)
 * @param p
 * @returns
 */
export const vopSelectGoodsList = (p: IVopSelectGoodsListModel) => httpGet<IBaseResT>(Api.VOP_SELECT_GOODS_LIST, p)

/**
 * 維品會推广链接
 * @param p
 * @returns
 */
export const vopGetLink = (p: { goodsId: string }) => httpGet<IBaseResT>(Api.VOP_GET_LINK, p)
