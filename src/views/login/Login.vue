<template>
	<div class="login">
		<div class="login-top">
			<img :src="data.bgImg" alt="" />
		</div>
		<div class="login-container">
			<div>
				<img :src="data.logo" alt="" />
				<p class="title">通证应用，尽在数联宝</p>
			</div>
			<div class="login-content">
				<!-- <CellGroup> -->
				<Field
					v-model="params.memMobile"
					type="number"
					left-icon="contact"
					placeholder="请输入手机"
					clearable
				/>
				<Field
					v-model="params.memPassword"
					type="password"
					left-icon="shield-o"
					placeholder="请输入密码"
					clearable
				/>
				<!-- </CellGroup> -->
				<div class="save">
					<Button type="primary" size="large" :disabled="!dis" @click="login">{{ t('routes.login') }}</Button>
				</div>
				<p class="find-pwd" @click="$router.push('/findPWD')">{{ t('routes.findPWD') }}</p>
				<p class="register flex-center">
					您还未注册账号？前去&nbsp;
					<Button type="primary" size="small" @click="$router.push('/register')">{{
						t('routes.register')
					}}</Button>
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Field, Button } from 'vant'

import { useI18n } from '@/hooks/setting/useI18n'
import { assetsOrigin } from '@/utils/config'

import { IPwdLoginModel } from '@/apis/model/loginModel'
import { pwdLogin } from '@/apis/login'
import { useStore } from '@/store'
export default defineComponent({
	name: 'SlbLogin',
	components: {
		Field,
		Button
	},
	setup() {
		const { t } = useI18n()
		const { push } = useRouter()
		const store = useStore()
		const data = reactive({
			bgImg: assetsOrigin + '/img/slbApp/login/lg-bg.png',
			logo: assetsOrigin + '/img/slbApp/logo.png'
		})
		const params = reactive<IPwdLoginModel>({
			// memMobile: '15267087635',
			// memPassword: '123456'
			memMobile: process.env.VUE_APP_ENV !== 'production' ? '15267087635' : '',
			memPassword: process.env.VUE_APP_ENV !== 'production' ? '123456' : ''
		})
		const dis = computed(() => {
			return /^[a-zA-Z0-9_-]{6,20}$/.test(params.memPassword) && /^1[3-9][0-9]\d{8}$/.test(params.memMobile)
		})
		const login = () => {
			pwdLogin(params).then(async res => {
				// console.log(res)
				if (res.resultCode === 1) {
					localStorage.token = res.data.token
					// localStorage.memCode = res.data.memCode
					// document.cookie = `token=${res.data.token}`
					await store.dispatch('user/setUserInfo', res.data)
					await push('/')
				}
			})
		}
		return {
			data,
			params,
			dis,
			login,
			t
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';

.login {
	// min-height: calc(100vh - 46px);
	// position: relative;
	box-sizing: border-box;
	.login-top {
		height: 350 * @fontSize;
		// margin-top: -46px;

		img {
			width: 100%;
			height: 100%;
		}
	}
	.login-container {
		// position: absolute;
		// top: 150px;
		// left: 0;
		// right: 0;
		// bottom: 0;
		// padding: 0 20 * @fontSize;
		margin-top: 40 * @fontSize;
		text-align: center;
		.title {
			margin-top: 20 * @fontSize;
			font-weight: bold;
			font-size: 30 * @fontSize;
			font-family: PingFang SC, sans-serif;
		}
		.login-content {
			margin-top: 30 * @fontSize;
			padding: 0 60 * @fontSize;
			.van-cell {
				margin-top: 48 * @fontSize;
				background: #f4f4f4;
				&::after {
					border-bottom: #bbb6e1 2px solid;
				}
			}
			// margin-top: 100 * @fontSize;
			.save {
				margin-top: 60 * @fontSize;
				padding: 0 16px;
			}
			.find-pwd {
				margin-top: 20px;
				color: #b3b3b3;
			}
			.register {
				margin-top: 20px;
				color: #666;
				font-weight: bold;
				font-size: 28 * @fontSize;
			}
		}
		// margin: 0 auto;
	}
}
</style>
