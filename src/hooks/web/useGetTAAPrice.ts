import { getTAAPrice } from "@/apis/common"
import { ref } from "vue"
/**
 * @description 獲取taa價格
 * @returns taa價格
 */
export const useGetTAAPrice = () => {
	const taaPrice = ref(2)
	getTAAPrice().then(res => {
		if (res.resultCode === 1) {
			taaPrice.value = res.data
		}
	})

	return { taaPrice }
}
