export interface listItem {
    [key: string]: any
}
export interface areaModel {
    areaList: {
        province_list: listItem
        city_list: listItem
        county_list: listItem
    }
}