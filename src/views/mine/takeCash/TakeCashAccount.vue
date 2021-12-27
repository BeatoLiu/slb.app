<template>
	<div class="take-cash-account">
		<div class="login-cont">
			<CellGroup>
				<Field readonly>
					<template #button>
						<div class="flex-center color-ee" @click="edit">
							<Icon name="edit" color="#ee0a24" size="20" />修改
						</div>
					</template>
				</Field>
				<Field v-model="name" :disabled="nameEdit" label="支付宝姓名" placeholder="提现支付宝姓名" clearable />
				<Field
					v-model="alipayAcct"
					clearable
					:disabled="alipayAcctEdit"
					label="支付宝账号"
					placeholder="提现支付宝账号"
				/>
				<Field
					v-model="certCode"
					center
					clearable
					label="验证码"
					placeholder="请输入短信验证码"
					v-if="!alipayAcctEdit"
				>
					<template #button>
						<Button size="small" type="primary" @click="getCode" :disabled="!counting">
							{{ counting ? t('common.vCodeText') : t('common.vCodeTimeText', [current.seconds]) }}
						</Button>
					</template>
				</Field>
			</CellGroup>
		</div>
		<div class="page-tips">
			<p class="title">温馨提示：</p>
			<div>
				<p>1、用于绑定提现的支付宝账号</p>
			</div>
		</div>
		<Button class="btn" @click="toSign" :disabled="!dis" v-if="!alipayAcctEdit">提交绑定</Button>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { Toast, Field, CellGroup, Button, Icon } from 'vant'
import { useCountDown } from '@vant/use'

import { useI18n } from '@/hooks/setting/useI18n'

import { bindMemberAliPayAcct, parseAliPayAcct, sendBindAliPayAcctSms } from '@/apis/mem'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'TakeCashAccount',
	components: {
		Field,
		CellGroup,
		Button,
		Icon
	},
	setup() {
		const { push } = useRouter()
		const { t } = useI18n()
		const countDown = useCountDown({
			// 倒计时 24 小时
			time: 60000,
			onFinish: () => {
				data.counting = true
			}
		})

		const data = reactive({
			name: '',
			nameEdit: false,
			password: '',
			alipayAcct: '',
			alipayAcctEdit: false,
			certCode: '',
			// 倒计时
			counting: true
		})
		const dis = computed(() => {
			return data.name && data.alipayAcct && data.certCode.length === 6
		})

		const edit = () => {
			data.alipayAcctEdit = false
			data.nameEdit = false
		}
		// 發送驗證碼
		const getCode = () => {
			// countDown.start()
			// data.counting = false
			sendBindAliPayAcctSms().then(res => {
				if (res.resultCode === 1) {
					Toast('发送成功！')
					// 倒计时开始
					countDown.start()
					data.counting = false
				}
			})
		}
		// 提交
		const toSign = () => {
			const params = {
				alipayAcct: data.alipayAcct,
				certCode: data.certCode,
				realName: data.name
			}
			bindMemberAliPayAcct(params).then(res => {
				if (res.resultCode === 1) {
					Toast('提现账号上传成功')
					push('/mine')
				}
			})
		}

		onMounted(() => {
			// 先查看會員是否已有提現賬號
			parseAliPayAcct().then(res => {
				if (res.resultCode === 1) {
					data.name = res.data.maRealName || ''
					data.alipayAcct = res.data.aliPayAcct || ''
					if (data.name) data.nameEdit = true
					if (data.alipayAcct) data.alipayAcctEdit = true
				}
			})
		})
		return {
			...toRefs(data),
			dis,
			current: countDown.current,
			edit,
			getCode,
			toSign,
			t
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.take-cash-account {
	box-sizing: border-box;
	padding: 20 * @fontSize;
	font-size: 28 * @fontSize;
	// height: calc(100vh - 90px);
	.login-cont {
		padding-bottom: 20 * @fontSize;
		// height: calc(100vh);
		text-align: center;
		background: #fff;
		.color-ee {
			color: #ee0a24;
		}
	}
	.btn {
		width: 100%;
		margin: 90 * @fontSize 0;
		color: #fff;
		font-size: 28 * @fontSize;
		line-height: 80 * @fontSize;
		text-align: center;
		background: #e7283b;
		border-radius: 10px;
	}
}
</style>
