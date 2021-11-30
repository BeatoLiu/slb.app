/**
 * @description 將時間格式改為“9/25”
 * @returns 
 */
export const useFormatDayMonth = () => {
    const formatDayMonth = (date: Date) => {
        return `${date.getMonth() + 1}/${date.getDate()}`
    }

    return { formatDayMonth }
}