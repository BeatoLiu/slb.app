<template>
	<div>
		<InputForm bizType="findPWD" @submit="save" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'vant'

import InputForm from './components/InputForm.vue'

import { registerModel } from '../../apis/model/loginModel'
import { modifyPassword } from '../../apis/login'

export default defineComponent({
	name: 'register',
	components: {
		InputForm
	},
	setup() {
		const { replace } = useRouter()
		const save = (params: registerModel) => {
			let data = {
				memMobile: params.memMobile,
				vCode: params.vCode,
				memPassword: params.memPassword,
				memChannel: 2
			}
			modifyPassword(data).then(res => {
				if (res.resultCode === 1) {
					Dialog({
						message: '修改成功！'
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

<style lang="less" scoped></style>
