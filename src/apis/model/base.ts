/**
 * 时间
 */
export interface IBaseDateParams {
	startTime: string
	endTime: string
}

/**
 * 请求分页参数
 */
export interface IBasePageParams {
	pageSize: number
	pageNum: number
}

export type IBasePageDateParams = IBaseDateParams & IBasePageParams

/**
 * 返回結果
 */
export interface IBaseRes {
	resultCode: number
	msg: string
}
/**
 * 分頁信息
 */
export type DataList<T> = {
	total: number
	pageNum: number
	pageSize: number
	pageCount: number
	dataIn: T[]
}

// 返回有分頁的結果
export type IBaseResPageList<T> = IBaseRes & {
	data: DataList<T>
}
// 無分頁,有些數據少，無須分頁，只要返回數組就行
// t = any 相當於默認值，即在不需要的時候可以不傳
export type IBaseResList<T> = IBaseRes & {
	data: T[]
}

// 無分頁, 可能是個字符串，可能是個對象，可能是數字
// t = any 相當於默認值，即在不需要的時候可以不傳
/* eslint-disable @typescript-eslint/no-explicit-any */
export type IBaseResT<T = any> = IBaseRes & {
	data: T
}
