<template>
	<div class="refund">
		<!--  v-for="(item, index) in dataInfo.podList" :key="index" -->
		<div class="cont">
			<img :src="dataInfo.prdCsPicName" alt />
			<div class="info">
				<div class="title">{{ dataInfo.prdCName }}</div>
				<p>规格：{{ dataInfo.className }}</p>
				<div class="price">
					<span>￥{{ dataInfo.prdSum }}</span>
					x{{ dataInfo.prdCount }}
				</div>
			</div>
		</div>
		<div class="reason">
			<div class="name"><span>*</span>退款原因:</div>
			<div class="val" @click="getReasonList">{{ reasonText }}</div>
			<Icon name="arrow" />
		</div>
		<div class="reason">
			<!-- <span><span>*</span>退款说明：</span> -->
			<div class="name">退款说明：</div>
			<input type="textarea" v-model="refundParams.remark" placeholder="选填" />
		</div>
		<!-- <div class="reason">
        <div class="name"><span>*</span>退款数量：</div>
        <img src="../../assets/img/mixuan/jian.png" alt="" class="add-red" @click="reduct">
        <span class="num">{{num}}</span>
        <img src="../../assets/img/mixuan/add.png" alt="" class="add-red" @click="add">
    </div> -->
		<div class="reason">
			<div class="name"><span>*</span>退单类型:</div>
			<div class="val" @click="roTypePicker = true">{{ roTypeText }}</div>
			<Icon name="arrow" />
		</div>
		<div class="reason">
			<div class="name"><span>*</span>收货类型:</div>
			<div class="val" @click="roRecTypePicker = true">{{ roRecTypeText }}</div>
			<Icon name="arrow" />
		</div>
		<!-- <div class="reason">
        <p>退款金额：￥{{totalAmount}}</p>
    </div> -->
		<div class="photo">
			<div class="title">上传凭证:</div>
			<Uploader v-model="fileList" multiple :max-count="3" :after-read="afterRead" />
		</div>
		<!-- <div class="reason">
        <span>联系电话：</span>
        <input type="number" pattern="[0-9]*" placeholder="手机号" />
    </div> -->

		<div class="foot active" @click="submit" v-if="activeFoot">提交申请</div>
		<div class="foot" v-else>提交申请</div>
		<Popup v-model:show="showPicker" position="bottom">
			<Picker
				show-toolbar
				:columns="reasonList"
				:columns-field-names="customFieldName"
				@cancel="showPicker = false"
				@confirm="onConfirm"
			/>
		</Popup>
		<Popup v-model:show="roTypePicker" position="bottom">
			<Picker show-toolbar :columns="roTypeList" @cancel="roTypePicker = false" @confirm="roTypeConfirm" />
		</Popup>
		<Popup v-model:show="roRecTypePicker" position="bottom">
			<Picker
				show-toolbar
				:columns="roRecTypeList"
				@cancel="roRecTypePicker = false"
				@confirm="roRecTypeConfirm"
			/>
		</Popup>
	</div>
</template>

<script lang="ts">
import { Toast, Icon, Popup, Picker, Uploader } from 'vant'
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { showDictionary } from '@/apis/common'
import { getMallPrdOrderDetail, insertRefundOrder, uploadPic } from '@/apis/mx'
import { useImgPath } from '@/hooks/mx/useImgPath'
import { useSkuName } from '@/hooks/mx/useSkuName'
import { IShowDictionaryItem } from '@/apis/model/commonModel'

interface IConfirmOpts {
	text: string
	id: number
}
export default defineComponent({
	name: 'MxRefund',
	components: { Icon, Popup, Picker, Uploader },
	setup() {
		const { currentRoute, back } = useRouter()
		const { imgPath } = useImgPath()
		const { skuName } = useSkuName()
		const reasonList = ref<IShowDictionaryItem[]>([]) // 退款原因列表
		const data = reactive({
			showPicker: false, // 原因列表弹层
			reasonText: '请选择', // 具体原因

			roTypeList: [
				{ text: '退货退款', id: 0 },
				{ text: '只退款', id: 1 }
			], // 退单类型列表
			roTypePicker: false, // 退单类型列表弹层
			roTypeText: '请选择', // 具体退单类型

			roRecTypeList: [
				{ text: '已收货', id: 0 },
				{ text: '未收到货', id: 1 },
				{ text: '货在途中', id: 2 }
			], // 收货类型列表
			roRecTypePicker: false, // 收货类型列表弹层
			roRecTypeText: '请选择', // 具体收货类型
			fileList: [],
			num: 1, // 退款数量
			maxNum: 1, // 最多退款数量
			refundParams: {
				podCode: 0, // 产品编号
				roType: 0, // 退货类型
				roRecType: 0, // 是否已收货
				roReasonType: 0, // 退货原因
				remark: '' //  备注
			}
		})
		/* eslint-disable-next-line */
		const dataInfo = reactive<any>({})
		const activeFoot = computed(() => {
			return data.reasonText !== '请选择' && data.roTypeText !== '请选择' && data.roRecTypeText !== '请选择'
		})
		const customFieldName = { text: 'dSubName' }
		const getReasonList = () => {
			if (!reasonList.value.length) {
				showDictionary({ dType: 20 }).then(res => {
					// console.log(res)
					reasonList.value = res.data
					// reasonList.value.forEach(i => {
					// 	i.text = i.dSubName
					// 	// i.values = i.dSubCode
					// })
				})
			}
			data.showPicker = true
		}
		// 确认选中原因
		const onConfirm = (val: IShowDictionaryItem) => {
			console.log(val)
			data.showPicker = false
			data.reasonText = val.dSubName
			data.refundParams.roReasonType = val.dSubCode
		}
		const roTypeConfirm = (val: IConfirmOpts) => {
			data.roTypePicker = false
			data.roTypeText = val.text
			data.refundParams.roType = val.id
		}
		const roRecTypeConfirm = (val: IConfirmOpts) => {
			data.roRecTypePicker = false
			data.roRecTypeText = val.text
			data.refundParams.roRecType = val.id
		}
		// 上传图片
		/* eslint-disable-next-line */
		const afterRead = (file: any) => {
			console.log(file)
			const params = new FormData()
			params.append('ppType', '2')
			params.append('mainFile', file.file)
			params.append('compressFile', file.file)
			params.append('key', data.refundParams.podCode + '')
			uploadPic(params).then(res => {
				console.log(res)
			})
		}
		const submit = () => {
			// this.refundParams.roCount = this.num
			// return console.log(data.refundParams)
			insertRefundOrder(data.refundParams).then(res => {
				if (res.resultCode === 1) {
					Toast('退款申请已提交！')
					// push('/mine')
					back()
				}
				console.log(res)
			})
		}
		onMounted(() => {
			const podCode = currentRoute.value.query.podCode || 0
			getMallPrdOrderDetail({ podCode: +podCode }).then(res => {
				if (res.resultCode === 1) {
					Object.assign(dataInfo, res.data)
					// dataInfo =
					data.refundParams.podCode = res.data.podCode
					dataInfo.prdCsPicName = imgPath(dataInfo.prdCsPicName)
					dataInfo.className = skuName(dataInfo.prdCsSkuCollection)
					// res.data.podList.forEach(element => {
					// data.dataInfo.className = ''
					// data.dataInfo.prdCsPicName = data.picPath(data.dataInfo.prdCsPicName)
					dataInfo.prdSum = Number(dataInfo.prdSum).toFixed(2)
					dataInfo.prdPrice = Number((dataInfo.prdPrice * dataInfo.prdFactSum) / dataInfo.prdSum).toFixed(2)
					data.num = dataInfo.prdCount
					data.maxNum = dataInfo.prdCount
					// data.dataInfo.prdCsSkuCollection.forEach(i => {
					//     data.dataInfo.className = data.dataInfo.className + i.params[0].pcdSubName + ' '
					// })
					// msg.prdCsSkuCollection.forEach(i => {
					//     msg.className = msg.className + i.params[0].pcdSubName + ' '
					// })
					// })
				}
			})
		})
		return {
			...toRefs(data),
			dataInfo,
			reasonList,
			customFieldName,
			activeFoot,
			imgPath,
			skuName,
			getReasonList,
			onConfirm,
			roTypeConfirm,
			roRecTypeConfirm,
			afterRead,
			submit
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.refund {
	padding-bottom: 100 * @fontSize;
	.cont {
		padding: 18 * @fontSize 30 * @fontSize;
		background: #fff;
		img {
			width: 184 * @fontSize;
		}
		.info {
			display: inline-block;
			width: 450 * @fontSize;
			margin-left: 20 * @fontSize;
			.title {
				color: #333;
			}
			p {
				margin-top: 10 * @fontSize;
				color: #999;
				font-size: 24 * @fontSize;
			}
			.price {
				margin-top: 10 * @fontSize;
				font-size: 24 * @fontSize;
				text-align: right;
				span {
					float: left;
					color: #ed0c17;
				}
			}
		}
	}
	.reason {
		display: flex;
		align-items: center;
		margin-top: 20 * @fontSize;
		padding: 0 30 * @fontSize;
		line-height: 88 * @fontSize;
		background: #fff;
		.name {
			flex: 1;
			span {
				color: #ed0c17;
			}
		}
		.val {
			margin-right: 30 * @fontSize;
			color: #999;
		}
		img {
			width: 18 * @fontSize;
		}
		p {
			color: #ed0c17;
		}
		span {
			margin-right: 10 * @fontSize;
		}
		input {
			flex: 1;
			text-align: right;
		}
		.add-red {
			width: 30 * @fontSize;
		}
		.num {
			width: 50 * @fontSize;
			margin-right: 0;
			text-align: center;
		}
	}
	.photo {
		margin-top: 20 * @fontSize;
		padding: 0 30 * @fontSize 40 * @fontSize;
		background: #fff;
		.title {
			padding: 30 * @fontSize 0;
			line-height: 1;
		}
	}
	.foot {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		color: #fff;
		font-size: 36 * @fontSize;
		line-height: 98 * @fontSize;
		text-align: center;
		background: #999;
	}
	.active {
		background: #ed0c17;
	}
}
</style>
