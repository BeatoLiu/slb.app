import { ITransferModel } from "@/apis/model/tAAModel";
import { changeWalletAcctOnChainForInZs } from "@/apis/tAA";
import { Button, Field } from "vant";
import { computed, defineComponent, reactive, StyleValue } from "vue-demi";
import { useRouter } from "vue-router";

import './Transfer.less'
import { useStore } from "@/store";
import slb from "@/utils/jslb-1.0.0";

export default defineComponent({
    name: 'TransferFromChain',
    setup() {
        // onMounted(() => {
        //     useMemberWallet({ currencyType: 18 }).then(res => rest.value = res)
        // })
        const store = useStore()
        const wallet = computed(() => store.state.user.userInfo.allianceWallet)
        const walletBalance = computed(() => store.state.user.walletBalance)
        // const rest = ref(0)
        const { replace } = useRouter()
        // 参数
        const params = reactive<Omit<ITransferModel, "allianceWalletPassword">>({
            currencyType: walletBalance.value.mwCurrencyType,
            amount: '',
            toChainAddr: wallet.value
        })

        const dis = computed(() => {
            return !(params.amount.length && params.toChainAddr.length)
        })
        // 提交转账
        const submitTransfer = () => {
            // data.showPop = true
            changeWalletAcctOnChainForInZs(params).then(res => {
                console.log(res)
                if (res.resultCode === 1) {
                    const params1 = res.data
                    const payParams = {
                        amount: params.amount,
                        orderCode: params1.orderCode + '',
                        toAddr: params1.walletUrl,
                        currencyType: walletBalance.value.mwCurrencyType + ''
                    }
                    slb.tokenPocketPaid(payParams)
                    replace({ path: '/chainPayResult' })
                }
            })
        }
        const tips = () => {
            const DivStyle = { textAlign: 'right', lineHeight: '44px', paddingRight: '16px', height: '44px' } as StyleValue
            const errorStyle = { color: '#ee0a24', }
            // const tipStyle = { color: '#1989fa' }
            if (!(params.amount.length && +params.amount >= 0)) {
                return (
                    <div style={DivStyle}>
                        <span style={errorStyle}>请输入正确的金额</span>
                    </div>
                )
                // } else if (rest.value < 1) {
                //     return (
                //         <div style={DivStylle}>
                //             <span style={errorStyle}>ZSDT余额不足，</span>
                //             <span style={tipStyle} onClick={() => push('/slb/payForSUSD')}>去充值</span>
                //         </div>
                //     )
            } else {
                return <div style={ DivStyle }/>
            }
        }
        return () => (
            <div class="transfer">
                <div class="top">
                    <p>{walletBalance.value.mwCurrencyTypeName}</p>
                    {/* <p>{walletBalance.value.mwAmount}</p> */}
                </div>
                <div class="container">
                    <p class="title">提回到数联宝钱包</p>
                    <Field placeholder="接收方地址" disabled v-model={params.toChainAddr}/>


                    <Field
                        type="number"
                        v-model={params.amount}
                        placeholder='请输入付款金额'
                        label="付款金额"
                        input-align="right"
                        clearable/>

                    {/* <Field readonly label="矿工费" model-value={"1 ZSDT"} input-align="right" ></Field> */}
                    {tips()}
                </div>
                <div class="page-tips">
                    <p class="title">温馨提示：</p>
                    <div>
                        <p>链上钱包操作，需要矿工费</p>
                    </div>
                </div>
                <Button type="primary" size="large" class="btn" disabled={dis.value} onClick={submitTransfer}>确认</Button>

            </div>
        )
    }
})
