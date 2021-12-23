import { computed, ref } from "vue"

// import BankCard from '../../components/BankCard'
import scImg from '../../assets/img/payLogo/sc.png'
import alipayImg from '../../assets/img/payLogo/zhifubao.png'
import wxImg from '../../assets/img/payLogo/weixin.png'
import bankImg from '../../assets/img/payLogo/rmb.png'

interface payTypeModel {
	susdShow?: boolean;
	usdtShow?: boolean;
	alipayShow?: boolean;
	wxShow?: boolean;
	bankShow?: boolean

}
export const usePayType = ({ susdShow = false, usdtShow = false, alipayShow = true, wxShow = true, bankShow = true }: payTypeModel = {}) => {
	// console.log(options)
	const payType = ref([
		{
			value: 'susd',
			label: 'SUSD',
			imgSrc: scImg,
			dSubCode: '7',
			isShow: susdShow,
			dis: false
		},
		{
			value: 'usdt',
			label: 'USDT',
			imgSrc: scImg,
			dSubCode: '10',
			isShow: usdtShow,
			dis: false
		},
		{ value: 'alipay', label: '支付宝', dSubCode: '1', imgSrc: alipayImg, isShow: alipayShow, dis: false },
		{ value: 'wx', label: '微信', dSubCode: '1', imgSrc: wxImg, isShow: wxShow, dis: false },
		{
			value: 'bank',
			label: '银行卡转账',
			dSubCode: '2',
			imgSrc: bankImg,
			isShow: bankShow,
			dis: false
		}
	])
	const payTypeList = computed(() => {
		// let str = props.cRecPayType || '12'
		return payType.value.filter(item => item.isShow)
	})

	return { payTypeList }
}
