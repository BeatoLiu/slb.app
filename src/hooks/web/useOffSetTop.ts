import { isIOSorANDROID } from "@/utils"
/**
 * @description 因蘋果手機有劉海，所以需要處理部分有sticky組件的頁面頂部距離
 * @param level
 */
export const useOffSetTop = (level = 1) => {
	let offSetTop: number = 46 + 44 * level
	if (isIOSorANDROID() !== 'ios') {
		offSetTop = offSetTop - 44
	}
	return { offSetTop }
}
