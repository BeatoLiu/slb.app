import { getMemberWallet } from "@/apis/tAA"

/**
 * @description 获取会员对应币种账户钱包余额
 * @param p.currencyType 币种类型 1现金， 6秘密sie 7susd 8pic(派付)9Def 10usdt  #11TAA #13ETH #14BTC #15GAS #16BNB  #17BNB_USDT #18ZSDT
 */
export default async (p: { currencyType: number }) => {
	let rest = 0
	const res = await getMemberWallet(p)
	if (res.resultCode === 1) {
		rest = res.data
	}

	return rest
}
