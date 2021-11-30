<template>
	<div class="edit">
		<AddressEdit
			:area-list="areaList"
			:address-info="addressInfo"
			show-set-default
			show-delete
			show-search-result
			save-button-text="保存"
			@save="onSave"
			@change-default="changeDefault"
			@delete="onDelete"
		/>
		<!-- <Area :area-list="areaList" :value="addressInfo.areaCode" />
		{{ addressInfo }} -->
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, toRefs } from 'vue'
import { Toast, AddressEdit, Area, Dialog } from 'vant'

import { useRouter } from 'vue-router'
import { areaModel } from './types'
import { showSubArea } from '../../../apis/common'
import { deletedDeliveryAddress, modifyAcquiesceDeliveryAddress, modifyDeliveryAddress } from '../../../apis/mem'
export default defineComponent({
	name: 'editAddress',
	components: { AddressEdit, Area },
	setup() {
		const { push, currentRoute, replace } = useRouter()
		const data = reactive<areaModel>({
			areaList: {
				province_list: {},
				city_list: {},
				county_list: {}
			}
		})
		let addressInfo = reactive({
			areaCode: '',
			aCode: '',
			addressDetail: '',
			daDetailAddress: '',
			isDefault: false,
			daAcquiesceType: 0,
			daCode: ''
		})
		const getArea = (val: number) => {
			return new Promise((resolve, reject) => {
				let params = {
					parentCode: '',
					type: val
				}
				// console.log(val)
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
						resolve(1)
					}
				})
			})
		}
		const onSave = (obj: any) => {
			let data = {
				daCode: obj.daCode,
				aCode: obj.areaCode,
				aName: obj.province + obj.city + obj.county,
				daMobile: obj.tel,
				daDetailAddress: obj.addressDetail,
				daName: obj.name,
				daOwnerType: 0
			}
			modifyDeliveryAddress(data).then(res => {
				if (res.resultCode === 1) {
					replace('/mine/address/list')
					// if (this.$route.query.type === 1) {
					// 	push('/mineToAddr')
					// } else {
					// 	push('/addressList')
					// }
				}
			})
		}
		// 設置為默認地址
		const changeDefault = (val: boolean) => {
			modifyAcquiesceDeliveryAddress({ daCode: +addressInfo.daCode }).then(res => {
				if (res.resultCode === 1) {
					Toast('设置成功')
					// addressInfo.isDefault = !val
				} else {
					Object.assign(addressInfo, { isDefault: !val })
				}
				// console.log(addressInfo.isDefault)
			})
		}
		// 刪除該地址
		const onDelete = () => {
			// Dialog.confirm({
			// 	title: '提醒',
			// 	message: '确定要删除吗？'
			// }).then(() => {
			deletedDeliveryAddress({ daCode: +addressInfo.daCode }).then(res => {
				if (res.resultCode === 1) {
					Toast('删除成功')
					replace('/mine/address/list')
					// addressInfo.isDefault = !val
				}
				// console.log(addressInfo.isDefault)
			})
			// })
		}
		onMounted(() => {
			Promise.all([getArea(2), getArea(3), getArea(4)]).then(res => {
				Object.assign(addressInfo, currentRoute.value.query)
				addressInfo.areaCode = addressInfo.aCode.toString()
				addressInfo.addressDetail = addressInfo.daDetailAddress
				addressInfo.isDefault = Boolean(+addressInfo.daAcquiesceType)
			})

			// console.log(data.areaList)
		})
		return {
			...toRefs(data),
			addressInfo, //: { ...toRefs(addressInfo) },
			onSave,
			changeDefault,
			onDelete
		}
	}
})
</script>

<style lang="less" scoped></style>
