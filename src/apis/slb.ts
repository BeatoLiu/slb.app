import { httpGet, httpPost } from "./axios";
import { IBaseResT } from "./model/base";
import {
	IGetExchangeRatioinDcToCnyModel,
	ISaleSusdFromSlbModel,
	IShowLimitAcctModel,
	IShowLimitAcctRes,
	IUpdateMemberWJSConfirmLazyFlagModel
} from "./model/slbModel";

enum Api {
    SUBMIT_WJS_INVEST_ORDER = 'mg/slpay/submitWJSInvestOrderXX',
    UPDATE_MEMBER_WJS_CONFIRM_LAZY_FLAG = 'mg/slpay/updateMemberWJSConfirmLazyFlag',
    GET_DIGITAL_TOKE_EXCHANGE_FROM_SC = 'mg/secret/getDigitalTokeExchangeFromSc',
    SHOW_LIMIT_ACCT = 'mg/limitAcct/show',
    GET_EXCHANGE_RATIOIN_DC_TO_CNY = 'mg/secret/getExchangeRatioinDcToCny',

    BANK_CARD_RECHARGE_SUSD = 'mg/ytpay/bankCardRechargeSUSD',
    SALE_SUSD_FROM_SLB = 'mg/ytpay/saleSusdFromSlb',
    GET_MERCHANT_BY_M_CODE_AND_MQCODE = 'mg/slpay/getMerchantBymCodeAndMqcCode',
    PAY_SHOP_MONEY_FOR_DC = 'mg/slpay/payShopMoneyForDc',
    PAY_CREDIT_RETURN_FOR_DC = 'mg/slpay/payCreditReturnForDc',

    REFRESH_GET_PAY_ORDER = 'mg/slpay/refreshGetPayOrder'
}

// 增加秘密会员国际文化产业交易所投资订单
export const submitWJSInvestOrder = (p: any) => httpGet<IBaseResT>(Api.SUBMIT_WJS_INVEST_ORDER, p)
/**
 * @description 文交所是否延期
 * @param p
 * @returns
 */
export const updateMemberWJSConfirmLazyFlag = (p: IUpdateMemberWJSConfirmLazyFlagModel) => httpGet<IBaseResT>(Api.UPDATE_MEMBER_WJS_CONFIRM_LAZY_FLAG, p)

/**
 * @description 各幣種匯率
 */
export const getDigitalTokeExchangeFromSc = () => httpGet<IBaseResT>(Api.GET_DIGITAL_TOKE_EXCHANGE_FROM_SC)

/**
 * @description 數點兌換時，所限額度
 */
export const showLimitAcct = (p: IShowLimitAcctModel) => httpGet<IShowLimitAcctRes>(Api.SHOW_LIMIT_ACCT, p)

/**
 * @description 人民幣對susd的換算
 */
export const getExchangeRatioinDcToCny = (p: IGetExchangeRatioinDcToCnyModel) => httpGet<IBaseResT>(Api.GET_EXCHANGE_RATIOIN_DC_TO_CNY, p, { showLoading: false })


/**
 * @description 數點兌換時，支付方式為銀行卡轉賬
 */
export const bankCardRechargeSUSD = (p: ISaleSusdFromSlbModel) => httpGet<IBaseResT>(Api.BANK_CARD_RECHARGE_SUSD, p)

/**
 * @description 數點兌換時，支付方式為微信（支付寶）
 */
export const saleSusdFromSlb = (p: ISaleSusdFromSlbModel) => httpGet<IBaseResT>(Api.SALE_SUSD_FROM_SLB, p, { showLoading: false })

/**
 * @description 通过支付码参数获取商户信息
 */
export const getMerchantBymCodeAndMqcCode = (p: { id: string, mqcCode: string }) => httpPost<IBaseResT>(Api.GET_MERCHANT_BY_M_CODE_AND_MQCODE, p, { showLoading: false })

/**
 * @description 到店付支付货款
 */
export const payShopMoneyForDc = (p: any) => httpPost<IBaseResT>(Api.PAY_SHOP_MONEY_FOR_DC, p)

/**
 * @description 信用卡还款
 */
export const payCreditReturnForDc = (p: any) => httpPost<IBaseResT>(Api.PAY_CREDIT_RETURN_FOR_DC, p)


/**
 * @description  实时获取支付订单信息
 * @param p
 */
export const refreshGetPayOrder = (p: { orderCode: number }) => httpPost<IBaseResT>(Api.REFRESH_GET_PAY_ORDER, p, { showLoading: false })
