import { httpGet, httpPost } from './axios'
import { baseResT } from './model/base'
import {
    canTakeOutModel,
    getTotalAssetsRes,
    selectBenefitOrderListModel,
    selectSignTokenTempTotalListModel,
    selectTakenTokenListModel,
    transferModel,
    withdrawalTaaModel
} from './model/tAAModel'

enum Api {
    APP_SIGN = 'taa/appSign',
    UPDATE_WALLET_URL = 'taa/updateWalletUrl',
    // SELECT_BENEFIT_ORDER_LIST = 'taa/selectBenefitOrderList',
    SELECT_BENEFIT_ORDER_LIST_SUM = 'taa/selectBenefitOrderListSum',
    // SELECT_AVAILABLE_TOKEN_LIST_SUM = 'taa/selectAvailableTokenListSum',
    CAN_TAKE_OUT = 'taa/canTakeOut',
    SELECT_TAKE_TOKEN_DETAIL_LIST_SUM = 'taa/selectTakeTokenDetailListSum',
    // SELECT_AVAILABLE_TOKEN_NO_REAL_TIME_LIST_SUM = 'taa/selectAvailableTokenNoRealTimeListSum',
    // SELECT_UNLOCK_LIST_SUM = 'taa/selectUnLockListSum',
    SELECT_SIGN_TOKEN_TEMP_TOTAL_LIST_SUM = 'taa/selectSignTokenTempTotalListSum',
    GET_WALLET_BALANCE = 'taa/getWalletBalance',
    CREATE_TAKE_TOKEN_DETAIL = 'taa/createTakeTokenDetail',
    WITHDRAWAL_TAA = 'taa/memCode/withdrawalTaa',
    SINGLE_WITHDRAWAL = 'taa/singleWithdrawal',
    SINGLE_ONLINE_PAY = 'taa/singleOnlinePay',
    ADD_AD_VERTISING = 'mg/advertising/addAdvertising',
    GET_MEMBER_WALLET_URL = 'mem/member/getMemberWalletUrl',
    UNRELAX_SUM = 'taa/unRelaxSum',
    GET_TOTAL_ASSETS_LIST = 'taa/getTotalAssetsList',
    TRANSFER = 'taa/transfer',
    GET_MEMBER_WALLET = 'taa/getMemberWallet',

    CHANGE_WALLET_ACCT_ON_CHAIN_FOR_OUT_ZS = 'taa/changeWalletAcctOnChainForOutZs',
    CHANGE_WALLET_ACCT_ON_CHAIN_FOR_IN_ZS = 'taa/changeWalletAcctOnChainForInZs'
}

/**
* @description 用户签到
* @returns 
*/
export const appSign = () => httpPost<baseResT>(Api.APP_SIGN)

/**
* @description 看广告领t
* @returns 
*/
export const addAdvertising = (p: any) => httpGet<baseResT>(Api.ADD_AD_VERTISING, p)

/**
 * @description 查询TAA錢包地址
 * @returns 修改結果
 */
export const getMemberWalletUrl = () => httpGet<baseResT>(Api.GET_MEMBER_WALLET_URL)

/**
 * @description 完善（修改）TAA錢包地址
 * @param {walletUrl} 錢包地址
 * @returns 修改結果
 */
export const updateWalletUrl = (p: { walletUrl: string }) => httpGet<baseResT>(Api.UPDATE_WALLET_URL, p)

/**
 * @description 訂單列表
 * @param {selectBenefitOrderListModel}
 * @returns 訂單列表
 */
// export const selectBenefitOrderList = (p: selectBenefitOrderListModel) => httpGet<selectBenefitOrderListRes>(Api.SELECT_BENEFIT_ORDER_LIST, p)

/**
* @description 訂單列表總計
* @param {selectBenefitOrderListModel}
* @returns 訂單列表總計
*/
export const selectBenefitOrderListSum = (p: selectBenefitOrderListModel) => {
    p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
    return httpPost<baseResT>(Api.SELECT_BENEFIT_ORDER_LIST_SUM, p)
}


/**
* @description 解锁列表總計
* @param {selectBenefitOrderListModel}
* @returns 解锁列表總計
*/
export const selectSignTokenTempTotalListSum = (p: selectSignTokenTempTotalListModel) => {
    p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
    return httpPost<baseResT>(Api.SELECT_SIGN_TOKEN_TEMP_TOTAL_LIST_SUM, p)
}

/**
* @description 解锁列表總計(非签到)
* @param {selectBenefitOrderListModel}
* @returns 解锁列表總計
*/
// export const selectUnLockListSum = (p: { startTime: string, endTime: string }) => {
//     p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
//     return httpPost<baseResT>(Api.SELECT_UNLOCK_LIST_SUM, p)
// }

/**
* @description 解锁列表總計（签到）
* @param {selectBenefitOrderListModel}
* @returns 解锁列表總計
*/
// export const selectAvailableTokenNoRealTimeListSum = (p: { startTime: string, endTime: string }) => {
//     p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
//     return httpPost<baseResT>(Api.SELECT_AVAILABLE_TOKEN_NO_REAL_TIME_LIST_SUM, p)
// }

/**
* @description 解锁列表總計
* @param {selectBenefitOrderListModel}
* @returns 解锁列表總計
*/
// export const selectAvailableTokenListSum = (p: selectAvailableTokenListModel) => {
//     p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
//     return httpPost<baseResT>(Api.SELECT_AVAILABLE_TOKEN_LIST_SUM, p)
// }

/**
* @description 可提币總計
* @param {selectBenefitOrderListModel}
* @returns 可提币總計
*/
export const canTakeOut = (p: canTakeOutModel) => {
    p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
    return httpPost<baseResT>(Api.CAN_TAKE_OUT, p)
}
/**
* @description 提币列表總計
* @param {selectBenefitOrderListModel}
* @returns 提币列表總計
*/
export const selectTakeTokenDetailListSum = (p: selectTakenTokenListModel) => {
    p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
    return httpGet<baseResT>(Api.SELECT_TAKE_TOKEN_DETAIL_LIST_SUM, p)
}

/**
* @description 获取用户在交易所的TAA钱包余额
* @returns 获取用户在交易所的TAA钱包余额
*/
export const getWalletBalance = () => httpPost<baseResT>(Api.GET_WALLET_BALANCE)

/**
* @description 生成提币订单
* @param {selectBenefitOrderListModel}
* @returns 生成提币订单
*/
export const createTakeTokenDetail = () => httpPost<baseResT>(Api.CREATE_TAKE_TOKEN_DETAIL)

/**
* @description 会员提币
* @param {withdrawalTaaModel}
* @returns 会员提币
*/
export const withdrawalTaa = () => httpGet<baseResT>(Api.WITHDRAWAL_TAA, {})


/**
 * @description 对提币列表中未提币的订单提币
 * @param {ttCode}
 * @returns
 */
export const singleWithdrawal = (p: { ttCode: number }) => httpGet<baseResT>(Api.SINGLE_WITHDRAWAL, p)


/**
 * @description 对提币列表中未提币的订单提币支付
 * @param {ttCode}
 * @returns
 */
export const singleOnlinePay = (p: { ttCode: number }) => httpGet<baseResT>(Api.SINGLE_ONLINE_PAY, p)

/**
 * @description 查询TAA已释放、未释放，总额
 * @returns 
 */
export const unRelaxSum = () => httpPost<baseResT>(Api.UNRELAX_SUM, {})

/**
 * @description 获取会员总资产（ZSDT）
 * @returns 
 */
export const getTotalAssets = () => httpPost<getTotalAssetsRes>(Api.GET_TOTAL_ASSETS_LIST, {})

/**
 * @description 钱包转账
 * @param p transferModel
 * @returns 
 */
export const transfer = (p: transferModel) => httpPost<baseResT>(Api.TRANSFER, p)

/**
 * @description 获取会员对应币种账户钱包余额
 * @param p.currencyType 币种类型
 * @returns 
 */
export const getMemberWallet = (p: { currencyType: number }) => httpPost<baseResT>(Api.GET_MEMBER_WALLET, p)

/**
 * @description 会员转账到链上钱包
 * @param p.currencyType 币种类型
 * @returns 
 */
export const changeWalletAcctOnChainForOutZs = (p: transferModel) => httpPost<baseResT>(Api.CHANGE_WALLET_ACCT_ON_CHAIN_FOR_OUT_ZS, p)

/**
 * @description 会员将链上钱包充值到展市钱包
 * @param p.currencyType 币种类型
 * @returns 
 */
export const changeWalletAcctOnChainForInZs = (p: Omit<transferModel, "allianceWalletPassword">) => httpPost<baseResT>(Api.CHANGE_WALLET_ACCT_ON_CHAIN_FOR_IN_ZS, p)