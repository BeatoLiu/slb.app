import { httpPost } from './axios'
import { IBaseResT } from './model/base'
import { IGetProductDetailStyleModel, IGetProductSkuImageMode, IGetProductSkuImageRes, ISku } from './model/jdModel'

enum Apis {
	GET_PRODUCT_DETAIL = 'mg/jd/getProductDetail',
	GET_PRODUCT_DETAIL_STYLE = 'mg/jd/getProductDetailStyle',
	GET_PRODUCT_SKU_IMAGE = 'mg/jd/getProductSkuImage',
	GET_PRODUCT_SELL_PRICE = 'mg/jd/getProductSellPrice'
}

/**
 * @description 查询京东商品详情
 * @param p
 * @returns
 */
export const getProductDetail = (p: ISku) => httpPost<IBaseResT>(Apis.GET_PRODUCT_DETAIL, p)

/**
 * @description 查询商品样式
 * @param p
 * @returns
 */
export const getProductDetailStyle = (p: IGetProductDetailStyleModel) =>
	httpPost<IBaseResT<string>>(Apis.GET_PRODUCT_DETAIL_STYLE, p)

/**
 * @description 查询商品图片:查询单个商品的主图、轮播图
 * @param p
 * @returns
 */
export const getProductSkuImage = (p: IGetProductSkuImageMode) =>
	httpPost<IGetProductSkuImageRes>(Apis.GET_PRODUCT_SKU_IMAGE, p)

/**
 * @description  查询商品售卖价：批量查询商品售卖价。查询在客户商品池中的商品价格。
 * @param p
 * @returns
 */
export const getProductSellPrice = (p: IGetProductSkuImageMode) => httpPost<IBaseResT>(Apis.GET_PRODUCT_SELL_PRICE, p)
