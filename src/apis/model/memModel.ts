import { baseResList, baseResT } from "./base";

/**餘額信息 */
interface getMemberCashAcctInfo {
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
export type getMemberCashAcctRes = baseResT<getMemberCashAcctInfo>


// 會員收益明細記錄信息
export interface selectMemberBenefitListItem {
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
export interface getMerchantListItem {
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
export type getMerchantListRes = baseResList<getMerchantListItem>


/**
 * 會員支付節點申請費用
 */
export interface nodePayProxyModel {
    payPlat: string;
    payType: number;
    mCode: number;
    remark: string
}

/**
 * 修改提現帳號
 */
export interface bindMemberAliPayAcctModel {
    alipayAcct: string;
    certCode: string;
    realName: string
}


/**
 * 修改紅包類型
 */
export interface changeIncomeTypeModel {
    incomeType: number
}

/**
 * 地址信息
 */
export interface showSelfDeliveryAddressItem {
    daCode: number;
    daName: string;
    daMobile: string;
    aName: string;
    aCode: number;
    daDetailAddress: string;
    daAcquiesceType: number
}
export type showSelfDeliveryAddressRes = baseResList<showSelfDeliveryAddressItem>


/**
 * 地址新增
 */
export interface addDeliveryAddressModel {
    daName: string;
    daMobile: string;
    aName: string;
    daOwnerType: number;
    aCode: number
}

/**
 * 設置默認地址（刪除地址）
 */
export interface modifyAcquiesceDeliveryAddressModel {
    daCode: number;
}

/**
 * 地址修改
 */
export type modifyDeliveryAddressModel = addDeliveryAddressModel & modifyAcquiesceDeliveryAddressModel

/**
 * @description 设置会员联盟钱包地址对应密码
 * @param allianceWalletPassword pwd
 * @param allianceWalletPasswordConfirm rePwd
 */
export interface setMemberAllianceWalletPwdModel {
    allianceWalletPassword: string;
    allianceWalletPasswordConfirm: string;
    vCode: string
}


