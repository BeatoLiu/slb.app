export interface IListItem {
	[key: string]: any
}

/**
 * @description 地址选择时的省市区
 * @param province_list 省
 * @param city_list 市
 * @param county_list 区
 */
export interface IAreaModel {
	areaList: {
		// eslint-disable-next-line camelcase
		province_list: IListItem
		// eslint-disable-next-line camelcase
		city_list: IListItem
		// eslint-disable-next-line camelcase
		county_list: IListItem
	}
}
