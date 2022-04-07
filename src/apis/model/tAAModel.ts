import { IBaseDateParams, IBasePageDateParams, IBaseResT } from './base'

/**
 * taa訂單列表
 */
export interface ISelectBenefitOrderListModel extends IBasePageDateParams {
	boCode: number
	bizOrderCode: number
}
export interface ISelectBenefitOrderListItem {
	createTime: string
	orderEndTime: string
	boCode: number
	orderBonus: number
	orderBonusPerDay: number
}

/**
 * 解锁列表
 */
export interface ISelectSignTokenTempTotalListModel extends IBasePageDateParams {
	unlockSetStatus: number
	tokenDescType: number
	// boCode: number;
	// atdCode: number;
	// atdStatusList: Array<number> | null
}
export interface ISelectSignTokenTempTotalListItem {
	createTime: string
	ptCode: number
	tokenType: number
	tokenSignType: number
	tokenSum: number
	tokenCount: number
	tokenStatus: number
	tokenStatusName: string
	remark: string
	unlockTime: string
	unlockSetStatus: number
	unlockSetStatusName: string
}

/**
 * 提币列表
 */
export interface ISelectTakenTokenListModel extends IBasePageDateParams {
	ttCode: number
	ttSetStatus: number
}
export interface ISelectTakenTokenListItem {
	createTime: string
	ttCode: number
	ttSum: number
	ttSetStatus: number
	ttSetStatusName: string
	ttBizType: number
	ttRemark: string
	ttBizTypeName: string
}
/**
 * 可提币
 */
export interface ICanTakeOutModel extends IBaseDateParams {
	ttCode: number
	atdCode: number
	boCode: number
	atdStatusList: Array<number> | null
}

/**
 * 提幣
 */
// export interface IWithdrawalTaaModel {
//     payPlat: string;
//     payType: number;
// }

/**
 * 获取会员总资产（ZSDT）
 */
export interface IGetTotalAssetsItem {
	mwCurrencyTypeName: string
	exchangeRate: number
	mwAmount: number
	mwCurrencyType: number
	exchangeNum: number
}
interface IGetTotalAssetsInfo {
	total: number
	list: IGetTotalAssetsItem[]
}
export type IGetTotalAssetsRes = IBaseResT<IGetTotalAssetsInfo>

/**
 * @description 转账
 * @param currencyType 币种
 * @param toChainAddr 对方地址
 * @param amount 金额
 * @param allianceWalletPassword 支付密码
 */
export interface ITransferModel {
	amount: string
	toChainAddr: string
	currencyType: number
	allianceWalletPassword: string
}

/**
 * k线图返回数据
 */
interface IGetTransferInfoKLineGraphItem {
	createTime: string
	openPrice: number
	maxPrice: number
	minPrice: number
	closePrice: number
}
interface IGetTransferInfoKLineGraphInfor {
	[key: string]: IGetTransferInfoKLineGraphItem
}
export type IGetTransferInfoKLineGraphRes = IBaseResT<IGetTransferInfoKLineGraphInfor>

/**
 * @description K线图所需数据
 * @param maxPrice 最高价
 * @param minPrice 最低价
 * @param tokenCount 交易总数量
 * @param tokenPrice 当前价格
 */
interface IGetCurrentTaaDataItem {
	maxPrice: number
	minPrice: number
	tokenCount: number
	tokenPrice: number
}

export type IGetCurrentTaaDataRes = IBaseResT<IGetCurrentTaaDataItem>

/**
 * @description 钱包转到交易所账号
 */
export interface ITransferFromSlbAcct2StockAcct {
	chAmount: string
	currencyType: number
}
