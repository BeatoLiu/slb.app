<template>
	<div class="input-content">
		<CellGroup>
			<Field v-model="params.memMobile" type="number" left-icon="contact" placeholder="请输入手机" clearable />
			<Field v-model="params.vCode" type="number" left-icon="font-o" placeholder="请输入验证码" clearable>
				<template #button>
					<!-- <Button size="small" type="primary" @click="sendSms">{{ t('common.vCodeText') }}</Button> -->
					<Button size="small" type="primary" @click="sendSms" :disabled="!counting">
						{{ counting ? t('common.vCodeText') : t('common.vCodeTimeText', [current.seconds]) }}
					</Button>
				</template>
			</Field>
			<Field v-model="params.memPassword" type="password" left-icon="shield-o" placeholder="请输入密码" clearable />
			<Field v-model="newPWD" type="password" left-icon="shield-o" placeholder="重复密码" clearable />
		</CellGroup>
		<div class="save">
			<Button round type="primary" size="large" @click="submit">{{ t(subText) }}</Button>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CellGroup, Field, Button, Toast } from 'vant'
import { useCountDown } from '@vant/use'

import { useI18n } from '../../../hooks/setting/useI18n'
import { useSendSms } from '../../../hooks/web/useSendSms'
// import { sendSmsCode } from '../../../apis/common'
import { registerModel } from '../../../apis/model/loginModel'
import { checkPhone, checkPassWord, checkCode6 } from '../../../utils'
// import { pwdLogin } from '../../../apis/login'

export type bizTypeProps = 'register' | 'findPWD'
export default defineComponent({
	name: 'inputForm',
	components: {
		CellGroup,
		Field,
		Button
	},
	props: {
		bizType: {
			type: String as PropType<bizTypeProps>,
			validator: (val: string) => {
				return ['register', 'findPWD'].includes(val)
			},
			required: true
		}
	},
	setup(props, { emit }) {
		// console.log(props.bizType)
		const { t } = useI18n()
		const countDown = useCountDown({
			// 倒计时 24 小时
			time: 60000,
			onFinish: () => {
				counting.value = true
			}
		})
		const counting = ref(true)
		const newPWD = ref('')
		const params = reactive<registerModel>({
			memMobile: '',
			memPassword: '',
			vCode: '',
			memChannel: 2
		})
		const sendSms = async () => {
			const smsParams = {
				phoneNum: params.memMobile,
				type: props.bizType === 'register' ? 6 : 12
			}
			const { status } = await useSendSms(smsParams)
			if (status === 1) {
				countDown.start()
				counting.value = false
			}
		}
		const submit = () => {
			if (checkPhone(params.memMobile) && checkPassWord(params.memPassword) && checkCode6(params.vCode)) {
				console.log(newPWD.value, params.memPassword)
				if (newPWD.value !== params.memPassword) {
					return Toast('两次输入密码不一致！')
				}
				emit('submit', params)
			}
		}
		const subText = props.bizType === 'register' ? 'routes.register' : 'common.submitText'
		return {
			params,
			newPWD,
			subText,
			current: countDown.current,
			counting,
			sendSms,
			submit,
			t
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.input-content {
	padding: 20 * @fontSize;
	text-align: center;
	.save {
		margin-top: 100px;
	}
}
</style>
