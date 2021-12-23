import { IBaseResPageList } from "./base";


/**
 * @description 會員銀行卡（信用卡）列表
 * @param mccCardType 1銀行卡 2信用卡
 */
export interface IShowCreditCardListModel {
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
export interface IShowCreditCardListItem {
    mccBankName: string;
    mccBankId: string;
    mccCard: string;
    mccCardName: string;
    mccCode: number;
    mccTipFlag: number
}
export type IShowCreditCardListRes = IBaseResPageList<IShowCreditCardListItem>


/**
 *會員刪除銀行卡
 */
export interface IDeleteCreditCardModel {
    mccCode: number;
}


/**
 * 會員新增銀行卡
 */
export type IAddCreditCardModel = {
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
export type IUpdateCardByMccCodeModel = IAddCreditCardModel & IDeleteCreditCardModel

/**
 * 銀行卡列表
 */
export interface IShowBankListModel {
    biType: number;
}
export interface IShowBankListItem {
    bankId: string;
    biName: string;
    biCode: number
}
export type IShowBankListRes = IBaseResPageList<IShowBankListItem>


/**
 * pos機新增
 */
export interface IAddCreditPosModel {
    mcpPosCode: string;
    mcpUmsName: string;
    mcpUmsId: number
}

/**
 * pos機信息
 */
export type IShowCreditPosListItem = IAddCreditPosModel & {
    mcpCode: number;
}
export type IShowCreditPosListRes = IBaseResPageList<IShowCreditPosListItem>

export interface IDeleteCreditPosModel {
    mcpCode: number
}
