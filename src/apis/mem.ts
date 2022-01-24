import { httpGet, httpPost } from "./axios";
import { IBaseResT } from "./model/base";
import {
	IAddDeliveryAddressModel,
	IBindMemberAliPayAcctModel,
	IBindMemberIdCardInfo,
	IChangeIncomeTypeModel,
	IGetMemberCashAcctRes,
	IGetMerchantListRes,
	IModifyAcquiesceDeliveryAddressModel,
	IModifyDeliveryAddressModel,
	INodePayProxyModel,
	ISetMemberAllianceWalletPwdModel,
	IShowSelfDeliveryAddressItem,
	IShowSelfDeliveryAddressRes
} from './model/memModel';

enum Api {
	GET_MEMBER_CASH_ACCT = 'mem/memberAcct/getMemberCashAcct',
	GET_MERCHANT_LIST = 'mg/merchant/getMerchantList',
	NODE_PAY_PROXY = 'mg/slpay/nodePayProxy',

	PARSE_ALIPAY_ACCT = 'mem/member/parseAliPayAcct',
	BIND_MEMBER_ALIPAY_ACCT = 'mem/member/bindMemberAliPayAcct',
	SEND_BIND_ALIPAY_ACCT_SMS = 'mem/member/sendBindAliPayAcctSms',

	GET_MEMBER_BY_CODE = 'mem/member/getMemberByCode',
	CHANGE_INCOME_TYPE = 'mem/member/changeIncomeType',

	ADD_DELIVERY_ADDRESS = 'mall/info/addDeliveryAddress',
	MODIFY_DELIVERY_ADDRESS = 'mall/info/modifyDeliveryAddress',
	SHOW_SELF_DELIVERY_ADDRESS = 'mall/info/showSelfDeliveryAddress',
	MODIFY_ACQUIESCE_DELIVERY_ADDRESS = 'mall/info/modifyAcquiesceDeliveryAddress',
	DELETE_DELIVERY_ADDRESS = 'mall/info/deletedDeliveryAddress',
	SHOW_ACQUIESCE_DELIVERY_ADDRESS = 'mall/info/showAcquiesceDeliveryAddress',

	SET_MEMBER_ALLIANCE_WALLET_PWD = 'mem/member/setMemberAllianceWalletPwd',
	SET_ALLIANCE_WALLET_PWD_SEND_SMS = 'mem/member/setAllianceWalletPwdSendSms',
	BIND_MEMBER_ID_CARD_INFO = 'mem/member/bindMemberIdCardInfo'

}

/**
 * @description 會員帳戶餘額信息
 * @returns
 */
export const getMemberCashAcct = () => httpGet<IGetMemberCashAcctRes>(Api.GET_MEMBER_CASH_ACCT)

/**
 * @description 會員作為收益人的節點列表
 * @returns
 */
export const getMerchantList = () => httpGet<IGetMerchantListRes>(Api.GET_MERCHANT_LIST)

/**
 * @description 會員支付節點申請費用
 * @returns
 */
export const nodePayProxy = (p: INodePayProxyModel) => httpGet<IBaseResT>(Api.NODE_PAY_PROXY, p)

/**
 * @description 查詢會員收益帳號
 * @returns
 */
export const parseAliPayAcct = () => httpGet<IBaseResT>(Api.PARSE_ALIPAY_ACCT)

/**
* @description 修改提現帳號時，發送短信驗證碼
* @returns
*/
export const sendBindAliPayAcctSms = () => httpGet<IBaseResT>(Api.SEND_BIND_ALIPAY_ACCT_SMS)

/**
 * @description 會員修改提現帳號
 * @returns
 */
export const bindMemberAliPayAcct = (p: IBindMemberAliPayAcctModel) => httpGet<IBaseResT>(Api.BIND_MEMBER_ALIPAY_ACCT, p)

/**
* @description 查看會員個人信息
* @returns
*/
export const getMemberByCode = () => httpGet<IBaseResT>(Api.GET_MEMBER_BY_CODE)

/**
 * @description 修改紅包類型
 * @returns
 */
export const changeIncomeType = (p: IChangeIncomeTypeModel) => httpGet<IBaseResT>(Api.CHANGE_INCOME_TYPE, p)

/**
* @description 獲取地址
* @returns
*/
export const showSelfDeliveryAddress = () => httpGet<IShowSelfDeliveryAddressRes>(Api.SHOW_SELF_DELIVERY_ADDRESS)

/**
 * @description 新增地址
 * @returns
 */
export const addDeliveryAddress = (p: IAddDeliveryAddressModel) => httpPost<IBaseResT>(Api.ADD_DELIVERY_ADDRESS, p)

/**
* @description 修改地址
* @returns
*/
export const modifyDeliveryAddress = (p: IModifyDeliveryAddressModel) => httpPost<IBaseResT>(Api.MODIFY_DELIVERY_ADDRESS, p)

/**
* @description 設置默認地址
* @returns
*/
export const modifyAcquiesceDeliveryAddress = (p: IModifyAcquiesceDeliveryAddressModel) => httpGet<IBaseResT>(Api.MODIFY_ACQUIESCE_DELIVERY_ADDRESS, p)

/**
 * @description 查询默认地址
 * @returns
 */
export const showAcquiesceDeliveryAddress = () => httpGet<IBaseResT<IShowSelfDeliveryAddressItem>>(Api.SHOW_ACQUIESCE_DELIVERY_ADDRESS)

/**
* @description 刪除地址
* @returns
*/
export const deletedDeliveryAddress = (p: IModifyAcquiesceDeliveryAddressModel) => httpGet<IBaseResT>(Api.DELETE_DELIVERY_ADDRESS, p)

/**
 * @description 设置会员联盟钱包地址对应密码
 * @returns
 */
export const setMemberAllianceWalletPwd = (p: ISetMemberAllianceWalletPwdModel) => httpPost<IBaseResT>(Api.SET_MEMBER_ALLIANCE_WALLET_PWD, p)

/**
 * @description 会员设置联盟钱包支付密码时进行手机号短信的验证
 * @returns
 */
export const setAllianceWalletPwdSendSms = () => httpPost<IBaseResT>(Api.SET_ALLIANCE_WALLET_PWD_SEND_SMS, {})

/**
 * @description 上传身份证
 * @param p
 */
export const bindMemberIdCardInfo = (p: IBindMemberIdCardInfo) => httpPost<IBaseResT>(Api.BIND_MEMBER_ID_CARD_INFO, p)
