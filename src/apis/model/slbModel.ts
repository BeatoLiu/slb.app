import { basePageDateParams, baseResT } from "./base";

// 數點兌換交易列表
export type showPayOrderListByMemCodeModel = basePageDateParams

export interface showPayOrderListByMemCodeItem {
    orderCode: number;
    mName: string;
    orderBizTypeName: string;
    orderPayFactSum: number;
    orderPayStatusName: string;
    createTime: string;
    moneyProve: string;
    orderPayStatus: number;

    orderPayTypeName: string;
    orderPlat: string;
    autoFlag: number
}


// 溢多寶交易列表
export type showPayOrderListModel = basePageDateParams & {
    orderPayStatus: number;
    orderBizTypeList: Array<number>
}

// 溢多寶是否續期
export interface updateMemberWJSConfirmLazyFlagModel {
    orderCode: number;
    autoFlag: number
}

// 兌換限額查詢
export interface showLimitAcctModel {
    laCode: number
}
export interface showLimitAcctItem {
    laSingleLimit: number;
    laSingleLimitLow: number;
    laLimit: number;
    laUsed: number;
    laPersonLimitPerDay: number;
    laExchangeRation: number;
    laCurrencyType: number;
    laType: number;
}
export type showLimitAcctRes = baseResT<showLimitAcctItem>

// 換算結果(dc - cny)
export interface getExchangeRatioinDcToCnyModel {
    laType: number;
    cnyMoney: number;
    laCurrencyType: number
}


export interface saleSusdFromSlbModel {
    payPlat: string;
    cnySum: number;
    susdSum: number;
    remark: string;
    bizType: number
}