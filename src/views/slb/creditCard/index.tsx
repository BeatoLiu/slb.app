import { deleteCreditCard, showCreditCardList } from "@/apis/bankCard";
import { IShowCreditCardListItem } from "@/apis/model/bankCardModel";
import { defineComponent, onMounted, reactive, ref } from "vue-demi";
import { Button, Dialog, Icon, Toast } from "vant"
import './index.less'
import { useRouter } from "vue-router";

export default defineComponent({
    name: 'CreditCard',
    setup() {
        const { push } = useRouter()
        const dataList = ref<IShowCreditCardListItem[]>([])
        const params = reactive({
            mccCardType: 2
        })
        // 去添加/修改页面
        const add = (id: number) => {
            if (id) {
                push({ name: 'AddCreditCard', query: { id } })
            } else {
                push({ name: 'AddCreditCard' })
            }
        }
        //  删除信用卡
        const removeCredit = (mccCode: number, idx: number) => {
            Dialog.confirm({
                title: '警告',
                message: '确定要执行此操作吗?'
            }).then(() => {
                deleteCreditCard({ mccCode }).then((res) => {
                    if (res.resultCode === 1) {
                        Toast('删除成功成功！')
                        dataList.value.splice(idx, 1)
                    }
                })
            })
        }
        //  去还信用卡界面
        const goPay = (item: IShowCreditCardListItem) => {
            if (item.mccTipFlag !== 1) {
                push({
                    name: 'PayForCredit',
                    query: { id: item.mccCode, name: item.mccCardName, mccBankName: item.mccBankName, cNo: item.mccCard }
                })
            }
        }
        onMounted(() => {
            // 获取信用卡列表
            showCreditCardList(params).then(res => {
                if (res.resultCode === 1) {
                    dataList.value = res.data.dataIn
                }
            })
        })

        return () => {
            const cardItem = dataList.value.map((item, idx) => {
                return (
                    <div class="card-item">
                        <div class="card-name flex-space">
                            <p>
                                {item.mccBankName}
                            </p>
                            <div>
                                <Button
                                    plain
                                    hairline
                                    type="success"
                                    onClick={() => add(item.mccCode)}
                                >
                                    修改
                                </Button>
                                &nbsp;
                                <Button plain hairline type="danger" onClick={() => removeCredit(item.mccCode, idx)}>删除</Button>
                            </div>
                        </div>
                        <div class={item.mccTipFlag === 1 ? 'mccTipFlag card-content' : 'card-content'} onClick={() => goPay(item)}>
                            <p>
                                尾号{item.mccCard.substring(item.mccCard.length - 4)}
                                <span style="color: red" v-show={item.mccTipFlag === 1}>(银行卡异常)</span>
                            </p>
                        </div>
                    </div>
                )
            })
            return (
                <div class="credit-card">
                    {cardItem}
                    <div class="page-tips">
                        <p class="title">温馨提示：</p>
                        <div>
                            <p>1、若银行卡异常，请尽快修改，否则将不能打款</p>
                        </div>
                    </div>
                    <div class="add-card flex-center" onClick={() => add(0)}>
                        <Icon name="plus" /><span>添加银行卡</span>
                    </div>
                </div>
            )
        }
    }
})
