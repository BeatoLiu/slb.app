import { transferModel } from "@/apis/model/tAAModel";
import { transfer } from "@/apis/tAA";
import { Button, Dialog, Field, Icon, Toast } from "vant";
import { computed, defineComponent, onMounted, reactive, ref, StyleValue } from "vue-demi";


import InputPayPWD from "@/components/InputPayPWD";

import slb from '@/utils/jslb-1.0.0'

import './Transfer.less'
import { useStore } from "@/store";

export default defineComponent({
    name: 'Transfer',
    setup() {
        onMounted(() => {
            // (window as any).scanRes = scanRes
            window.scanRes = scanRes
        })
        const store = useStore()
        const walletBalance = computed(() => store.state.user.walletBalance)
        // 参数
        const parmas = reactive<transferModel>({
            currencyType: walletBalance.value.mwCurrencyType,
            amount: '',
            toChainAddr: '',
            allianceWalletPassword: ''
        })
        const data = reactive({
            showPop: false,
            pwdError: ''
        })
        // const payPwd = ref('')
        const dis = computed(() => {
            return !(parmas.amount.length && +parmas.amount <= walletBalance.value.mwAmount && (/^0xzs00/.test(parmas.toChainAddr) && parmas.toChainAddr.length === 40))
        })
        // 扫一扫
        const scan = () => {
            slb.openScan()
        }
        // 扫一扫回调
        const scanRes = (res: string) => {
            if (/^0xzs00/.test(res) && res.length === 40) {
                parmas.toChainAddr = res
            }
            // 啥也不是
            else {
                Toast('非钱包地址')
            }
        }
        const closePop = (pwd?: string) => {
            if (pwd?.length === 6) {
                parmas.allianceWalletPassword = pwd || ''
                // 提交转账
                transfer(parmas).then(async res => {
                    if (res.resultCode === 1) {
                        await store.dispatch('user/setWalletBalance', { ...walletBalance.value, mwAmount: walletBalance.value.mwAmount - (+parmas.amount) })
                        Toast('转账成功')

                        data.showPop = false
                    } else if (res.resultCode === -2) {
                        data.pwdError = res.msg
                    } else if (res.resultCode === -3) {
                        data.pwdError = res.msg
                    }
                })
            } else {
                data.showPop = false
                // data.pwdError = ''
            }
        }
        // 提交转账
        const submitTransfer = () => {
            data.showPop = true
        }
        const tips = () => {
            const DivStylle = { textAlign: 'right', lineHeight: '44px', paddingRight: '16px', height: '44px' } as StyleValue
            const errorStyle = { color: '#ee0a24', }
            if (!(/^0xzs00/.test(parmas.toChainAddr) && parmas.toChainAddr.length === 40)) {
                return (
                    <div style={DivStylle}>
                        <span style={errorStyle}>请输入正确的钱包地址</span>
                    </div>
                )
            } else if (!(parmas.amount.length && +parmas.amount <= walletBalance.value.mwAmount && +parmas.amount > 0)) {
                return (
                    <div style={DivStylle}>
                        <span style={errorStyle}>请输入正确的金额</span>
                    </div>
                )
            } else {
                return <div style={DivStylle}></div>
            }
        }
        return () => (
            <div class="transfer">
                <div class="top">
                    <p>{walletBalance.value.mwCurrencyTypeName}</p>
                    <p>{walletBalance.value.mwAmount}</p>
                </div>
                <div class="container">
                    <p class="title">转账给</p>
                    <Field placeholder="接收方地址" v-model={parmas.toChainAddr} clearable>
                        {{
                            'right-icon': () => (<Icon name="scan" color="#39b9b9" size="20" onClick={scan}></Icon>)
                        }}
                    </Field>
                    <Field
                        type="number"
                        v-model={parmas.amount}
                        placeholder={'请输入付款金额,最多' + walletBalance.value.mwAmount}
                        label="付款金额"
                        input-align="right"
                        clearable
                    >
                    </Field>
                    {tips()}
                </div>
                <Button type="primary" size="large" class="btn" disabled={dis.value} onClick={submitTransfer}>确认转账</Button>
                <InputPayPWD
                    show={data.showPop}
                    onClose={closePop}
                    typeName={walletBalance.value.mwCurrencyTypeName}
                    amount={parmas.amount}
                    pwdError={data.pwdError}
                >
                </InputPayPWD>
            </div>
        )
    }
})