import { sendSmsCode } from "@/apis/common";
import { ISmsModel } from "@/apis/model/commonModel";
import { checkPhone } from "@/utils";
import { Toast } from "vant";
/**
 * @description 發送短信
 * @param p
 * @returns
 */
export const useSendSms = async (p: ISmsModel) => {
    let status = 0
    if (checkPhone(p.phoneNum)) {
        const res = await sendSmsCode(p)
        if (res.resultCode === 1) {
            status = 1
            Toast('短信发送成功')
        }
    }
    return { status }
}
