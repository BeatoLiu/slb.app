<template>
	<div class="test">
		<div class="coin-list">
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
			<div class="time-count">修改为TAA剩余次数：{{ 2 - updateCount }}</div>
		</div>
		<div class="page-tips">
			<p class="title">温馨提示：</p>
			<div>
				<p>1、用于设置所得红包的类型</p>
				<p class="color-red">2、红包类型修改为TAA时，只能修改两次</p>
			</div>
		</div>
		<Button class="btn" size="large" @click="createOrder">提交设置</Button>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue'
import { Toast, RadioGroup, Radio, Dialog, Button } from 'vant'
import { getMemberByCode, changeIncomeType } from '@/apis/mem'
import { showDictionary } from '@/apis/common'
import { IShowDictionaryItem } from '@/apis/model/commonModel'
export default defineComponent({
	name: 'IncomeType',
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
		const coinList = ref<IShowDictionaryItem[]>([])
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
					coinList.value = res.data.filter(
						item => item.dSubCode === 1 || item.dSubCode === 11 || item.dSubCode === 15
					)
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
	box-sizing: border-box;
	padding: 20 * @fontSize;
	.coin-list {
		padding: 16px;
		background: #fff;
		border-radius: 10 * @fontSize;
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
		.time-count {
			margin-top: 20px;
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
		color: #fff;
		font-size: 28 * @fontSize;
		line-height: 80 * @fontSize;
		text-align: center;
		background: #e7283b;
		border-radius: 10px;
	}
}
</style>
