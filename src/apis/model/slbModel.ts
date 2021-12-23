import { IBasePageDateParams, IBaseResT } from "./base";

// 數點兌換交易列表
export type IShowPayOrderListByMemCodeModel = IBasePageDateParams

export interface IShowPayOrderListByMemCodeItem {
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
export type IShowPayOrderListModel = IBasePageDateParams & {
    orderPayStatus: number;
    orderBizTypeList: Array<number>
}

// 溢多寶是否續期
export interface IUpdateMemberWJSConfirmLazyFlagModel {
    orderCode: number;
    autoFlag: number
}

// 兌換限額查詢
export interface IShowLimitAcctModel {
    laCode: number
}
export interface IShowLimitAcctItem {
    laSingleLimit: number;
    laSingleLimitLow: number;
    laLimit: number;
    laUsed: number;
    laPersonLimitPerDay: number;
    laExchangeRation: number;
    laCurrencyType: number;
    laType: number;
}
export type IShowLimitAcctRes = IBaseResT<IShowLimitAcctItem>

// 換算結果(dc - cny)
export interface IGetExchangeRatioinDcToCnyModel {
    laType: number;
    cnyMoney: number;
    laCurrencyType: number
}


export interface ISaleSusdFromSlbModel {
    payPlat: string;
    cnySum: number;
    susdSum: number;
    remark: string;
    bizType: number
}
