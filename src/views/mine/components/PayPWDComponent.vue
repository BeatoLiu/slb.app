<template>
	<div class="setPayPWD">
		<div class="container">
			<Field v-model="params.vCode" type="number" label="验证码" placeholder="请输入验证码" clearable>
				<template #button>
					<Button size="small" type="primary" @click="sendSms" :disabled="!counting">
						{{ counting ? t('common.vCodeText') : t('common.vCodeTimeText', [current.seconds]) }}
					</Button>
				</template>
			</Field>
			<p class="p1">请输入{{ props.bizType === 'update' ? '新' : '' }}密码</p>
			<PasswordInput :value="params.allianceWalletPassword" :gutter="gutter" @focus="onFocus('p1')" />
			<p class="p2">请再次输入{{ props.bizType === 'update' ? '新' : '' }}密码</p>
			<PasswordInput
				:value="params.allianceWalletPasswordConfirm"
				:error-info="errText"
				:gutter="gutter"
				@focus="onFocus('p2')"
			/>
		</div>
		<Button type="primary" size="large" class="btn" :disabled="!dis" @click="submit">提交</Button>
		<NumberKeyboard v-model="params.allianceWalletPassword" :show="showP1" @blur="showP1 = false" />
		<NumberKeyboard v-model="params.allianceWalletPasswordConfirm" :show="showP2" @blur="showP2 = false" />
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { PasswordInput, NumberKeyboard, Button, Field, Toast } from 'vant'
import { ISetMemberAllianceWalletPwdModel } from '@/apis/model/memModel'
import { setAllianceWalletPwdSendSms, setMemberAllianceWalletPwd } from '@/apis/mem'
import { useRouter } from 'vue-router'
import { useCountDown } from '@vant/use'

import { useI18n } from '@/hooks/setting/useI18n'
import { useStore } from '@/store'

export default defineComponent({
	components: {
		PasswordInput,
		NumberKeyboard,
		Button,
		Field
	},
	props: {
		bizType: {
			type: String,
			default: 'set',
			validator: (val: string) => {
				return ['set', 'update'].includes(val)
			}
		}
	},
	setup(props) {
		const { replace } = useRouter()
		const { t } = useI18n()
		const store = useStore()
		const countDown = useCountDown({
			// 倒计时 24 小时
			time: 60000,
			onFinish: () => {
				counting.value = true
			}
		})
		const counting = ref(true)
		const params = reactive<ISetMemberAllianceWalletPwdModel>({
			allianceWalletPassword: '',
			allianceWalletPasswordConfirm: '',
			vCode: ''
		})
		const gutter = ref('10')
		const showP1 = ref(false)
		const showP2 = ref(false)

		const dis = computed(() => {
			return (
				params.vCode.length === 6 &&
				params.allianceWalletPassword.length === 6 &&
				params.allianceWalletPasswordConfirm.length === 6 &&
				params.allianceWalletPassword === params.allianceWalletPasswordConfirm
			)
		})

		const errText = computed(() => {
			if (params.allianceWalletPassword.length === 6 && params.allianceWalletPasswordConfirm.length === 6) {
				if (params.allianceWalletPassword !== params.allianceWalletPasswordConfirm) {
					return '两次密码输入不一致'
				}
			}
			return ''
		})

		const onFocus = (biz: string) => {
			if (biz === 'p1') {
				showP1.value = true
				showP2.value = false
			} else {
				showP2.value = true
				showP1.value = false
			}
		}
		// 发送短信
		const sendSms = () => {
			setAllianceWalletPwdSendSms().then(() => {
				countDown.start()
				counting.value = false
			})
		}
		// 提交
		const submit = () => {
			setMemberAllianceWalletPwd(params).then(async res => {
				if (res.resultCode === 1) {
					Toast('支付密码设置成功，莫失莫忘')
					const userInfo = { ...JSON.parse(localStorage.userInfo), hasAllianceWalletPwd: '有' }
					await store.dispatch('user/setUserInfo', userInfo)
					replace('/settings')
				}
			})
		}
		return {
			props,
			params,
			gutter,
			showP1,
			showP2,
			dis,
			errText,
			onFocus,
			submit,
			current: countDown.current,
			counting,
			sendSms,
			t
		}
	}
})
</script>

<style lang="less">
@import '../../../assets/css/local.less';
.setPayPWD {
	box-sizing: border-box;
	padding-top: 20 * @fontSize;

	.container {
		box-sizing: border-box;
		padding-bottom: 60 * @fontSize;
		background: #fff;
		// padding: 40 * @fontSize 0;
		p {
			padding: 10px 16px;
		}

		.p1 {
			padding-top: 50 * @fontSize;
		}

		.p2 {
			margin-top: 40 * @fontSize;
		}
	}
	.btn {
		width: calc(100vw - 32px);
		margin-top: 100 * @fontSize;
		margin-left: 16px;
	}
	.van-password-input {
		li {
			background-color: #eee;
		}
	}
}
</style>
