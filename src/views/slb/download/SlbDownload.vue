<template>
	<div class="download">
		<!-- <div v-if="isIOS">
            <nav class="navbar navbar-fixed-top navbar-light bg-white transparent">
                <div class="container">
                    <a class="ui-variable-logo navbar-brand" href="" title="secret" style="width: 157.25px;">
                        <img class="logo-default" src="assets/img/logo/applify-logo.png?v=20190912" alt="secret" data-uhd="">
                        <img class="logo-transparent" src="assets/img/logo/applify-logo-white.png?v=20190912" alt="secret" data-uhd="">
                    </a>
                    <a href="#" class="btn btn-sm ui-gradient-blue pull-right" data-scrollto="Download">Download</a>
                </div>
            </nav>
        </div>
        <div v-else>
            <a href="http://mg.2qzs.com/download/secret-im.1.2.29.1.apk">点击下载秘密App</a>
        </div> -->
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
								<!-- <a class="btn ui-gradient-green shadow-xl" data-scrollto="Download" style="color:red;letter-spacing:1px;" v-if="isIOS">请在App Store中搜索secret进行下载</a> -->
								<div>
									<img src="../../../assets/img/slb/slb-download.jpg" alt="" />
									<a
										class="btn ui-gradient-blue shadow-xl"
										data-scrollto="Download"
										id="walletAdd"
										:data-clipboard-text="downUrl"
										@click="clipboard('#walletAdd', { des: '下载地址' })"
										>复制下载地址</a
									>
								</div>
								<!-- <div>
									<img src="../../assets/img/taoke/7777.png" alt="" />
									<a
										class="btn ui-gradient-green shadow-xl"
										data-scrollto="Download"
										href="http://mg.2qzs.com/download/com.google.android.apps.authenticator2.apk"
										>验证器下载</a
									>
								</div> -->
							</div>
						</div>
						<p>注：该方式仅支持安卓手机。建议使用浏览器扫码</p>
						<p>或将下载地址复制到浏览器</p>
						<!-- <div class="col-sm-12">
							<img
								src="../../assets/img/taoke/secret-bg.png"
								alt="secret"
								data-uhd
								data-max_width="740"
								class="responsive-on-md"
							/>
						</div> -->
					</div>
					<!-- .row -->
				</div>
				<!-- .container -->
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref } from 'vue-demi'
import useClipboard from '../../../hooks/web/useClipboard'
export default defineComponent({
	name: 'SlbDownload-alive',
	setup() {
		const clipboard = useClipboard()
		const downUrl = ref('http://mg.2qzs.com/download/app-slb.1.1.0.apk')
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
	background: linear-gradient(180deg, #5cc8b8 0%, #5cc8b8 100%);
	font-size: 30 * @fontSize;
	text-align: center;
	// padding-top: 80*@fontSize;
	height: calc(100vh - 46px);
	nav {
		height: 60px;
		box-sizing: border-box;
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
			font-size: 30 * @fontSize;
			padding: 30 * @fontSize 0;
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
			color: #fff;
			font-family: 'Source Sans Pro', sans-serif;
			display: inline-block;
			letter-spacing: 5.03 * @fontSize;
			font-weight: 600;
			text-align: center;
			white-space: nowrap;
			vertical-align: middle;
			user-select: none;
			border: 0 solid transparent;
			padding: 13.75 * @fontSize 47.5 * @fontSize;
			font-size: 28 * @fontSize;
			line-height: 1.4;
			border-radius: 50 * @fontSize;
			transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
				box-shadow 0.15s ease-in-out;
			margin-bottom: 30 * @fontSize;
			margin-right: 15 * @fontSize;
			margin-left: 15 * @fontSize;
			background: -moz-linear-gradient(45deg, #8089ff 0%, #54ceff 100%);
			background: linear-gradient(45deg, #8089ff 0%, #54ceff 100%);
		}

		.col-sm-12 {
			text-align: center;
			padding: 0 10 * @fontSize 0 20 * @fontSize;
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
