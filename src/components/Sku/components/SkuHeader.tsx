import { defineComponent, PropType } from "vue";
// import { TinyEmitter } from "tiny-emitter";
import { createNamespace } from "vant/lib/utils";
import { BORDER_BOTTOM } from "vant/lib/utils/constant";
import Image from "vant/lib/image";

import type {
    SkuData,
    SkuGoodsData,
    SelectedSkuData,
    SkuListItemData,
} from "../data";

type SelectedValueType = {
    ks: string;
    imgUrl: string;
};

const [name, bem] = createNamespace("sku-header");

// const emitter = new TinyEmitter();

function getSkuImgValue(
    sku: SkuData,
    selectedSku: SelectedSkuData
): SelectedValueType | undefined {
    let imgValue;
    // console.log(sku, selectedSku)
    sku.tree.some((item) => {
        const id = selectedSku[item.k_s];

        if (id && item.v) {
            const matchedSku =
                item.v.filter((skuValue) => skuValue.id === id)[0] || {};

            const img =
                matchedSku.previewImgUrl || matchedSku.imgUrl || matchedSku.img_url;
            if (img) {
                imgValue = {
                    ...matchedSku,
                    ks: item.k_s,
                    imgUrl: img,
                };
                return true;
            }
        }

        return false;
    });

    return imgValue;
}

export default defineComponent({
    name,

    props: {
        sku: Object as PropType<SkuData>,
        goods: Object as PropType<SelectedSkuData>,
        skuEventBus: Object,
        selectedSku: Object,
        showHeaderImage: Boolean,
    },

    setup(props, { slots }) {
        return () => {
            const {
                sku,
                goods,
                skuEventBus,
                selectedSku,
                showHeaderImage = true,
            } = props;

            const selectedValue = getSkuImgValue(
                sku as SkuData,
                selectedSku as SelectedSkuData
            );
            // console.log(selectedValue)
            const imgUrl = selectedValue ? selectedValue.imgUrl : goods?.picture;

            const previewImage = () => {
                // console.log(imgUrl)
                skuEventBus!.emit("sku:previewImage", selectedValue);
            };

            return (
                <div class={[bem(), BORDER_BOTTOM]}>
                    {showHeaderImage && (
                        <Image
                            fit="cover"
                            src={imgUrl}
                            class={bem("img-wrap")}
                            onClick={previewImage}
                        >
                            {slots["sku-header-image-extra"]?.()}
                        </Image>
                    )}
                    <div class={bem("goods-info")}>{slots.default?.()}</div>
                </div>
            );
        };
    },
});
