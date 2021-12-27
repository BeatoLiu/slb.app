import { httpGet, httpPost } from './axios'
import { IBaseResT } from './model/base'
import {
	ICanTakeOutModel,
	IGetCurrentTaaDataRes, IGetTotalAssetsRes,
	IGetTransferInfoKLineGraphRes,
	ISelectBenefitOrderListModel,
	ISelectSignTokenTempTotalListModel,
	ISelectTakenTokenListModel,
	ITransferModel
} from "./model/tAAModel";

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
    ADD_ADVERTISING = 'mg/advertising/addAdvertising',
    GET_MEMBER_WALLET_URL = 'mem/member/getMemberWalletUrl',
    UN_RELAX_SUM = 'taa/unRelaxSum',
    GET_TOTAL_ASSETS_LIST = 'taa/getTotalAssetsList',
    TRANSFER = 'taa/transfer',
    GET_MEMBER_WALLET = 'taa/getMemberWallet',

    CHANGE_WALLET_ACCT_ON_CHAIN_FOR_OUT_ZS = 'taa/changeWalletAcctOnChainForOutZs',
    CHANGE_WALLET_ACCT_ON_CHAIN_FOR_IN_ZS = 'taa/changeWalletAcctOnChainForInZs',
    GET_TRANSFER_INFO_K_LINE_GRAPH = 'taa/getTransferInfoKLineGraph',
    GET_CURRENT_TAA_DATA = 'taa/getCurrentTaaData',
    GET_TAA_RISE_AND_FALL = 'taa/getTaaRiseAndFall'
}

/**
* @description 用户签到
* @returns
*/
export const appSign = () => httpPost<IBaseResT>(Api.APP_SIGN)

/**
* @description 看广告领t
* @returns
*/
export const addAdvertising = (p: any) => httpGet<IBaseResT>(Api.ADD_ADVERTISING, p)

/**
 * @description 查询TAA錢包地址
 * @returns 修改結果
 */
export const getMemberWalletUrl = () => httpGet<IBaseResT>(Api.GET_MEMBER_WALLET_URL)

/**
 * @description 完善（修改）TAA錢包地址
 * @returns 修改結果
 * @param p
 */
export const updateWalletUrl = (p: { walletUrl: string }) => httpGet<IBaseResT>(Api.UPDATE_WALLET_URL, p)

/**
 * @description 訂單列表
 * @param selectBenefitOrderListModel
 * @returns 訂單列表
 */
// export const selectBenefitOrderList = (p: selectBenefitOrderListModel) => httpGet<selectBenefitOrderListRes>(Api.SELECT_BENEFIT_ORDER_LIST, p)

/**
 * @description 訂單列表總計
 * @returns 訂單列表總計
 * @param p
 */
export const selectBenefitOrderListSum = (p: ISelectBenefitOrderListModel) => {
    p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
    return httpPost<IBaseResT>(Api.SELECT_BENEFIT_ORDER_LIST_SUM, p)
}


/**
 * @description 解锁列表總計
 * @returns 解锁列表總計
 * @param p
 */
export const selectSignTokenTempTotalListSum = (p: ISelectSignTokenTempTotalListModel) => {
    p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
    return httpPost<IBaseResT>(Api.SELECT_SIGN_TOKEN_TEMP_TOTAL_LIST_SUM, p)
}

/**
* @description 解锁列表總計(非签到)
* @param selectBenefitOrderListModel
* @returns 解锁列表總計
*/
// export const selectUnLockListSum = (p: { startTime: string, endTime: string }) => {
//     p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
//     return httpPost<IBaseResT>(Api.SELECT_UNLOCK_LIST_SUM, p)
// }

/**
* @description 解锁列表總計（签到）
* @param selectBenefitOrderListModel
* @returns 解锁列表總計
*/
// export const selectAvailableTokenNoRealTimeListSum = (p: { startTime: string, endTime: string }) => {
//     p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
//     return httpPost<IBaseResT>(Api.SELECT_AVAILABLE_TOKEN_NO_REAL_TIME_LIST_SUM, p)
// }

/**
* @description 解锁列表總計
* @param selectBenefitOrderListModel
* @returns 解锁列表總計
*/
// export const selectAvailableTokenListSum = (p: selectAvailableTokenListModel) => {
//     p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
//     return httpPost<IBaseResT>(Api.SELECT_AVAILABLE_TOKEN_LIST_SUM, p)
// }

/**
 * @description 可提币總計
 * @returns 可提币總計
 * @param p
 */
export const canTakeOut = (p: ICanTakeOutModel) => {
    p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
    return httpPost<IBaseResT>(Api.CAN_TAKE_OUT, p)
}
/**
 * @description 提币列表總計
 * @returns 提币列表總計
 * @param p
 */
export const selectTakeTokenDetailListSum = (p: ISelectTakenTokenListModel) => {
    p.endTime.length < 11 && (p.endTime = p.endTime + ' 23:59:59')
    return httpGet<IBaseResT>(Api.SELECT_TAKE_TOKEN_DETAIL_LIST_SUM, p)
}

/**
* @description 获取用户在交易所的TAA钱包余额
* @returns 获取用户在交易所的TAA钱包余额
*/
export const getWalletBalance = () => httpPost<IBaseResT>(Api.GET_WALLET_BALANCE)

/**
* @description 生成提币订单
* @returns 生成提币订单
*/
export const createTakeTokenDetail = () => httpPost<IBaseResT>(Api.CREATE_TAKE_TOKEN_DETAIL)

/**
* @description 会员提币
* @returns 会员提币
*/
export const withdrawalTaa = () => httpGet<IBaseResT>(Api.WITHDRAWAL_TAA, {})


/**
 * @description 对提币列表中未提币的订单提币
 * @returns
 * @param p
 */
export const singleWithdrawal = (p: { ttCode: number }) => httpGet<IBaseResT>(Api.SINGLE_WITHDRAWAL, p)


/**
 * @description 对提币列表中未提币的订单提币支付
 * @returns
 * @param p
 */
export const singleOnlinePay = (p: { ttCode: number }) => httpGet<IBaseResT>(Api.SINGLE_ONLINE_PAY, p)

/**
 * @description 查询TAA已释放、未释放，总额
 * @returns
 */
export const unRelaxSum = () => httpPost<IBaseResT>(Api.UN_RELAX_SUM, {})

/**
 * @description 获取会员总资产（ZSDT）
 * @returns
 */
export const getTotalAssets = () => httpPost<IGetTotalAssetsRes>(Api.GET_TOTAL_ASSETS_LIST, {})

/**
 * @description 钱包转账
 * @param p transferModel
 * @returns
 */
export const transfer = (p: ITransferModel) => httpPost<IBaseResT>(Api.TRANSFER, p)

/**
 * @description 获取会员对应币种账户钱包余额
 * @param p.currencyType 币种类型
 * @returns
 */
export const getMemberWallet = (p: { currencyType: number }) => httpPost<IBaseResT>(Api.GET_MEMBER_WALLET, p)

/**
 * @description 会员转账到链上钱包
 * @param p.currencyType 币种类型
 * @returns
 */
export const changeWalletAcctOnChainForOutZs = (p: ITransferModel) => httpPost<IBaseResT>(Api.CHANGE_WALLET_ACCT_ON_CHAIN_FOR_OUT_ZS, p)

/**
 * @description 会员将链上钱包充值到展市钱包
 * @param p.currencyType 币种类型
 * @returns
 */
export const changeWalletAcctOnChainForInZs = (p: Omit<ITransferModel, "allianceWalletPassword">) => httpPost<IBaseResT>(Api.CHANGE_WALLET_ACCT_ON_CHAIN_FOR_IN_ZS, p)

/**
 * @description 查询TAA K线图
 * @returns
 */
export const getTransferInfoKLineGraph = () => httpPost<IGetTransferInfoKLineGraphRes>(Api.GET_TRANSFER_INFO_K_LINE_GRAPH)

/**
 * @description 获取勾画K线图所需数据:获取当天最高价maxPrice、最低价minPrice、交易总数量
 * @returns
 */
export const getCurrentTaaData = () => httpPost<IGetCurrentTaaDataRes>(Api.GET_CURRENT_TAA_DATA)

/**
 * @description 获取TAA涨跌百分比
 * @returns
 */
export const getTaaRiseAndFall = () => httpPost<IBaseResT>(Api.GET_TAA_RISE_AND_FALL)
