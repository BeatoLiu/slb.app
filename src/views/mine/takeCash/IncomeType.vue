<template>
	<div class="test">
		<div class="coin-lsit">
			<p class="title">红包类型</p>
			<RadioGroup v-model="orderParams.incomeType" direction="horizontal">
				<Radio
					v-for="item in coinList"
					:name="item.dSubCode"
					:key="item.dSubCode"
					:disabled="updateCount === 2 && item.dSubCode === 11 && currentType !== 11"
				>
					{{ item.dSubName.toUpperCase() }}
				</Radio>
			</RadioGroup>
			<div style="margin-top: 20px">修改为TAA剩余次数：{{ 2 - updateCount }}</div>
		</div>
		<div class="page-tips">
			<p class="title">温馨提示：</p>
			<div>
				<p>1、用于设置所得红包的类型</p>
				<p style="color: red">2、红包类型修改为TAA时，只能修改两次</p>
			</div>
		</div>
		<Button class="btn" size="large" @click="createOrder">提交设置</Button>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue'
import { Toast, RadioGroup, Radio, Dialog, Button } from 'vant'
import { getMemberByCode, changeIncomeType } from '../../../apis/mem'
import { showDictionary } from '../../../apis/common'
import { showDictionaryItem } from '../../../apis/model/commonModel'
export default defineComponent({
	name: 'incomeType',
	components: {
		RadioGroup,
		Radio,
		Button
	},
	setup() {
		const data = reactive({
			updateCount: 0, // taa已经修改次数
			orderParams: {
				incomeType: 0
			},
			currentType: 0 // 现
		})
		const coinList = ref<showDictionaryItem[]>([])
		const updateIncomeType = () => {
			changeIncomeType(data.orderParams).then(res => {
				if (res.resultCode === 1) {
					Toast.success('提交成功')
					data.currentType = data.orderParams.incomeType
					// TAA修改成功后，修改次数加1
					if (data.orderParams.incomeType === 11) {
						data.updateCount += 1
					}
				}
			})
		}
		const createOrder = () => {
			if (data.orderParams.incomeType !== 11 && data.updateCount === 2) {
				Dialog.confirm({
					title: '提示',
					message: '确定要修改为其它类型吗？成功后，将不能再修改为TAA'
				})
					.then(() => {
						updateIncomeType()
					})
					.catch(() => {
						data.orderParams.incomeType = data.currentType
					})
			} else {
				updateIncomeType()
			}
		}
		onMounted(() => {
			// 獲取會員當前紅包類型
			getMemberByCode().then(res => {
				if (res.resultCode === 1) {
					data.orderParams.incomeType = res.data.incomeType === 0 ? 1 : res.data.incomeType
					data.updateCount = res.data.incomeCount
					data.currentType = res.data.incomeType === 0 ? 1 : res.data.incomeType
				}
			})
			// 查看共有多少紅包類型
			showDictionary({ dType: 24 }).then(res => {
				if (res.resultCode === 1) {
					coinList.value = res.data.filter(item => item.dSubCode === 1 || item.dSubCode === 11 || item.dSubCode === 15)
				}
			})
		})
		return {
			...toRefs(data),
			coinList,
			createOrder
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.test {
	// min-height: calc(100vh - 90px);
	padding: 20 * @fontSize;
	box-sizing: border-box;
	.coin-lsit {
		border-radius: 10 * @fontSize;
		background: #fff;
		padding: 16px;
		.title {
			line-height: 4;
		}
		.van-radio-group {
			.van-radio {
				padding: 20 * @fontSize 0;
			}
		}
		.van-dropdown-menu__bar {
			box-shadow: none;
		}
	}
	button {
		color: #2d8cff;
		background: transparent;
		border: none;
	}
	.btn {
		width: 100%;
		margin: 90 * @fontSize 0;
		line-height: 80 * @fontSize;
		border-radius: 10px;
		background: #e7283b;
		text-align: center;
		font-size: 28 * @fontSize;
		color: #fff;
	}
}
</style>
