import { Button } from "vant";
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
import './payResult.less'
import logoImg from '../../assets/img/pay-logo.png'

export default defineComponent({
    name: 'PayResult',
    setup() {
        const data = reactive({
            stateName: '支付确认中...'
        })

        const { replace } = useRouter()
        const goHome = (path: string) => {
            replace(path)
        }
        return () => {
            let el
            el = (
                <div class="pay-result" >
                    <div class="content">
                        <div>
                            <img src={logoImg} alt="" class="img" />
                        </div>
                        <p class="state-name">{data.stateName}</p>
                        <p class="state-name">可到<a onClick={() => goHome('/mine/property/transferRecord')}>转账记录</a>查看结果</p>
                    </div>
                    <Button class="btn" type="primary" size="large" round onClick={() => goHome('/')}>完成</Button>
                </div>
            )
            return (
                el
            )
        }
    }
})