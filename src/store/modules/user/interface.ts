import { IPwdLoginInfo } from '@/apis/model/loginModel'
import { IShowSelfDeliveryAddressItem } from '@/apis/model/memModel'

export interface OrderDetailInfo {
	daCode?: number
	poACode?: number
	poAName?: string
	cRecPayType: number
	name: string
	mName: string
	className: string
	dis: number
	cPicName: number
	poGroupType: number
	poMCode: number // 店主merCode
	poPaySum: number
	poPayFactSum: number
	number: number
	poCount: number
	poType: number // 0销售，1退货
	gpoType: number // 1：团长  0：团员
	gpoCode: number // 开团code
	proCode: number
	poAttach: {
		daCode: string
		gpoType: number // 1：团长  0：团员
		gpoCode: number // 开团code
		proCode: number
	}
	orderList: [
		{
			podList: [
				{
					prdCsCode: number
					prdPrice: number
					prdCount: number
					prdSum: number
					prdFactSum: number
				}
			]
			oPaySum: number
			oPayFactSum: number
			mCode: number
			oCount: number
		}
	]
	detailList: [
		{
			prdCCode: number
			prdCsCode: number
			prdPrice: number
			prdCount: number
			prdSum: number
			prdFactSum: number
			prdCName: string
		}
	]
}

export interface IWalletBalance {
	mwCurrencyType: number
	mwAmount: number
	mwCurrencyTypeName: string
}
export interface UserStateTypes {
	buyOrderDetail: OrderDetailInfo
	deliveryAddress: IShowSelfDeliveryAddressItem
	userInfo: IPwdLoginInfo
	walletBalance: IWalletBalance
}
