
/**
 * @param amount 转账金额
 * @param orderCode 订单编号
 * @param toAddr 转账地址
 * @param currencyType 转账币种
 */
interface ItokenPocketPaid {
	amount: string;
	orderCode: string;
	toAddr: string;
	currencyType?: string
}
declare namespace slb {

	/**
	 * @description 唤起扫一扫
	 * @param options
	 */
	function qrScan(options?: any): void;

	/**
	 * @description 唤起扫一扫
	 * @param options
	 */
	function qrScan2(options?: any): void;

	/**
	 * @description 唤起扫一扫
	 * @param options
	 */
	function qrScan3(options?: any): void;

	/**
	 * @description 唤起tp钱包
	 * @param params
	 */
	function tokenPocketPaid(params: ItokenPocketPaid): void;

	/**
	 * @description 清除缓存
	 */
	function clearCache(): void;

	/**
	 * @description 清除缓存
	 * @param url 地址
	 */
	function clearCacheHistory(url: string): void;

	/**
	 * @description 清除缓存
	 * @param url 地址
	 */
	function clearCacheFile(url: string): void;

	/**
	 * @description 打开第三方网址
	 * @param url 地址
	 */
	function openAgentManagerUrl(url: string): void;

	/**
	 * @description 获取app版本
	 */
	function getVersionInfo(): string;
}
export default slb;
