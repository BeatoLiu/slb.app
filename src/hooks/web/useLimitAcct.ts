import { showLimitAcct } from '@/apis/slb'
/**
 * @description 用于查询不同业务下不同货币的限额
 */
export default () => {

	/**
	 * @description 查询不同业务下不同货币的限额
	 * @param laCode 记录编号
	 */
	const getLimitAcct = async (laCode: number) => {
		const res = await showLimitAcct({ laCode })
		if (res.resultCode === 1) {
			return res.data
		}

	}
	return { getLimitAcct }
}
