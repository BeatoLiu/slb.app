import { useRouter } from "vue-router";
import { Button, Cell, Field, Icon, Popup, Picker, Toast } from 'vant'
import { getTotalAssetsItem, transferModel } from "@/apis/model/tAAModel";
import { defineComponent, reactive, computed, onMounted, ref, StyleValue } from "vue";
import { getTotalAssets, transfer } from "@/apis/tAA";
import InputPayPWD from "@/components/InputPayPWD";

import './TransferFromScan.less'
import useClipboard from "@/hooks/web/useClipboard";

export default defineComponent({
    name: 'TransferFromScan',
    setup() {
        const { currentRoute, replace, push } = useRouter()
        const walletUrl = currentRoute.value.query.res as string || ''
        if (!walletUrl) {
            replace('/')
        }
        const clipboard = useClipboard()
        // 选中的币种信息
        const walletBalance = reactive({
            mwCurrencyType: -1,
            mwAmount: 0,
            mwCurrencyTypeName: 'TAA'
        })
        // 参数
        const params = reactive<transferModel>({
            currencyType: walletBalance.mwCurrencyType,
            amount: '',
            toChainAddr: walletUrl,
            allianceWalletPassword: ''
        })
        // 支付密码
        const data = reactive({
            showPop: false,
            pwdError: '',
            // 选择币种
            showPicker: false,
            customFieldName: {
                text: 'mwCurrencyTypeName',
            },
            // 矿工费zstd余额
            rest: 0
        })
        // 币种集合
        const list = ref<getTotalAssetsItem[]>([])

        const dis = computed(() => {
            return !(params.amount.length && +params.amount <= +walletBalance.mwAmount && (/^0xzs00/.test(params.toChainAddr) && params.toChainAddr.length === 40))
        })
        // 选择全部
        const chooseAll = () => {
            params.amount = walletBalance.mwAmount + ''
        }
        // 确认选择币种
        const onConfirm = (item: getTotalAssetsItem) => {
            Object.assign(walletBalance, item)
            params.amount = ''
            params.currencyType = item.mwCurrencyType
            data.showPicker = false
        }
        // 点击确定
        const submitTransfer = () => {
            data.showPop = true
        }
        // 输入完密码后
        const closePop = (pwd?: string) => {
            if (pwd?.length === 6) {
                params.allianceWalletPassword = pwd || ''
                // 提交转账
                transfer(params).then(async res => {
                    if (res.resultCode === 1) {
                        // await store.dispatch('user/setWalletBalance', { ...walletBalance.value, mwAmount: walletBalance.value.mwAmount - (+params.amount) })
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
            }
        }

        onMounted(() => {
            getTotalAssets().then(res => {
                if (res.resultCode === 1) {
                    list.value = res.data.list
                    Object.assign(walletBalance, list.value[0])
                    data.rest = list.value.find(item => item.mwCurrencyType === 18)?.mwAmount || 0
                    params.currencyType = walletBalance.mwCurrencyType
                    // console.log(walletBalance, params)
                }
            })
        })
        // 填写必要信息时的提示
        const tips = () => {
            if (!(/^0xzs00/.test(params.toChainAddr) && params.toChainAddr.length === 40)) {
                return (
                    <div class="err-container">
                        <span class="error">钱包地址有误，请重新扫码</span>
                    </div>
                )
            }
            if (!(+params.amount <= walletBalance.mwAmount && +params.amount > 0)) {
                return (
                    <div class="err-container">
                        <span class="error">请输入正确的金额</span>
                    </div>
                )
            }
            if (data.rest < 1) {
                return (
                    <div class="err-container">
                        <span class="error">ZSDT余额不足，</span>
                        <span class="tips" onClick={() => push('/slb/payForSUSD')}>去充值</span>
                    </div>
                )
            } else {
                return <div class="err-container"></div>
            }
        }
        return () => (
            <div class="transfer-scan">
                <div class="top">
                    <div class="flex-space">
                        <p class="title">收款地址</p>
                        <Icon
                            name="column"
                            size="28"
                            color="#39b9b9"
                            class="clip"
                            data-clipboard-text={walletUrl}
                            onClick={() => clipboard('.clip', { des: '地址' })}
                        ></Icon>
                    </div>
                    <Field type="textarea" v-model={walletUrl}></Field>
                </div>
                <div class="container">
                    <p class="title">转账金额</p>
                    <Field
                        type="number"
                        v-model={params.amount}
                        placeholder={'请输入付款金额,最多' + walletBalance.mwAmount}
                        clearable
                    >
                        {{
                            'right-icon': () => (
                                <div class="whole" onClick={chooseAll}>全部</div>
                            )
                        }}
                    </Field>
                    <Cell title="选择币种" value={walletBalance.mwCurrencyTypeName} onClick={() => data.showPicker = true} isLink>
                    </Cell>
                    <Cell title="钱包余额" value={walletBalance.mwAmount} >
                    </Cell>
                    {tips()}
                </div>
                {/* <div class="container">
                    <Field readonly label="矿工费" model-value={"1 ZSDT"} input-align="right" ></Field>
                    {tips()}
                </div> */}
                <Button type="primary" size="large" class="btn" disabled={dis.value} onClick={submitTransfer}>确认转账</Button>

                <InputPayPWD
                    show={data.showPop}
                    onClose={closePop}
                    typeName={walletBalance.mwCurrencyTypeName}
                    amount={params.amount}
                    pwdError={data.pwdError}
                >
                </InputPayPWD>
                <Popup v-model={[data.showPicker, "show"]} round position="bottom">
                    <Picker
                        columns={list.value}
                        columnsFieldNames={data.customFieldName}
                        onCancel={() => data.showPicker = false}
                        onConfirm={onConfirm}
                    />
                </Popup>
            </div>
        )
    }
})