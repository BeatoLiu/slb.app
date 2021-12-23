import { computed, defineComponent, onMounted, reactive } from "vue-demi";
import { RadioGroup, Radio, Button, NumberKeyboard, Toast } from 'vant'
import { useRouter } from "vue-router";
import { getExchangeRatioinDcToCny, payCreditReturnForDc, showLimitAcct } from "@/apis/slb";
import InputPayPWD from "@/components/InputPayPWD";
import './PayForCredit.less'
import { showDictionary } from "@/apis/common";

export default defineComponent({
    name: 'PayForCredit',
    setup() {
        const { currentRoute, replace } = useRouter()
        const data = reactive({
            cardInfo: {
                cardName: currentRoute.value.query.mccBankName as string,
                cardNo: currentRoute.value.query.cNo as string,
                linkName: currentRoute.value.query.name as string,
                creditCode: currentRoute.value.query.id as string
            },
            show: false, // 数字键盘
            sum: '',
            exInfo: 0,
            loading: false,
            limitDetail: {
                开始时间: '7:00:00',
                结束时间: '24:00:00',
                开始日期: '',
                结束日期: ''
            },
            limitObj: {
                laSingleLimitLow: 500,
                laSingleLimit: 10000
            },
            bizType: 38, //  1 usdt; 10 zsdt
            payType: 18, //  17 usdt; 18 zsdt
            payTypeName: 'ZSDT',
            laCurrencyType: 18, //  17 usdt; 18 zsdt
            // 支付币种类型
            payTypeList: [
                { value: 18, label: 'ZSDT', isShow: true, dis: false },
                { value: 17, label: 'USDT', isShow: true, dis: true },
            ],
            // 密码
            showPop: false,
            pwdError: '',
        })

        const dis = computed(() => {
            const permissionList = ['512636', '500111', '717260', '500010', '539241', '500012', '999739', '1892076', '657129']
            const memCode = localStorage.getItem('memCode') || ''
            if (permissionList.includes(memCode)) {
                return true
            }

            const h = new Date()
            const timeNow = h.getTime()

            if (data.limitDetail['结束日期']) {
                console.log(new Date(data.limitDetail['开始日期']))
                const startDay = new Date(data.limitDetail['开始日期']).getTime()
                const endDay = new Date(data.limitDetail['结束日期']).getTime()
                if (timeNow > startDay && timeNow < endDay) {
                    return false
                } else {
                    return data.sum
                }
            }

            const day = h.getFullYear() + '/' + (h.getMonth() + 1) + '/' + h.getDate()
            const startTimeStr = data.limitDetail['开始时间'] || '7:00:00'
            const endTimeStr = data.limitDetail['结束时间'] || '24:00:00'
            const startTime = new Date(day + ' ' + startTimeStr).getTime()
            const endTime = new Date(day + ' ' + endTimeStr).getTime()
            if (startTime <= timeNow && timeNow < endTime) {
                return data.sum
            } else {
                return false
            }
        })

        const payTypeListFilter = computed(() => {
            return data.payTypeList.filter((item) => item.isShow)
        })

        const subLinkName = (str: string) => {
            const len = str.length
            let starStr = ''
            for (let i = 1; i < len; i++) {
                starStr += '*'
            }
            return str.substr(0, 1) + starStr
        }

        // 汇率换算
        const exchangeRatioinDcToCny = () => {
            if (data.sum) {
                const params = {
                    laType: 0, // 0买，1卖
                    cnyMoney: +data.sum,
                    laCurrencyType: data.laCurrencyType // 17 usdt; 18 zsdt
                }
                getExchangeRatioinDcToCny(params).then((res) => {
                    if (res.resultCode === 1) {
                        data.exInfo = res.data
                    }
                })
            } else {
                data.exInfo = 0
            }
        }

        const onInput = (value: string) => {
            const reg = /^\d+\.?\d{0,1}$/
            if (reg.test(data.sum) || data.sum === '') {
                data.sum = data.sum + value
            }
            exchangeRatioinDcToCny()
        }
        const onDelete = () => {
            data.sum = data.sum.slice(0, data.sum.length - 1)
            exchangeRatioinDcToCny()
        }
        const complete = () => {
            data.show = false
        }

        const radioChange = (radio: number) => {
            if (radio === 17) {
                data.payTypeName = 'USDT'
                data.laCurrencyType = 17
                data.bizType = 33
            } else if (radio === 18) {
                data.payTypeName = 'ZSDT'
                data.laCurrencyType = 18
                data.bizType = 38
            }
            exchangeRatioinDcToCny()
        }
        const toSign = () => {
            const minMoney = data.limitObj.laSingleLimitLow
            if (+data.sum < minMoney) {
                return Toast('最低还款金额为' + minMoney)
            }
            data.show = false
            data.showPop = true
        }
        // 输入完密码后
        const closePop = (pwd?: string) => {
            if (pwd?.length === 6) {
                const params = {
                    payPlat: data.payTypeName.toLowerCase(),
                    payFactSum: data.exInfo,
                    paySum: data.sum,
                    payType: data.payType,
                    remark: data.payTypeName.toLowerCase() + '还款',
                    bizType: data.bizType,
                    creditCode: data.cardInfo.creditCode,
                    allianceWalletPassword: pwd || ''
                }

                data.loading = true
                payCreditReturnForDc(params)
                    .then(res => {
                        data.loading = false
                        if (res.resultCode === 1) {
                            replace({ name: 'PayResult', query: { orderCode: res.data.orderCode } })
                        } else if (res.resultCode === -2) {
                            data.pwdError = res.msg
                        } else if (res.resultCode === -3) {
                            data.pwdError = res.msg
                        }
                    })
                    .catch(() => {
                        data.loading = false
                    })
            } else {
                data.showPop = false
            }
        }
        onMounted(() => {
            showLimitAcct({ laCode: 10 }).then((res) => {
                if (res.resultCode === 1) {
                    Object.assign(data.limitObj, res.data)
                    // this.limitObj = res.data
                }
            })
            showDictionary({ dType: 42 }).then(res => {
                if (res.resultCode === 1 && res.data.length) {
                    const str = JSON.parse(res.data[0].dSubName)
                    if (str['结束时间']) {
                        data.limitDetail = str
                    }
                }
            })
        })
        return () => {
            return (
                <div class="repayment">
                    <div class="card-desc flex-space">
                        <p>****{data.cardInfo.cardNo.substring(data.cardInfo.cardNo.length - 4)}({data.cardInfo.cardName})</p>
                        <p>{subLinkName(data.cardInfo.linkName)}</p>
                    </div>
                    <div class="box">
                        <p>还款金额</p>
                        <div class="item" onClick={() => {data.show = true}}>
                            <span class="name">￥</span>
                            <div class="money-content">
                                <div class="money-input">
                                    {
                                        !data.sum ?
                                            (<div class={!data.sum ? 'value placeholder no-value' : 'value placeholder'} >请输入还款金额</div>)
                                            :
                                            (<div class="value" >{data.sum}</div>)
                                    }
                                    {
                                        data.show ?
                                            <div class={ !data.sum ? "like-input no-value-like" : "like-input" }/>
                                            : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-space biz-type">
                        <p>支付类型</p>
                        <RadioGroup v-model={[data.payType]} onChange={radioChange} direction="horizontal">
                            {
                                payTypeListFilter.value.map(item => {
                                    return (
                                        <Radio name={item.value} disabled={item.dis} key={item.value}>
                                            {item.label}
                                        </Radio>
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                    <div class="return-fee flex-space">
                        <p>换算</p>
                        <p>
                            {data.exInfo}<span> {data.payTypeName}</span>
                        </p>
                    </div>
                    <div class="page-tips">
                        <p class="title">温馨提示：</p>
                        <div>
                            <p>1、测试期间，还款金额为【{data.limitObj.laSingleLimitLow}-{data.limitObj.laSingleLimit}】之间</p>
                            <p>2、未完善信息的用户，请先完善信息</p>
                            <p>3、还款时间为【{data.limitDetail['开始时间']} — {data.limitDetail['结束时间']}】</p>
                            {
                                data.limitDetail['结束日期'] ?
                                    (<p>
                                        4、{data.limitDetail['开始日期']}-{data.limitDetail['结束日期']}将进行优化，暂时关闭此功能
                                    </p>) : ''
                            }
                        </div>
                    </div>
                    <div class="bottom flex-end">
                        <div>
                            <p>
                                预计支付：<span>{data.exInfo}</span> {data.payTypeName}
                            </p>
                        </div>
                        <div>
                            <Button class="btn" onClick={toSign} disabled={!dis.value} loading={data.loading}>确认还款</Button>
                        </div>
                    </div>
                    <InputPayPWD
                        show={data.showPop}
                        onClose={closePop}
                        typeName={data.payTypeName}
                        amount={data.exInfo}
                        pwdError={data.pwdError}
                    >
                    </InputPayPWD>
                    <NumberKeyboard
                        show={data.show}
                        theme="custom"
                        extra-key="."
                        close-button-text="完成"
                        safe-area-inset-bottom
                        onBlur={complete}
                        onInput={onInput}
                        onDelete={onDelete}
                    />
                </div >
            )
        }
    }
})
