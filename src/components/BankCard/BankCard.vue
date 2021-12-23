<template>
	<!-- 银行卡转账时，银行卡信息 -->
	<van-dialog
		v-model:show="show"
		title="人民币支付，请转账至如下银行账户"
		:before-close="beforeclose"
		:show-confirm-button="false"
	>
		<CellGroup>
			<Field
				label="摘要(必填)"
				label-width="70"
				required
				error
				readonly
				clickable
				error-message="不填，或影响到账时间"
			>
				<template #input>
					<div
						id="valueCode"
						:data-clipboard-text="valueCode + biz"
						@click="clipboard('#valueCode', { des: '摘要' })"
					>
						{{ valueCode }}{{ biz }}
					</div>
				</template>
			</Field>
			<Field label="公司名称" label-width="60" readonly clickable>
				<template #input>
					<div
						id="companyName"
						:data-clipboard-text="companyName"
						@click="clipboard('#companyName', { des: '公司名称' })"
					>
						{{ companyName }}
					</div>
				</template>
			</Field>
			<Field label="开户机构" label-width="60" readonly clickable>
				<template #input>
					<div
						id="bankName"
						:data-clipboard-text="bankName"
						@click="clipboard('#bankName', { des: '开户机构' })"
					>
						{{ bankName }}
					</div>
				</template>
			</Field>
			<Field label="银行账号" label-width="60" readonly clickable>
				<template #input>
					<div
						id="bankAccount"
						:data-clipboard-text="bankCard"
						@click="clipboard('#bankAccount', { des: '银行账号' })"
					>
						{{ bankCard }}
					</div>
				</template>
			</Field>

			<Cell clickable>
				<template #default>
					<p style="color: green">点击以上相应选项，可复制内容</p>
					<div style="color: red">注：转账时必须备注【摘要】！！！</div>
					<div style="color: red">因未上传打款凭证导致的损失，需自行承担</div>
				</template>
			</Cell>
			<Cell center clickable>
				<template #default>
					<div class="van-button__content" @click="closeDialog">
						<span class="van-button__text">确认</span>
					</div>
				</template>
			</Cell>
		</CellGroup>
	</van-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import { CellGroup, Cell, Field, Dialog } from 'vant'
// import Clipboard from 'clipboard'
import useClipboard from '../../hooks/web/useClipboard'
export default defineComponent({
	name: 'bankCard',
	components: {
		[Dialog.Component.name]: Dialog.Component,
		CellGroup,
		Cell,
		Field
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		// 備註信息
		tips: String,
		// 业务相关的一个编号
		valueCode: [String, Number],
		// 业务
		biz: {
			type: String,
			default: ''
		},
		// 所属公司
		companyType: {
			type: String,
			default: 'qs' // qs奇书，yq银企数权
		}
	},
	setup(props, { emit }) {
		const { show } = toRefs(props)
		const clipboard = useClipboard()
		const bankName = computed(() => {
			const companyType = props.companyType
			if (companyType === 'yq') {
				return '中国工商银行杭州解放路支行营业室'
			}
			return '中国工商银行杭州钱江支行营业室'
		})
		const companyName = computed(() => {
			const companyType = props.companyType
			if (companyType === 'yq') {
				return '杭州银企数权科技有限公司'
			}
			return '杭州奇书文化科技有限公司'
		})
		const bankCard = computed(() => {
			const companyType = props.companyType
			if (companyType === 'yq') {
				return '1202020709800329945'
			}
			return '1202021419800144141'
		})

		// const copyWaybillN = (id: string, title: string) => {
		// 	const clipboard = new Clipboard(id)
		// 	// console.log(clipboard)
		// 	// this.$nextTick(() => {
		// 	clipboard.on('success', function (e) {
		// 		Toast(title + '复制成功')
		// 		clipboard.destroy()
		// 	})
		// 	clipboard.on('error', function (e) {
		// 		Toast('您的浏览器不支持点击复制')
		// 		clipboard.destroy()
		// 		// })
		// 	})
		// }
		const closeDialog = () => {
			updateShow(false)
		}
		const updateShow = (show: boolean) => emit('update:show', show)
		// !不能直接修改showQr的值，只能绕个弯，即使如此，控制台还是会报错，但暂别无它法
		// Todo
		const beforeclose = () => {
			updateShow(false)
			return true
		}
		return {
			bankName,
			companyName,
			bankCard,
			show,
			clipboard,
			beforeclose,
			closeDialog
		}
	}
})
</script>

<style lang="less" scoped>
.van-button__text {
	color: red;
}
</style>
