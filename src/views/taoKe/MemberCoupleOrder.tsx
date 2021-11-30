import { computed, defineComponent, ref } from "vue";
import { Button, CellGroup, Field, Toast } from "vant";
import { useI18n } from '../../hooks/setting/useI18n'
import { memberCoupleOrder } from "@/apis/taoKe";
export default defineComponent({
    name: 'memberCoupleOrder',
    setup() {
        const { t } = useI18n()
        const orderId = ref('')
        const loading = ref(false)
        const submit = () => {
            const params = {
                orderId: orderId.value
            }
            loading.value = true
            memberCoupleOrder(params).then(res => {
                loading.value = false
                if (res.resultCode === 1) {
                    Toast('订单录入成功！')
                    orderId.value = ''
                }
            })
        }
        const dis = computed(() => orderId.value.length < 8)
        return () => {
            return (
                <div style={{ marginTop: '20px', padding: '0 20px' }}>
                    <CellGroup>
                        <Field v-model={orderId.value} placeholder="订单号" required clearable></Field>
                    </CellGroup>
                    <div style={{ marginTop: '40px' }}>

                        <Button type="primary" size="large" disabled={dis.value} loading={loading.value} onClick={() => submit()}>{t('common.submitText')}</Button>
                    </div>
                </div>
            )
        }
    }
})