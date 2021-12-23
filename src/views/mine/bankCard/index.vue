<template>
	<div class="credit-card">
		<div v-for="(item, idx) in dataList" :key="item.mccCode" class="card-item">
			<div class="card-name flex-space">
				<p>
					<!-- <span style="color:red"> (该银行暂停还款)</span> -->
					{{ item.mccBankName }}
				</p>
				<div>
					<Button
						plain
						hairline
						type="success"
						@click="$router.push({ name: 'AddBankCard', query: { id: item.mccCode } })"
					>
						修改
					</Button>
					&nbsp;
					<Button plain hairline type="danger" @click="removeCredit(item.mccCode, idx)">删除</Button>
				</div>
			</div>
			<!-- @click="$router.push({name: 'repayment', query:{id: item.id}})" -->
			<div class="card-content" :class="{ mccTipFlag: item.mccTipFlag === 1 }">
				<p>
					尾号{{ item.mccCard.substring(item.mccCard.length - 4) }}
					<span style="color: red" v-if="item.mccTipFlag === 1">(银行卡异常)</span>
				</p>
				<!-- <p>请自主查询账单</p> -->
			</div>
		</div>
		<div class="page-tips">
			<p class="title">温馨提示：</p>
			<div>
				<p>1、若银行卡异常，请尽快修改，否则将不能打款</p>
			</div>
		</div>
		<div class="add-card flex-center" @click="$router.push({ name: 'AddBankCard' })">
			<Icon name="plus" /><span>添加银行卡</span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { Button, Icon, Dialog, Toast } from 'vant'

import { IShowCreditCardListItem, IShowCreditCardListModel } from '@/apis/model/bankCardModel'
import { showCreditCardList, deleteCreditCard } from '@/apis/bankCard'
export default defineComponent({
	name: 'bankCardList',
	components: { Button, Icon },
	setup() {
		const dataList = ref<IShowCreditCardListItem[]>([])
		const params = reactive<IShowCreditCardListModel>({
			mccCardType: 1
		})
		onMounted(() => {
			showCreditCardList(params).then(res => {
				if (res.resultCode === 1) {
					dataList.value = res.data.dataIn
				}
			})
		})
		const removeCredit = (mccCode: number, index: number) => {
			Dialog.confirm({
				title: '警告',
				message: '确定要执行此操作吗?'
			}).then(() => {
				deleteCreditCard({ mccCode }).then(res => {
					if (res.resultCode === 1) {
						Toast('删除成功成功！')
						dataList.value.splice(index, 1)
					}
				})
			})
		}
		return {
			dataList,
			removeCredit
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.credit-card {
	padding: 0 20 * @fontSize 20 * @fontSize;
	.card-item {
		margin-top: 20 * @fontSize;
		background: #fff;
		border-radius: 5px;
		// padding: 20 * @fontSize 0 20 * @fontSize 30 * @fontSize;
		.card-name {
			padding: 0 10 * @fontSize 10 * @fontSize 0;
			color: #505050;
			font-size: 26 * @fontSize;
			border-bottom: 1px solid #f7f7f7;
			.van-button {
				height: inherit;
			}
		}
		.card-content {
			padding: 20 * @fontSize 0 20 * @fontSize 30 * @fontSize;
			// padding: 30 * @fontSize 0 0 20 * @fontSize;
			font-weight: 600;
			font-size: 30 * @fontSize;
			line-height: 80 * @fontSize;
		}
		.mccTipFlag {
			// background: rgba(120, 120, 120, 0.9);
			opacity: 0.5;
		}
	}
	.add-card {
		margin-top: 20 * @fontSize;
		font-size: 32 * @fontSize;
		line-height: 120 * @fontSize;
		background: #fff;
		border-radius: 5px;
		// text-align: center;
	}
}
</style>
