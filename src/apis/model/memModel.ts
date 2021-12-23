import { IBaseResList, IBaseResT } from "./base";

/** 餘額信息 */
interface IGetMemberCashAcctInfo {
    acctCash: number;
    acctSie: number;
    acctSusd: number;
    acctPic: number;
    acctDef: number;
    acctTaa: number
}
/**
 * 會員錢包餘額
 */
export type IGetMemberCashAcctRes = IBaseResT<IGetMemberCashAcctInfo>


// 會員收益明細記錄信息
export interface ISelectMemberBenefitListItem {
    createTime: string;
    maSetStatusName: string;
    maRemark: string;
    maBizRemark: string;
    tokenSUm: number;
    tokenName: string;
    maBizTypeName: string;
    maSumCurrencyTypeName: string
    maSum: number;
    maSetStatus: number;
    madCode: number;
    maBizType: number
}

/**
 * 當前帳號為收益人帳號的節點信息
 */
export interface IGetMerchantListItem {
    mLinkName: string;
    rName: string;
    mName: string;
    mAuditStatusDesc: string;
    mMobile: string;
    mCode: number;
    mAuditStatus: number;
    mMoneyProve: string;
    mRole: number
}
/**
 * 當前帳號為收益人帳號的節點列表
 */
export type IGetMerchantListRes = IBaseResList<IGetMerchantListItem>


/**
 * 會員支付節點申請費用
 */
export interface INodePayProxyModel {
    payPlat: string;
    payType: number;
    mCode: number;
    remark: string
}

/**
 * 修改提現帳號
 */
export interface IBindMemberAliPayAcctModel {
    alipayAcct: string;
    certCode: string;
    realName: string
}


/**
 * 修改紅包類型
 */
export interface IChangeIncomeTypeModel {
    incomeType: number
}

/**
 * 地址信息
 */
export interface IShowSelfDeliveryAddressItem {
    daCode: number;
    daName: string;
    daMobile: string;
    aName: string;
    aCode: number;
    daDetailAddress: string;
    daAcquiesceType: number
}
export type IShowSelfDeliveryAddressRes = IBaseResList<IShowSelfDeliveryAddressItem>


/**
 * 地址新增
 */
export interface IAddDeliveryAddressModel {
    daName: string;
    daMobile: string;
    aName: string;
    daOwnerType: number;
    aCode: number
}

/**
 * 設置默認地址（刪除地址）
 */
export interface IModifyAcquiesceDeliveryAddressModel {
    daCode: number;
}

/**
 * 地址修改
 */
export type IModifyDeliveryAddressModel = IAddDeliveryAddressModel & IModifyAcquiesceDeliveryAddressModel

/**
 * @description 设置会员联盟钱包地址对应密码
 * @param allianceWalletPassword pwd
 * @param allianceWalletPasswordConfirm rePwd
 */
export interface ISetMemberAllianceWalletPwdModel {
    allianceWalletPassword: string;
    allianceWalletPasswordConfirm: string;
    vCode: string
}
