import { httpGet, httpPost } from "./axios";
import {
    addCreditCardModel,
    addCreditPosModel,
    deleteCreditCardModel,
    deleteCreditPosModel,
    showBankListModel,
    showBankListRes,
    showCreditCardListModel,
    showCreditCardListRes,
    showCreditPosListRes,
    updateCardByMccCodeModel
} from "./model/bankCardModel";
import { basePageParams, baseResT } from "./model/base";

enum Api {
    SHOW_CREDIT_CARD_LIST = 'mg/creditCard/showCreditCardList',
    DELETE_CREDIT_CARD = 'mg/creditCard/deleteCreditCard',
    ADD_CREDIT_CARD = 'mg/creditCard/addCreditCard',
    UPDATE_CREDIT_CARD = 'mg/creditCard/updateCreditCard',
    SHOW_BANK_LIST = 'mg/bankInfo/showBankList',
    GET_CREDIT_CARD_BY_MCCCODE = 'mg/creditCard/getCreditCardByMccCode',
    SHOW_CREDIT_POS_LIST = 'mg/creditPos/showCreditPosList',
    ADD_CREDIT_POS = 'mg/creditPos/addCreditPos',
    DELETE_CREDIT_POS = 'mg/creditPos/deleteCreditPos'
}

/**
 * @description 查詢會員銀行卡（信用卡）列表
 * @param p.mccCardType 1銀行卡 2信用卡
 * @returns 會員銀行卡（信用卡）列表
 */
export const showCreditCardList = (p: showCreditCardListModel) => httpPost<showCreditCardListRes>(Api.SHOW_CREDIT_CARD_LIST, p)

/**
 * @description 刪除會員銀行卡（信用卡）列表
 * @param p.mccCode 
 * @returns 操作結果
 */
export const deleteCreditCard = (p: deleteCreditCardModel) => httpGet<baseResT>(Api.DELETE_CREDIT_CARD, p)

/**
* @description 會員新增銀行卡
* @returns 會員銀行卡（信用卡）信息
*/
export const addCreditCard = (p: addCreditCardModel) => httpPost<baseResT>(Api.ADD_CREDIT_CARD, p)

/**
* @description 會員修改銀行卡
* @returns 會員銀行卡（信用卡）信息
*/
export const updateCreditCard = (p: updateCardByMccCodeModel) => httpPost<baseResT>(Api.UPDATE_CREDIT_CARD, p)


/**
* @description 查詢銀行卡列表
* @param biType
* @returns 銀行卡列表
*/
export const showBankList = (p: showBankListModel) => httpGet<showBankListRes>(Api.SHOW_BANK_LIST, p)

/**
* @description 會員查看银行卡详情
* @returns 會員銀行卡（信用卡）信息
*/
export const getCreditCardByMccCode = (p: deleteCreditCardModel) => httpGet<baseResT>(Api.GET_CREDIT_CARD_BY_MCCCODE, p)

/**
* @description 查詢pos機列表
* @param biType
* @returns pos機列表
*/
export const showCreditPosList = (p: basePageParams) => httpGet<showCreditPosListRes>(Api.SHOW_CREDIT_POS_LIST, p)

/**
* @description 新增pos機
* @param biType
* @returns 銀行卡列表
*/
export const addCreditPos = (p: addCreditPosModel) => httpPost<baseResT>(Api.ADD_CREDIT_POS, p)

/**
* @description 刪除pos機
* @param biType
* @returns 銀行卡列表
*/
export const deleteCreditPos = (p: deleteCreditPosModel) => httpPost<baseResT>(Api.DELETE_CREDIT_POS, p)