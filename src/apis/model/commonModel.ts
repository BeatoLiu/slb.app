import { Ref } from "vue";
import {  IBaseResList } from "./base";

/**
 * 發送短信
 */
export interface ISmsModel {
    phoneNum: string;
    type: number
}


/**
 * 查詢字典
 */
export interface IShowDictionaryModel {
    dType: number
}
export interface IShowDictionaryItem {
    dName: string;
    dSubName: string;
    dSubCode: number;
    dType: number
}
export type IShowDictionaryRes = IBaseResList<IShowDictionaryItem>

/**
 * 查詢地區列表
 */
export interface IShowSubAreaModel {
    parentCode: string;
    type: number
}
interface IShowSubAreaItem {
    currentCode: string;
    currentName: string;
    fullName: string;
    type: number;
    parentCode: string;
    pyName: string
}
export type IShowSubAreaRes = IBaseResList<IShowSubAreaItem>

/** ---------------------------------response-----------------------------------------*/
/**
 * @description 統一下拉刷新的hooks的返回數據
 * @param refreshing 下拉組件PullRefresh的狀態
 * @param loading 加載組件List的加載狀態
 * @param finished List是否加載完成
 * @param dataList 接口返回數據
 * @param onRefresh 下拉組件事件
 * @param onLoad List組件加載事件
 */
export type IPullRefreshListRes<T> = {
    refreshing: Ref<boolean>;
    loading: Ref<boolean>;
    finished: Ref<boolean>;
    dataList: Ref<T[]>;
    onRefresh: (...args: any[]) => any;
    onLoad: (...args: any[]) => any
}
