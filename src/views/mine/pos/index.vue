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
import { showCreditPosList, deleteCreditPos } from '../../../apis/bankCard'
import { showCreditPosListItem } from '../../../apis/model/bankCardModel'

export default defineComponent({
	name: 'posList',
	components: {
		Icon,
		Button,
		SwipeCell,
		Cell
	},
	setup() {
		const dataList = ref<showCreditPosListItem[]>([])

		const beforeClose = ({ position, name, instance }: any = {}) => {
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
					break
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
		background: #fff;
		border-radius: 5px;
		margin-top: 20 * @fontSize;
		padding: 20 * @fontSize 0 20 * @fontSize 30 * @fontSize;
		.card-name {
			color: #505050;
			border-bottom: 1px solid #f7f7f7;
			padding-bottom: 10 * @fontSize;
			padding-right: 10 * @fontSize;
			font-size: 26 * @fontSize;
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
		background: #fff;
		border-radius: 5px;
		// text-align: center;
		line-height: 120 * @fontSize;
		margin-top: 20 * @fontSize;
		font-size: 32 * @fontSize;
	}
}
</style>
