import { httpPost } from "@/apis/axios"
import { IBaseResT } from "@/apis/model/base"
import Compressor from 'compressorjs'
import { Toast } from "vant"
/**
 * @description 上傳圖片用
 * @returns
 */
export const useUploadImg = () => {
    /**
     * @description 上傳圖片
     * @param file 要上傳的文件
     * @param api 上傳的接口地址
     * @param params 其它額外參數
     * @returns 圖片上傳結果
     */
    const uploadImg = (file: File, api: string, params: FormData): Promise<IBaseResT> => {
        return new Promise((resolve) => {
            // 壓縮
			// eslint-disable-next-line no-new
            new Compressor(file, {
                quality: 0.6,
                convertSize: 2000000,
                // The compression process is asynchronous,
                // which means you have to access the `result` in the `success` hook function.
                async success(result) {
                    if (result.size / 2048 > 1024) {
                        return Toast('图片过大，请重新选择图片')
                    }
                    // console.log(result)
                    params.append('file', result, file.name)
                    const res = await httpPost<IBaseResT>(api, params)
                    if (res.resultCode === 1) {
                        Toast('图片上传成功')
                    }
                    resolve(res as unknown as Promise<IBaseResT>)

                },
                error(err) {
                    Toast(err.message)
                    console.log(err.message)
                }
            })
        })

    }

    return { uploadImg }
}
