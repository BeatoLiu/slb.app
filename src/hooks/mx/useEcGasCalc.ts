import { getEcGasCalcPower } from "@/apis/mx"
import { ref } from "vue"

/**
 * @description 计算算力
 */
export const useEcGasCalc = () => {
	const calcPower = async (mCode: number, price: number) => {
		const power = ref(0)
		const res = await getEcGasCalcPower({ mCode, price })
		if (res.resultCode === 1) {
			power.value = +res.data } return power
		}
	return calcPower
}
