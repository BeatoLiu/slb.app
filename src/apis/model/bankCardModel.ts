import { baseResPageList } from "./base";


/**
 * @description 會員銀行卡（信用卡）列表
 * @param mccCardType 1銀行卡 2信用卡
 */
export interface showCreditCardListModel {
    mccCardType: number
}
/**
 * @description 會員銀行卡（信用卡）列表,單條記錄信息
 * @param mccBankName 銀行卡開戶行
 * @param mccBankId 開戶行編號
 * @param mccCard 銀行卡號
 * @param mccCode 表記錄編號
 * @param mccTipFlag 是否卡號異常 1異常，0正常
 * @param mccCardType 1銀行卡 2信用卡
 */
export interface showCreditCardListItem {
    mccBankName: string;
    mccBankId: string;
    mccCard: string;
    mccCardName: string;
    mccCode: number;
    mccTipFlag: number
}
export type showCreditCardListRes = baseResPageList<showCreditCardListItem>


/**
 *會員刪除銀行卡
 */
export interface deleteCreditCardModel {
    mccCode: number;
}


/**
 * 會員新增銀行卡
 */
export type addCreditCardModel = {
    mccBankName: string,
    mccCard: string,
    mccCardName: string,
    mccBankId: string,
    mccCardImgUrl: string,
    mccCardType: number
}

/**
 * 會員修改銀行卡
 */
export type updateCardByMccCodeModel = addCreditCardModel & deleteCreditCardModel

/**
 * 銀行卡列表
 */
export interface showBankListModel {
    biType: number;
}
export interface showBankListItem {
    bankId: string;
    biName: string;
    biCode: number
}
export type showBankListRes = baseResPageList<showBankListItem>


/**
 * pos機新增
 */
export interface addCreditPosModel {
    mcpPosCode: string;
    mcpUmsName: string;
    mcpUmsId: number
}

/**
 * pos機信息
 */
export type showCreditPosListItem = addCreditPosModel & {
    mcpCode: number;
}
export type showCreditPosListRes = baseResPageList<showCreditPosListItem>

export interface deleteCreditPosModel {
    mcpCode: number
}