import { RootState } from '@/store'
import { Module } from 'vuex'
import * as types from '../mutations.type'
import { UserStateTypes } from './interface'

// console.log(JSON.parse(localStorage.userInfo || "{}"))
const state: UserStateTypes = {
	buyOrderDetail: {
		cRecPayType: 0,
		name: '',
		mName: '',
		className: '',
		dis: 0,
		cPicName: 0,
		poGroupType: 0,
		poMCode: 0,
		poPaySum: 0,
		poPayFactSum: 0,
		number: 0,
		poCount: 0,
		poType: 0,
		gpoType: 0,
		gpoCode: 0,
		proCode: 0,
		poAttach: {
			daCode: '',
			gpoType: 0,
			gpoCode: 0,
			proCode: 0
		},
		orderList: [
			{
				podList: [
					{
						prdCsCode: 0,
						prdPrice: 0,
						prdCount: 0,
						prdSum: 0,
						prdFactSum: 0
					}
				],
				oPaySum: 0,
				oPayFactSum: 0,
				mCode: 0,
				oCount: 0
			}
		],
		detailList: [
			{
				prdCCode: 0,
				prdCsCode: 0,
				prdPrice: 0,
				prdCount: 0,
				prdSum: 0,
				prdFactSum: 0,
				prdCName: ''
			}
		]
	},
	deliveryAddress: {
		daCode: 0,
		daName: '',
		daMobile: '',
		aName: '',
		aCode: 0,
		daDetailAddress: '',
		daAcquiesceType: 0
	},
	userInfo: JSON.parse(localStorage.userInfo || '{}') || {
		memCode: 0,
		memName: '',
		token: '',
		walletUrl: '',
		allianceWallet: '',
		hasAllianceWalletPwd: '无'
	},
	walletBalance: JSON.parse(localStorage.walletBalance || '{}') || {
		mwCurrencyType: -1,
		mwCurrencyTypeName: '',
		mwAmount: 0
	}
}

const UserModule: Module<UserStateTypes, RootState> = {
	namespaced: true,
	state,
	getters: {
		// 秘选提交的订单
		getBuyOrderDetail: state => {
			return state.buyOrderDetail
		},
		// 秘选的收货地址
		getDeliveryAddress: state => state.deliveryAddress,

		// 用户信息
		getUserInfo: state => state.userInfo,
		// 当前操作的币的余额信息
		getWalletBalance: state => state.walletBalance
	},
	actions: {
		buyProduct({ commit }, orderDetail) {
			commit(types.BUY_PRODUCT, orderDetail)
		},
		deliveryAddress({ commit }, deliveryAddress) {
			commit(types.DELIVERY_ADDRESS, deliveryAddress)
		},
		setUserInfo({ commit }, userInfo) {
			localStorage.setItem('userInfo', JSON.stringify(userInfo))
			commit(types.USER_INFO, userInfo)
		},
		setWalletBalance({ commit }, walletBalance) {
			localStorage.setItem('walletBalance', JSON.stringify(walletBalance))
			commit(types.WALLET_BALANCE, walletBalance)
		}
	},
	mutations: {
		[types.BUY_PRODUCT](state, orderDetail) {
			state.buyOrderDetail = orderDetail
		},
		[types.DELIVERY_ADDRESS](state, deliveryAddress) {
			state.deliveryAddress = deliveryAddress
		},
		[types.USER_INFO](state, userInfo) {
			state.userInfo = userInfo
		},
		[types.WALLET_BALANCE](state, walletBalance) {
			state.walletBalance = walletBalance
		}
	}
}

export default UserModule
