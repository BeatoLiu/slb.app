<template>
	<div class="pos-card">
		<div v-for="(item, idx) in dataList" :key="item.mcpCode" class="card-item">
			<SwipeCell right-width="80" :name="idx" :before-close="beforeClose">
				<Cell :border="false" :title="item.mcpUmsName" :value="item.mcpPosCode" />
				<template #right>
					<Button type="danger" text="删除" />
				</template>
			</SwipeCell>
		</div>
		<div class="add-card flex-center" @click="$router.push({ name: 'AddPos' })">
			<Icon name="plus" /><span>添加Pos机</span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Icon, Button, Toast, Dialog, SwipeCell, Cell } from 'vant'
import { showCreditPosList, deleteCreditPos } from '@/apis/bankCard'
import { IShowCreditPosListItem } from "@/apis/model/bankCardModel"

export default defineComponent({
	name: 'PosList',
	components: {
		Icon,
		Button,
		SwipeCell,
		Cell
	},
	setup() {
		const dataList = ref<IShowCreditPosListItem[]>([])

		const beforeClose = ({ position, name }: any = {}) => {
			switch (position) {
				// case 'left':
				// case 'cell':
				// case 'outside':
				// instance.close();
				// break;
				case 'right':
					return new Promise(resolve => {
						Dialog.confirm({
							title: '确定删除吗？'
						}).then(() => {
							const { mcpCode } = dataList.value[name]
							deleteCreditPos({ mcpCode }).then(res => {
								if (res.resultCode === 1) {
									Toast('删除成功！')
									dataList.value.splice(name, 1)
									resolve
								}
							})
						})
					})
			}
		}
		onMounted(() => {
			showCreditPosList({ pageNum: 1, pageSize: 20 }).then(res => {
				if (res.resultCode === 1) {
					dataList.value = res.data.dataIn
				}
			})
		})
		return {
			dataList,
			beforeClose
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.pos-card {
	padding: 0 20 * @fontSize 20 * @fontSize;
	.card-item {
		margin-top: 20 * @fontSize;
		padding: 20 * @fontSize 0 20 * @fontSize 30 * @fontSize;
		background: #fff;
		border-radius: 5px;
		.card-name {
			padding-right: 10 * @fontSize;
			padding-bottom: 10 * @fontSize;
			color: #505050;
			font-size: 26 * @fontSize;
			border-bottom: 1px solid #f7f7f7;
			.van-button {
				height: inherit;
			}
		}
		.card-content {
			padding: 30 * @fontSize 0 0 20 * @fontSize;
			font-weight: 600;
			font-size: 30 * @fontSize;
			line-height: 80 * @fontSize;
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
