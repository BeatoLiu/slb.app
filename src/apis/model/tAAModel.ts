import { baseDateParams, basePageDateParams, baseResPageList, baseResT } from "./base";

/**
 * taa訂單列表
 */
export interface selectBenefitOrderListModel extends basePageDateParams {
    boCode: number;
    bizOrderCode: number
}
export interface selectBenefitOrderListItem {
    createTime: string;
    orderEndTime: string;
    boCode: number;
    orderBonus: number;
    orderBonusPerDay: number;
}
export type selectBenefitOrderListRes = baseResPageList<selectBenefitOrderListItem>

/**
 * 解锁列表
 */
export interface selectSignTokenTempTotalListModel extends basePageDateParams {
    unlockSetStatus: number;
    tokenDescType: number;
    // boCode: number;
    // atdCode: number;
    // atdStatusList: Array<number> | null
}
export interface selectSignTokenTempTotalListItem {
    createTime: string;
    ptCode: number;
    tokenType: number;
    tokenSignType: number;
    tokenSum: number;
    tokenCount: number;
    tokenStatus: number;
    tokenStatusName: string;
    remark: string;
    unlockTime: string;
    unlockSetStatus: number;
    unlockSetStatusName: string
}

/**
 * 提币列表
 */
export interface selectTakenTokenListModel extends basePageDateParams {
    ttCode: number;
    ttSetStatus: number;
}
export interface selectTakenTokenListItem {
    createTime: string;
    ttCode: number;
    ttSum: number;
    ttSetStatus: number;
    ttSetStatusName: string;
    ttBizType: number;
    ttRemark: string;
    ttBizTypeName: string
}
/**
 * 可提币
 */
export interface canTakeOutModel extends baseDateParams {
    ttCode: number,
    atdCode: number,
    boCode: number,
    atdStatusList: Array<number> | null
}

/**
 * 提幣
 */
export interface withdrawalTaaModel {
    payPlat: string;
    payType: number;
}

/**
 * 获取会员总资产（ZSDT）
 */
export interface getTotalAssetsItem {
    mwCurrencyTypeName: string;
    exchangeRate: number;
    mwAmount: number;
    mwCurrencyType: number;
    exchangeNum: number
}
interface getTotalAssetsInfo {
    total: number;
    list: getTotalAssetsItem[]
}
export type getTotalAssetsRes = baseResT<getTotalAssetsInfo>

/**
 * @description 转账
 * @param currencyType 币种
 * @param toChainAddr 对方地址
 * @param amount 金额
 * @param allianceWalletPassword 支付密码
 */
export interface transferModel {
    amount: string;
    toChainAddr: string;
    currencyType: number;
    allianceWalletPassword: string
}