import { transferModel } from "@/apis/model/tAAModel";
import { changeWalletAcctOnChainForOutZs } from "@/apis/tAA";
import { Button, Field, Toast } from "vant";
import { computed, defineComponent, onMounted, reactive, ref, StyleValue } from "vue-demi";
import { useRouter } from "vue-router";

import InputPayPWD from "@/components/InputPayPWD";

// import slb from '@/utils/jslb-1.0.0'

import './Transfer.less'
import { useStore } from "@/store";
import useMemberWallet from "@/hooks/web/useMemberWallet";
import { gold } from "@/utils";

export default defineComponent({
    name: 'TransferToChain',
    setup() {
        onMounted(() => {
            useMemberWallet({ currencyType: 18 }).then(res => rest.value = res)
        })
        const store = useStore()
        const wallet = computed(() => store.state.user.userInfo.walletUrl)
        const walletBalance = computed(() => store.state.user.walletBalance)
        const rest = ref(0)
        const { push } = useRouter()
        // 参数
        const parmas = reactive<transferModel>({
            currencyType: walletBalance.value.mwCurrencyType,
            amount: '',
            toChainAddr: wallet.value,
            allianceWalletPassword: ''
        })
        const data = reactive({
            showPop: false,
            pwdError: '',
            // 转账信息填写是否有误
            inputError: false
        })
        const dis = computed(() => {
            return (
                data.inputError
            )
        })
        const closePop = (pwd?: string) => {
            if (pwd?.length === 6) {
                parmas.allianceWalletPassword = pwd || ''
                // 提交转账
                changeWalletAcctOnChainForOutZs(parmas).then(async res => {
                    if (res.resultCode === 1 || res.resultCode === 98) {
                        await store.dispatch('user/setWalletBalance', {
                            ...walletBalance.value,
                            mwAmount: walletBalance.value.mwAmount - (+parmas.amount) - (walletBalance.value.mwCurrencyType === 18 ? 1 : 0)
                        })
                        Toast('转账成功，请到链上钱包查看到账情况')
                        data.showPop = false
                    } else if (res.resultCode === -2) {
                        data.pwdError = res.msg
                    } else if (res.resultCode === -3) {
                        data.pwdError = res.msg
                    }
                })
            } else {
                data.showPop = false
                data.pwdError = ''
            }
        }
        // 提交转账
        const submitTransfer = () => {
            data.showPop = true
        }
        // !为什么在输入金额时，这个方法会执行两次
        const tips = () => {
            if (rest.value < 1) {
                data.inputError = true
                return (
                    <div class="err-container">
                        <span class="error">ZSDT余额不足，</span>
                        <span class="tips" onClick={() => push('/slb/payForSUSD')}>去充值</span>
                    </div>
                )
            }
            if (!parmas.toChainAddr) {
                data.inputError = true
                return (
                    <div class="err-container">
                        <span class="error">未绑定链上钱包地址，</span>
                        <span class="tips" onClick={() => push('/TAA/updateWallet')}>去绑定</span>
                    </div>
                )
            }
            if (walletBalance.value.mwCurrencyType === 18) {
                if (!(+parmas.amount <= +(walletBalance.value.mwAmount - 1).toFixed(5) && +parmas.amount > 0)) {
                    data.inputError = true
                    return (
                        <div class="err-container">
                            <span class="error">请输入正确的金额</span>
                        </div>
                    )
                }
            } else {
                if (!(+parmas.amount <= walletBalance.value.mwAmount && +parmas.amount > 0)) {
                    data.inputError = true
                    return (
                        <div class="err-container">
                            <span class="error">请输入正确的金额</span>
                        </div>
                    )
                }
            }

            data.inputError = false
            return <div class="err-container"></div>

        }
        return () => (
            <div class="transfer">
                <div class="top">
                    <p>{walletBalance.value.mwCurrencyTypeName}</p>
                    <p>{gold(walletBalance.value.mwAmount)}</p>
                </div>
                <div class="container">
                    <p class="title">转账给</p>
                    <Field placeholder="接收方地址" disabled v-model={parmas.toChainAddr}>
                        {{
                            // 'right-icon': () => (<Icon name="scan" color="#39b9b9" size="20" onClick={scan}></Icon>)
                        }}
                    </Field>
                    <Field
                        type="number"
                        v-model={parmas.amount}
                        placeholder={'请输入付款金额,最多' + gold(walletBalance.value.mwAmount - (walletBalance.value.mwCurrencyType === 18 ? 1 : 0))}
                        label="付款金额"
                        input-align="right"
                        clearable>
                    </Field>
                    <Field readonly label="矿工费" model-value={"1 ZSDT"} input-align="right" ></Field>
                    {tips()}
                </div>
                <div class="page-tips">
                    <p class="title">温馨提示：</p>
                    <div>
                        <p>转账到链上钱包，需要矿工费</p>
                    </div>
                </div>
                <Button type="primary" size="large" class="btn" disabled={dis.value} onClick={submitTransfer}>确认</Button>
                <InputPayPWD
                    show={data.showPop}
                    onClose={closePop}
                    typeName={walletBalance.value.mwCurrencyTypeName}
                    amount={parmas.amount}
                    pwdError={data.pwdError}>
                </InputPayPWD>
            </div>
        )
    }
})
