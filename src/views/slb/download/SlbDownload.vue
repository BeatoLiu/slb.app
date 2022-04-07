<template>
	<div class="download">
		<nav>
			<div class="container">
				<img class="logo-transparent" src="../../../assets/img/pay-logo.png" alt="secret" data-uhd="" />
			</div>
		</nav>
		<div class="main" role="main">
			<div class="ui-hero hero-lg hero-center ui-gradient-blue ui-waves hero-svg-layer-3">
				<div class="container">
					<div class="row">
						<div class="col-sm-12">
							<h1 class="heading">数联宝</h1>
							<!-- <p class="paragraph">让连接更有价值</p> -->
							<div class="actions">
								<div>
									<!--									<img src="../../../assets/img/slb/slb-download.jpg" alt="" />-->
									<VueQr :text="downUrl" :size="260" :margin="5" :dotScale="1" :logoScale="10" />
									<a
										class="btn ui-gradient-blue shadow-xl"
										data-scrollto="Download"
										id="walletAdd"
										:data-clipboard-text="downUrl"
										@click="clipboard('#walletAdd', { des: '下载地址' })"
									>
										复制下载地址
									</a>
								</div>
							</div>
						</div>
						<p>注：该方式仅支持安卓手机。建议使用浏览器扫码</p>
						<p>或将下载地址复制到浏览器</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { assetsOrigin } from '@/utils/config'
import { defineComponent, ref } from 'vue'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import useClipboard from '../../../hooks/web/useClipboard'

export default defineComponent({
	name: 'SlbDownload-alive',
	components: {
		VueQr
	},
	setup() {
		const clipboard = useClipboard()
		const downUrl = ref(assetsOrigin + '/download/app-slb.1.1.0.apk')
		return {
			downUrl,
			clipboard
		}
	}
})
</script>

<style scoped lang="less">
@import '../../../assets/css/local.less';
.download {
	// margin-top: 46px;
	height: calc(100vh - 46px);
	font-size: 30 * @fontSize;
	text-align: center;
	background: linear-gradient(180deg, #5cc8b8 0%, #5cc8b8 100%);
	// padding-top: 80*@fontSize;
	nav {
		box-sizing: border-box;
		height: 60px;
		padding: 5px;
		.container,
		img {
			height: 100%;
		}
	}
	.main {
		color: #fff;
		.heading {
			font-size: 50 * @fontSize;
		}
		.paragraph {
			padding: 30 * @fontSize 0;
			font-size: 30 * @fontSize;
		}
		.btn.shadow-xl {
			box-shadow: 0 7px 15px rgba(0, 9, 128, 0.05), 0 12px 28px rgba(0, 9, 128, 0.075),
				inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.075);
		}
		.ui-gradient-green {
			background: -moz-linear-gradient(45deg, #19d9b4 0%, #92d275 100%);
			background: linear-gradient(45deg, #19d9b4 0%, #92d275 100%);
		}
		.ui-gradient-blue {
			background: -moz-linear-gradient(180deg, #5cc8b8 0%, #5cc8b8 100%);
			background: linear-gradient(180deg, #5cc8b8 0%, #5cc8b8 100%);
		}
		.btn {
			display: inline-block;
			margin-right: 15 * @fontSize;
			margin-bottom: 30 * @fontSize;
			margin-left: 15 * @fontSize;
			padding: 13.75 * @fontSize 47.5 * @fontSize;
			color: #fff;
			font-weight: 600;
			font-size: 28 * @fontSize;
			font-family: 'Source Sans Pro', sans-serif;
			line-height: 1.4;
			letter-spacing: 5.03 * @fontSize;
			white-space: nowrap;
			text-align: center;
			vertical-align: middle;
			background: linear-gradient(45deg, #8089ff 0%, #54ceff 100%);
			border: 0 solid transparent;
			border-radius: 50 * @fontSize;
			transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
				box-shadow 0.15s ease-in-out;
			user-select: none;
			//background: -moz-linear-gradient(45deg, #8089ff 0%, #54ceff 100%);
		}

		.col-sm-12 {
			padding: 0 10 * @fontSize 0 20 * @fontSize;
			text-align: center;
			img {
				width: 100%;
			}
		}
	}
	.actions {
		display: flex;
		justify-content: space-around;
		div {
			width: 48%;
			// img:nth-child(1){
			//     border: 3px solid #54ceff;
			// }
			a {
				margin-top: 30 * @fontSize;
			}
		}
	}
}
</style>
