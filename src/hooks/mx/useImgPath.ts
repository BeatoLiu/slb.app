import { picName } from '../../utils/config'
/**
 * @description 數據庫只存了圖片的半部分地址，所以需要拼接成完整的網絡地址
 * @returns 返回一個方法
 */
export const useImgPath = () => {
    /**
     * 
     * @param halfImg 圖片地址
     * @returns 返回該圖片的完整地址
     */
    const imgPath = (halfImg: string) => {
        return picName + halfImg.substring(0, halfImg.lastIndexOf('.')) + '_o' + halfImg.substring(halfImg.lastIndexOf('.'))
    }
    return {
        imgPath
    }
}