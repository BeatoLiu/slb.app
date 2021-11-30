import Clipboard from 'clipboard'
import { Toast } from 'vant'
/**
 *@description 用于复制
 *@returns clipboard方法
 */
export default () => {
    /**
     * @description 复制
     * @param selector 节点(.btn #id)
     */
    return function clipboard(selector: string | Element | NodeListOf<Element>, options?: Clipboard.Options & { des: string } | undefined) {
        const clipboard = new Clipboard(selector)
        clipboard.on('success', function (e) {
            Toast((options?.des || '') + '复制成功')
            clipboard.destroy()
        })
        clipboard.on('error', function (e) {
            Toast('您的浏览器不支持点击复制')
            clipboard.destroy()
        })
    }
}