/**
 * @description 計算商品算力
 */
export const useCalcPower = (gCommission: number) => {
    let calcPower
    if (gCommission <= 1) {
        calcPower = (gCommission * 0.70).toFixed(2)
    } else if (gCommission > 1 && gCommission <= 10) {
        calcPower = (gCommission * 0.65).toFixed(2)
    } else if (gCommission > 10 && gCommission <= 20) {
        calcPower = (gCommission * 0.60).toFixed(2)
    } else if (gCommission > 20 && gCommission <= 30) {
        calcPower = (gCommission * 0.55).toFixed(2)
    } else if (gCommission > 30 && gCommission <= 40) {
        calcPower = (gCommission * 0.50).toFixed(2)
    } else if (gCommission > 40 && gCommission <= 50) {
        calcPower = (gCommission * 0.45).toFixed(2)
    } else {
        calcPower = (gCommission * 0.40).toFixed(2)
    }
    // 除二，是taa數量
    return Number(calcPower)
}