import { getProductDetail, getProductSellPrice, getProductSkuImage} from "@/apis/jd";
import { defineComponent, onMounted, ref } from "vue-demi";
import { Swipe, SwipeItem, Image } from 'vant'
import { jdImgPath } from '@/utils/config'
import { IGetProductSkuImageItem } from "@/apis/model/jdModel";

export default defineComponent({
    name: 'Jd-index',
    setup() {
        const intr = ref('')
        const param = ref('')
        const images = ref<IGetProductSkuImageItem[]>([])
        onMounted(() => {
            getProductDetail({ sku: 204074 }).then(res => {
                if (res.resultCode === 1) {
                    const obj = res.data
                    // console.log(obj.introduction.match(/width:750px;/g))
                    intr.value = obj.introduction.replace(/width:750px;/g, '')
                    param.value = obj.param
                    // console.log(obj)
                }
            })

            getProductSkuImage({ skuIdList: [204074] }).then(res => {
                if (res.resultCode === 1) {
                    images.value = res.data[204074]
                }
            })
            getProductSellPrice({ skuIdList: [204074] }).then(res => {
                if (res.resultCode === 1) {
                    // images.value = res.data[204074]
                }
            })
            // getProductDetailStyle({ sku: 204074, queryExts: ['appStyleUrl'] }).then(res => {
            //     if (res.resultCode === 1) {
            //         const obj = JSON.parse(res.data)
            //         styles.value = obj.appStyleContent
            //         console.log(obj)
            //     }
            // })
        })
        return () => (
            <div >
                {/* <div innerHTML={styles.value}></div> */}
                <Swipe>
                    {images.value.map((image) => (
                        <SwipeItem key={image.id}>
                            <Image src={jdImgPath + 's750x750_' + image.path} />
                        </SwipeItem>
                    ))}
                </Swipe>
                <div innerHTML={intr.value} />
                <div innerHTML={param.value}/>
            </div>
        )
    }
})
