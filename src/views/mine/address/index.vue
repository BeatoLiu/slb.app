<template>
	<div class="address">
		<AddressList v-model="chosenAddressId" :list="list" @add="onAdd" @edit="onEdit" @click-item="clickItem" />
		<div class="tip" v-if="list.length === 0">暂无收获地址</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue'
import { AddressList } from 'vant'
import { showSelfDeliveryAddress } from '@/apis/mem'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'

export default defineComponent({
	name: 'AddressList',
	components: { AddressList },
	setup() {
		const { push, replace, options } = useRouter()
		const store = useStore()

		const data = reactive({
			// list: [],
			chosenAddressId: '2',
			isEdit: false,
			fromPath: ''
		})
		const list = ref<any[]>([])
		data.fromPath = options.history.state.back as string
		// console.log(options.history)
		const onAdd = () => {
			push('/mine/address/add')
		}
		const onEdit = (item: any) => {
			data.isEdit = true
			push({ path: '/mine/address/edit', query: { ...item } })
		}
		const clickItem = (item: any) => {
			// console.log(!data.isEdit, data.fromPath, data.fromPath === '/mxMall/goodsSubmit')
			if (!data.isEdit && data.fromPath === '/mxMall/goodsSubmit') {
				store.dispatch('user/deliveryAddress', item)
				replace({ name: 'GoodsSubmit' })
			}
			if (!data.isEdit && data.fromPath === 'rewardGoodsOrder')
				push({ name: 'rewardGoodsOrder', query: { addrInfo: item } })
		}
		const getAddrList = () => {
			showSelfDeliveryAddress().then(res => {
				if (res.resultCode === 1) {
					list.value = res.data
					list.value.forEach((ele: any) => {
						ele.id = ele.daCode
						ele.name = ele.daName
						ele.tel = ele.daMobile
						ele.address = ele.aName + ele.daDetailAddress
						if (ele.daAcquiesceType === 1) {
							data.chosenAddressId = ele.daCode
						}
					})
				}
			})
		}
		onMounted(() => {
			getAddrList()
		})
		return {
			...toRefs(data),
			list,
			onAdd,
			onEdit,
			clickItem
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.address {
	.tip {
		color: #999;
		line-height: 88 * @fontSize;
		text-align: center;
	}
}
</style>
