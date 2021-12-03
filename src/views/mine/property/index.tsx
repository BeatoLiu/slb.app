import { getTotalAssets } from "@/apis/tAA";
import { defineComponent, getCurrentInstance, onMounted, ref } from "vue";
import { CellGroup, Cell } from 'vant'

import './index.less'
import { getTotalAssetsItem } from "@/apis/model/tAAModel";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import { gold } from "@/utils";

export default defineComponent({
    name: 'Property',
    setup() {
        const { push } = useRouter()
        // const _gold = gold
        const store = useStore()
        const totalZSDT = ref(0)
        const list = ref<getTotalAssetsItem[]>([])
        const goNext = async (item: getTotalAssetsItem) => {
            // to={{ name: 'Balance', query: { ...item } }}
            const { mwCurrencyType, mwCurrencyTypeName, mwAmount } = item
            await store.dispatch('user/setWalletBalance', { mwCurrencyType, mwCurrencyTypeName, mwAmount })
            push('/mine/property/balance')
        }
        onMounted(() => {
            getTotalAssets().then(res => {
                if (res.resultCode === 1) {
                    totalZSDT.value = res.data.total
                    list.value = res.data.list
                }
            })
        })
        return () => (
            <div class="property">
                <section>
                    <div class="top">
                        <div class="top-top">
                            <p>总资产（ZSDT）</p>
                            <p>{gold(totalZSDT.value)}</p>
                        </div>
                    </div>
                </section>
                <section class="list-container">
                    <CellGroup>
                        {
                            list.value.map(item => {
                                return (
                                    <Cell title={item.mwCurrencyTypeName} label={'价格：' + gold(item.exchangeRate) + '(zsdt)'} onClick={() => goNext(item)} isLink center>
                                        {{
                                            value: () => (
                                                <div>
                                                    <p class="amount">{gold(item.mwAmount)}</p>
                                                    <p class="exchange-amount">资产：{gold(item.exchangeNum)}(zsdt)</p>
                                                </div>
                                            )
                                        }}
                                    </Cell>
                                )
                            })
                        }
                    </CellGroup>
                </section>
            </div>
        )
    }
})
