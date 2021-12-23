import { computed, defineComponent } from "vue";
import { Button } from 'vant'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'

import logoImg from '@/assets/img/pay-logo.png'

import './CollectionsQR.less'
import { useStore } from "@/store";
import useClipboard from "@/hooks/web/useClipboard";

export default defineComponent({
    name: 'CollectionsQR-alive',
    setup() {
        const store = useStore()
        const clipboard = useClipboard()
        const walletUrl = computed(() => store.state.user.userInfo.allianceWallet)

        return () => (
            <div class="collections">
                <div class="container">
                    <div class="top">
                        <p class="title">收款地址</p>
                        <p class="address">{walletUrl.value && walletUrl.value.substring(0, 8) + '*****' + walletUrl.value.substring(30)}</p>
                    </div>
                    <div id="qr" class="qr-img" >
                        <VueQr logoSrc={ logoImg } text={ walletUrl.value } size={ 260 } margin={ 5 } dotScale={ 1 } logoScale={ 10 }/>
                    </div>
                </div>
                <Button size="large" class="btn" data-clipboard-text={walletUrl.value} onClick={() => clipboard('.btn')}>复制收款地址</Button>
            </div>
        )
    }
})
