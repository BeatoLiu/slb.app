<template>
	<div class="bind-pos">
		<div class="login-cont">
			<CellGroup>
				<Field
					v-model="mcpUmsName"
					label="所属支付公司"
					placeholder="所属支付公司"
					@click="showPicker = true"
					readonly
				/>
				<Field v-model="orderId" center clearable label="编号(SN:)" placeholder="pos机编号"> </Field>
			</CellGroup>
		</div>
		<div class="page-tips">
			<p class="title">温馨提示：</p>
			<div>
				<p>1、pos机编号在pos机背面<Icon @click="bigImg" name="question" /></p>
				<p style="color: red">2、绑定时，请不要填写编号前的【SN:】</p>
				<p>3、绑定前，请先录入提现账号，以便返还押金</p>
			</div>
		</div>
		<Button class="btn" @click="toSign" :disabled="!dis">提交</Button>

		<Popup v-model:show="showPicker" round position="bottom">
			<Picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
		</Popup>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { Toast, CellGroup, Field, Button, Icon, ImagePreview, Picker, Popup } from 'vant'
import { addCreditPos } from '../../../apis/bankCard'
import { useRouter } from 'vue-router'

import { picDisplayPath } from '../../../utils/config'

export default defineComponent({
	name: 'bindPos',
	components: {
		CellGroup,
		Field: Field,
		Button,
		Icon,
		Picker,
		Popup
	},
	setup() {
		const { replace } = useRouter()
		const data = reactive({
			orderId: '',
			helpImg: picDisplayPath + 'slbApp/new-ui/pos.jpg',
			showPicker: false,
			columns: [
				{ mcpUmsId: 4, text: '拉卡拉' },
				{ mcpUmsId: 5, text: '杉德' },
				{ mcpUmsId: 8, text: '汇付' }
			],
			mcpUmsId: 0,
			mcpUmsName: ''
		})

		const dis = computed(() => {
			return data.orderId && data.mcpUmsName
		})
		const onConfirm = (value: any) => {
			data.mcpUmsId = value.mcpUmsId
			data.mcpUmsName = value.text
			data.showPicker = false
		}
		const bigImg = () => {
			ImagePreview([data.helpImg])
		}
		const toSign = () => {
			const params = {
				mcpPosCode: data.orderId, //.replace(/ /g, ''),
				memSecretOpenid: localStorage.getItem('openId'),
				mcpUmsId: data.mcpUmsId,
				mcpUmsName: data.mcpUmsName
			}
			addCreditPos(params).then(res => {
				if (res.resultCode === 1) {
					Toast('绑定成功')
					replace({ name: 'PosList' })
				}
			})
		}

		return {
			...toRefs(data),
			dis,
			onConfirm,
			bigImg,
			toSign
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.bind-pos {
	margin-top: 20px;
	font-size: 28 * @fontSize;
	.login-cont {
		// height: calc(100vh);
		text-align: center;
		.input {
			padding-top: 140 * @fontSize;
			position: relative;
			input {
				width: 100%;
				margin-top: 70 * @fontSize;
				padding: 12 * @fontSize;
				border-bottom: 1px solid #ccc;
				font-size: 32 * @fontSize;
			}
			span {
				position: absolute;
				right: 0;
				bottom: 155 * @fontSize;
				border: 1px solid #ccc;
				color: #ccc;
				width: 200 * @fontSize;
				line-height: 40 * @fontSize;
				border-radius: 20 * @fontSize;
			}
		}
	}
	.btn {
		font-size: 30 * @fontSize;
		margin-top: 200 * @fontSize;
		display: inline-block;
		width: 100%;
		line-height: 80 * @fontSize;
		border-radius: 12 * @fontSize;
		background: #ed0c17;
		color: #fff;
	}
	.tips {
		align-items: flex-start;
		text-align: left;
		padding-left: 12 * @fontSize;
		margin-top: 20 * @fontSize;
		i {
			color: green;
		}
	}
}
</style>
