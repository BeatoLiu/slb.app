import { getExchangeRationDcToCny } from '@/apis/slb'

interface IData {
	laType: number,
	cnyMoney: string,
	laCurrencyType: number
}
/**
 * @description 用于换算不同业务下不同货币的汇率
 */
export default () => {

	/**
	 * @description 换算不同业务下不同货币的汇率
	 * @param data
	 */
	const exchangeRationDcToCny = async (data: IData) => {
		if (data.cnyMoney) {
			const res = await getExchangeRationDcToCny(data)
			if (res.resultCode === 1) {
				return res.data
			}
		} else {
			return 0
		}
	}
	return { exchangeRationDcToCny }
}
