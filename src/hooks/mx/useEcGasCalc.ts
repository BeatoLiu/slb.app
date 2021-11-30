import { getEcGasCalcPower } from "@/apis/mx"
import { ref } from "vue"

/**
 * @description 計算gas算力
 * @returns 
 */
export const useEcGasCalc = () => {
    const calcPower = async (mCode: number, price: number) => {
        const power = ref(0)
        const res = await getEcGasCalcPower({ mCode, price })
        if (res.resultCode === 1) {
            power.value = +res.data
        }
        return power
    }
    return calcPower
}