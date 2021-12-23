<template>
	<div>
		<div :class="[type === 'tp' ? 'col-blue  ' : 'col-purple', 'footer']">
			<div id="tpWallet" :data-clipboard-text="wallet" @click="clipboard('#tpWallet', { des: '钱包地址' })">
				钱包地址：{{ wallet }}
				<p>(点击复制)</p>
			</div>

			<div id="proto" :data-clipboard-text="proto" @click="clipboard('#proto', { des: 'TAA代币合约' })">
				TAA代币合约：{{ proto }}
				<p>(点击复制)</p>
			</div>
			<div
				id="zsdtProto"
				:data-clipboard-text="zsdtProto"
				@click="clipboard('#zsdtProto', { des: 'ZSDT代币合约' })"
			>
				ZSDT代币合约：{{ zsdtProto }}
				<p>(点击复制)</p>
			</div>
		</div>
		<div>
			<img :src="img" alt="" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { picDisplayPath } from '@/utils/config'
import useClipboard from '../../hooks/web/useClipboard'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'DownloadHelp',
	setup() {
		const { currentRoute } = useRouter()
		const type = currentRoute.value.query.type as string
		const data = reactive({
			// tpWallet: 'https://dapp.mytokenpocket.vip/apk/TokenPocket-pro.apk?t=1632388655537',
			// naWallet: 'https://files.nabox.io/android/Nabox.apk',
			// type,
			proto: '0xe10EBE772A01D53745a5a6DAc9C67fFb39C0b40F',
			zsdtProto: '0x36C7FE89982167a501835c60cCBA9fE502a4250b',
			img: picDisplayPath + (type === 'tp' ? 'slbApp/taa_help.png' : 'slbApp/nabox.png'),
			wallet:
				type === 'tp'
					? 'https://dapp.mytokenpocket.vip/apk/TokenPocket-pro.apk?t=1632388655537'
					: 'https://files.nabox.io/android/Nabox.apk'
		})
		const clipboard = useClipboard()

		return {
			type,
			...toRefs(data),
			clipboard
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.footer {
	padding: 20 * @fontSize;
	padding-bottom: 40px;
	color: #fff;
	background: #78b6ff;
	& > div {
		margin-top: 20px;
		// p {
		// 	margin-left: 10px;
		// 	color: #1989fa;
		// }
		p {
			font-weight: bold;
			text-decoration: underline;
		}
	}
}
.col-blue {
	background: #78b6ff;
}
.col-purple {
	background: #9666fa;
}
</style>
