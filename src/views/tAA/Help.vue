<template>
	<div v-if="$route.query.type === 'tp'">
		<div class="footer col-blue">
			<div id="tpWallet" :data-clipboard-text="tpWallet" @click="clipboard('#tpWallet', { des: '钱包地址' })">
				TokenPocket钱包地址：{{ tpWallet }}
				<p>(点击复制)</p>
			</div>

			<div id="proto" :data-clipboard-text="proto" @click="clipboard('#proto', { des: '代币合约' })">
				代币合约：{{ proto }}
				<p>(点击复制)</p>
			</div>
		</div>
		<div>
			<img :src="picDisplayPath + 'slbApp/taa_help.png'" alt="" />
		</div>
	</div>
	<div v-else-if="$route.query.type === 'nb'">
		<div class="footer col-purple">
			<div id="naWallet" :data-clipboard-text="naWallet" @click="clipboard('#naWallet', { des: '钱包地址' })">
				Nabox钱包地址：{{ naWallet }}
				<p>(点击复制)</p>
			</div>

			<div id="proto" :data-clipboard-text="proto" @click="clipboard('#proto', { des: '代币合约' })">
				代币合约：{{ proto }}
				<p>(点击复制)</p>
			</div>
		</div>
		<div>
			<img :src="picDisplayPath + 'slbApp/nabox.png'" alt="" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { picDisplayPath } from './../../utils/config'
import useClipboard from '../../hooks/web/useClipboard'
export default defineComponent({
	setup() {
		const data = reactive({
			picDisplayPath,
			tpWallet: 'https://dapp.mytokenpocket.vip/apk/TokenPocket-pro.apk?t=1632388655537',
			naWallet: 'https://files.nabox.io/android/Nabox.apk',
			proto: '0xe10EBE772A01D53745a5a6DAc9C67fFb39C0b40F'
		})
		const clipboard = useClipboard()
		return {
			...toRefs(data),
			clipboard
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.footer {
	background: #78b6ff;
	color: #fff;
	padding: 20 * @fontSize;
	padding-bottom: 40px;
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
