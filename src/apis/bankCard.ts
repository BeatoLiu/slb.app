import { httpGet, httpPost } from './axios'
import {
	IAddCreditCardModel,
	IAddCreditPosModel,
	IDeleteCreditCardModel,
	IDeleteCreditPosModel,
	IShowBankListModel,
	IShowBankListRes,
	IShowCreditCardListModel,
	IShowCreditCardListRes,
	IShowCreditPosListRes,
	IUpdateCardByMccCodeModel
} from './model/bankCardModel'
import { IBasePageParams, IBaseResT } from './model/base'

enum Api {
	SHOW_CREDIT_CARD_LIST = 'mg/creditCard/showCreditCardList',
	DELETE_CREDIT_CARD = 'mg/creditCard/deleteCreditCard',
	ADD_CREDIT_CARD = 'mg/creditCard/addCreditCard',
	UPDATE_CREDIT_CARD = 'mg/creditCard/updateCreditCard',
	SHOW_BANK_LIST = 'mg/bankInfo/showBankList',
	GET_CREDIT_CARD_BY_MCC_CODE = 'mg/creditCard/getCreditCardByMccCode',
	SHOW_CREDIT_POS_LIST = 'mg/creditPos/showCreditPosList',
	ADD_CREDIT_POS = 'mg/creditPos/addCreditPos',
	DELETE_CREDIT_POS = 'mg/creditPos/deleteCreditPos'
}

/**
 * @description 查詢會員銀行卡（信用卡）列表
 * @param p.mccCardType 1銀行卡 2信用卡
 * @returns 會員銀行卡（信用卡）列表
 */
export const showCreditCardList = (p: IShowCreditCardListModel) =>
	httpPost<IShowCreditCardListRes>(Api.SHOW_CREDIT_CARD_LIST, p)

/**
 * @description 刪除會員銀行卡（信用卡）列表
 * @param p.mccCode
 * @returns 操作結果
 */
export const deleteCreditCard = (p: IDeleteCreditCardModel) => httpGet<IBaseResT>(Api.DELETE_CREDIT_CARD, p)

/**
 * @description 會員新增銀行卡
 * @returns 會員銀行卡（信用卡）信息
 */
export const addCreditCard = (p: IAddCreditCardModel) => httpPost<IBaseResT>(Api.ADD_CREDIT_CARD, p)

/**
 * @description 會員修改銀行卡
 * @returns 會員銀行卡（信用卡）信息
 */
export const updateCreditCard = (p: IUpdateCardByMccCodeModel) => httpPost<IBaseResT>(Api.UPDATE_CREDIT_CARD, p)

/**
 * @description 查詢銀行卡列表
 * @returns 銀行卡列表
 * @param p
 */
export const showBankList = (p: IShowBankListModel) => httpGet<IShowBankListRes>(Api.SHOW_BANK_LIST, p)

/**
 * @description 會員查看银行卡详情
 * @returns 會員銀行卡（信用卡）信息
 */
export const getCreditCardByMccCode = (p: IDeleteCreditCardModel) =>
	httpGet<IBaseResT>(Api.GET_CREDIT_CARD_BY_MCC_CODE, p)

/**
 * @description 查詢pos機列表
 * @returns pos機列表
 * @param p
 */
export const showCreditPosList = (p: IBasePageParams) => httpGet<IShowCreditPosListRes>(Api.SHOW_CREDIT_POS_LIST, p)

/**
 * @description 新增pos機
 * @returns 銀行卡列表
 * @param p
 */
export const addCreditPos = (p: IAddCreditPosModel) => httpPost<IBaseResT>(Api.ADD_CREDIT_POS, p)

/**
 * @description 刪除pos機
 * @returns 銀行卡列表
 * @param p
 */
export const deleteCreditPos = (p: IDeleteCreditPosModel) => httpPost<IBaseResT>(Api.DELETE_CREDIT_POS, p)
