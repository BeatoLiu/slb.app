import { defineComponent } from "vue-demi";
import { useRouter } from "vue-router";
import useClipboard from "@/hooks/web/useClipboard";

export default defineComponent({
    name: 'ScanRes',
    setup() {
        const { currentRoute } = useRouter()
        const res = currentRoute.value.query.res
        const clipboard = useClipboard()
        return () => (
            <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                <p style={{ padding: '0 20px', wordWrap: 'break-word' }}>{res}</p>
                <p
                    class="btn"
                    style={{ marginTop: '20px', color: '#39b9b9', fontSize: '16px' }}
                    data-clipboard-text={res}
                    onClick={() => clipboard('.btn')}
                >复制内容</p>
            </div>
        )
    }
})