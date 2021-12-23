import { IBaseResT } from './base'
/** --------------------------------request---------------------------------------------------- */

/**
 * 登錄參數
 */
export type IPwdLoginModel = {
    memMobile: string;
    memPassword: string
}

/**
 * 註冊(和修改密碼,兩者相同)參數
 */
export type IRegisterModel = IPwdLoginModel & {
    vCode: string;
    memChannel: number
}


/** ---------------------------------response item----------------------------------------- */

export interface IPwdLoginInfo {
    walletUrl: string;
    memCode: number;
    memName: string;
    token: string;
    allianceWallet: string;
    hasAllianceWalletPwd: string
}

/** ---------------------------------response----------------------------------------- */
/**
 * 登錄結果
 */
export type IPwdLoginRes = IBaseResT<IPwdLoginInfo>
