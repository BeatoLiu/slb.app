<template>
	<div class="edit">
		<AddressEdit :area-list="areaList" save-button-text="保存并使用" @save="onSave" />
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { Toast, AddressEdit } from 'vant'
import { showSubArea } from '../../../apis/common'
import { useRouter } from 'vue-router'
import { addDeliveryAddress } from '../../../apis/mem'
import { areaModel } from './types'

export default defineComponent({
	name: 'addAddress',
	components: {
		AddressEdit
	},
	setup() {
		const { push } = useRouter()
		const data = reactive<areaModel>({
			areaList: {
				province_list: {},
				city_list: {},
				county_list: {}
			}
		})

		const getArea = (val: number) => {
			let params = {
				parentCode: '',
				type: val
			}
			showSubArea(params).then(res => {
				if (res.resultCode === 1) {
					let arr = res.data
					if (val === 2) {
						arr.forEach((ele: any) => {
							data.areaList.province_list[ele.currentCode] = ele.currentName
						})
					} else if (val === 3) {
						arr.forEach((ele: any) => {
							data.areaList.city_list[ele.currentCode] = ele.currentName
						})
					} else if (val === 4) {
						arr.forEach((ele: any) => {
							data.areaList.county_list[ele.currentCode] = ele.currentName
						})
					}
				}
			})
		}
		const onSave = (obj: any) => {
			let data = {
				aCode: obj.areaCode,
				aName: obj.province + obj.city + obj.county,
				daMobile: obj.tel,
				daDetailAddress: obj.addressDetail,
				daName: obj.name,
				daOwnerType: 0
			}
			addDeliveryAddress(data).then(res => {
				if (res.resultCode === 1) {
					push('/mine/address/list')
					// if (this.$route.query.type === 1) {
					// 	push('/mineToAddr')
					// } else {
					// 	push('/addressList')
					// }
				}
			})
		}
		onMounted(() => {
			getArea(2)
			getArea(3)
			getArea(4)
			// console.log(data.areaList)
		})
		return {
			...toRefs(data),
			onSave
		}
	}
})
</script>

<style lang="less" scoped></style>
