import { defineComponent, ref, watch } from "vue-demi";
import { Popup, PasswordInput, NumberKeyboard, Dialog } from 'vant'

import './InputPayPWD.less'
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useStore } from "@/store";
/**
 * @description 在涉及到转账支付的地方，需要输入平台的支付密码
 */
export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false
        },
        typeName: {
            type: String,
            required: true
        },
        amount: {
            type: [String, Number],
            required: true
        },
        pwdError: {
            type: String,
            default: ''
        }
    },
    setup(props, { emit }) {
        const pwd = ref('')
        const { push } = useRouter()
        const store = useStore()
        const hasAllianceWalletPwd = computed(() => store.state.user.userInfo.hasAllianceWalletPwd)

        const closePop = (password?: string) => {
            emit('close', password)
            pwd.value = ''
        }
        watch(pwd, (newValue) => {
            if (newValue.length === 6) {
                closePop(newValue)
            }
        })
        watch(() => props.show, (newValue) => {
            if (newValue) {
                if (hasAllianceWalletPwd.value === '无') {
                    return Dialog.confirm({
                        title: '提示',
                        message: '还未设置支付密码',
                        confirmButtonText: '去设置',
                        cancelButtonText: '取消',
                    }).then(() => {
                        push('/mine/setPayPWD')
                    }).catch(() => closePop())
                }
            }
        })
        return () => (
            <Popup v-model={[props.show, 'show']} class="pwd-pop" position="bottom" close-on-click-overlay={false} closeable onClick-close-icon={closePop}>
                <div class="pwd-top" >
                    <p class="title">请输入支付密码</p>
                    <p class="money"><span>{props.typeName}</span> {props.amount || 0}</p>
                </div>
                <PasswordInput value={pwd.value} error-info={props.pwdError} />
                <p class="forget-pwd" onClick={() => push('/mine/updatePayPWD')}>忘记密码</p>
                <NumberKeyboard v-model={pwd.value} show={props.show} />
            </Popup>
        )
    }
})