/**
 * @description 用于添加全局属性（方法）,不用了，不能通过ts校验，在main里写了
 * @example
 * declare module '@vue/runtime-core' {
 *     interface ComponentCustomProperties {
 *          $filters: (value: number | string) => string;
 *          $aa: number
 *     }
 * }
 * 也没用,代码里还是飘红，说找不到属性(注：上面的声明不能写在.d.ts文件中，会报错)
 */
export default {
    install: (app: any) => {
        app.config.globalProperties.$aa = 11
        app.config.globalProperties.$filters = function gold(value: number | string) {
            const arr = value.toString().split('.')
            if (arr.length === 2) {
                if (arr[1].length > 6) {
                    return Number(value).toFixed(6)
                }
            }
            return value
        }

    }
}
