<template>
	<div class="order-list">
		<PullRefresh v-model="refreshing" @refresh="onRefresh">
			<List v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
				<div class="item" v-for="item in dataList" :key="item.madCode">
					<div class="order-content-left">
						<p class="order-id">{{ item.createTime }}</p>
						<p
							class="order-remark"
							@click="showRemark(item.madCode, item.maRemark)"
							v-if="item.maSetStatus === 3"
						>
							{{ item.maRemark }}
						</p>
						<p :class="{ success: item.maSetStatus === 2 || item.maSetStatus === 5 }" v-else>
							{{ item.maRemark }}
						</p>
						<p>订单:{{ item.madCode }}</p>
						<p>{{ item.maBizRemark }}</p>
					</div>

					<div class="order-name">
						<!-- 应收 -->
						<p v-if="!(item.maSetStatus === 2 || item.maSetStatus === 5)">
							收益：
							{{
								item.maBizType !== 6
									? '' + item.maSum + (item.maSumCurrencyTypeName || '')
									: '' + item.tokenSUm + item.tokenName
							}}
						</p>
						<!-- 实收 -->
						<p class="isPlus" v-if="item.maSetStatus === 2 || item.maSetStatus === 5">
							收益： {{ item.tokenSUm }}({{ item.tokenName }})
						</p>
						<p :class="{ success: item.maSetStatus === 2 || item.maSetStatus === 5 }">
							{{ item.maSetStatusName }}
						</p>
						<p>来源：{{ item.maBizTypeName }}</p>
						<!-- <p class="order-id">结算时间：{{item.oSettleTime}}</p> -->
					</div>
				</div>
			</List>
		</PullRefresh>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { PullRefresh, List, Dialog } from 'vant'
import { IBasePageParams } from '@/apis/model/base'
import { ISelectMemberBenefitListItem } from '@/apis/model/memModel'
import { usePullRefreshPageList } from '@/hooks/web/usePullRefreshPageList'

export default defineComponent({
	name: 'SelectMemberBenefitList-alive',
	components: { PullRefresh, List },
	setup() {
		const params = reactive<IBasePageParams>({
			pageSize: 10,
			pageNum: 0
		})
		const { refreshing, loading, finished, dataList, onRefresh, onLoad } = usePullRefreshPageList<
			ISelectMemberBenefitListItem,
			IBasePageParams
		>('mem/memberAcct/selectMemberBenefitList', params, { method: 'POST' })

		const showRemark = (madCode: number, maRemark: string) => {
			// const { madCode, maRemark } = item
			Dialog({
				title: madCode + '',
				message: maRemark
			})
		}

		return {
			refreshing,
			loading,
			finished,
			dataList,
			onRefresh,
			onLoad,
			showRemark
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.order-list {
	// margin-top: 46px;
	.search {
		line-height: 3;
		text-align: center;
		background: #fff;
		border: 5px solid #f2f2f2;
	}

	.title {
		margin: 30 * @fontSize 0 26 * @fontSize 20 * @fontSize;
		font-weight: bold;
		font-size: 34 * @fontSize;
		// line-height: 1;
	}
	.item {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		width: 100%;
		margin-top: 20 * @fontSize;
		padding: 20 * @fontSize 20 * @fontSize;
		background-color: #fff;
		//}
		.order-content-left {
			width: 50%;
		}
		// align-items: flex-;
		img {
			// height: 340*@fontSize;
			width: 340 * @fontSize;
			border-radius: 5px;
		}
		.order-name {
			flex: 1;
			width: 50%;
			padding: 0 20 * @fontSize;
			font-size: 28 * @fontSize;
			text-align: left;

			.order-id {
				// text-align: center;
				padding-top: 5px;
				color: #909090;
				font-size: 26 * @fontSize;
			}

			.isPlus {
				color: red;
			}
		}
		.order-remark {
			width: 50%;
			overflow: hidden;
			color: blue;
			white-space: nowrap;
			text-decoration: underline;
			text-overflow: ellipsis;
		}

		.order-pay {
			padding: 10px 0;
			color: #505050;
			letter-spacing: 1px;
			text-align: right;
		}
		.order-pre {
			height: 100 * @fontSize;
		}
	}

	.success {
		color: #19be6b;
	}
}
</style>
