<template>
	<div>
		<InputForm bizType="register" @submit="save" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'

import InputForm from './components/InputForm.vue'

import { IRegisterModel } from '@/apis/model/loginModel'
import { register } from '@/apis/login'

export default defineComponent({
	name: 'SlbRegister',
	components: {
		InputForm
	},
	setup() {
		const { replace } = useRouter()
		const save = (params: IRegisterModel) => {
			const data = {
				memMobile: params.memMobile,
				vCode: params.vCode,
				memPassword: params.memPassword,
				memChannel: 2
			}
			register(data).then(res => {
				if (res.resultCode === 1) {
					Dialog({
						message: '恭喜，注册成功！',
						confirmButtonText: '去登录'
					}).then(() => {
						replace('/login')
					})
				}
			})
		}

		return {
			save
		}
	}
})
</script>
