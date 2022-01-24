<script lang="ts">
import { CellGroup, Field, Uploader, Button, Toast } from 'vant'
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useUploadImg } from '@/hooks/web/useUploadImg'
import { bindMemberIdCardInfo, getMemberByCode } from '@/apis/mem'
import { useImgPath } from '@/hooks/mx/useImgPath'

type ICard = 'Front' | 'Back'
/* eslint-disable @typescript-eslint/no-explicit-any */
interface IData {
	[key: string]: any
	imgMsgFront: string
	imgListFront: any[]
	imgIsLoadingFront: boolean
	imgMsgBack: string
	imgListBack: any[]
	imgIsLoadingBack: boolean
}
export default defineComponent({
	name: 'IdentityCard',
	components: { CellGroup, Field, Uploader, Button },
	setup() {
		const { imgPath } = useImgPath()
		const { uploadImg } = useUploadImg()

		const params = reactive({
			name: '',
			idCardNo: '',
			idCardBackImageUrl: '',
			idCardFaceImageUrl: ''
		})
		const data = reactive<IData>({
			imgMsgFront: '上传',
			imgListFront: [], // 圖片
			imgIsLoadingFront: false, // 上傳狀態

			imgMsgBack: '上传',
			imgListBack: [],
			imgIsLoadingBack: false
		})
		const dis = computed(() => {
			return !(params.name && params.idCardNo && params.idCardFaceImageUrl && params.idCardBackImageUrl)
		})

		onMounted(() => {
			getMemberByCode().then(res => {
				if (res.resultCode === 1) {
					Object.assign(params, res.data)
					res.data.idCardFaceImageUrl && data.imgListFront.push({ url: imgPath(res.data.idCardFaceImageUrl) })
					res.data.idCardBackImageUrl && data.imgListBack.push({ url: imgPath(res.data.idCardBackImageUrl) })
				}
			})
		})

		const afterRead = (val: ICard) => {
			console.log(val)
			data['imgMsg' + val] = '上传'
			data['imgIsLoading' + val] = false
		}
		// 上傳圖片
		const upload = async (val: ICard) => {
			const file = data['imgList' + val][0].file
			console.log(data, file)
			const formData = new FormData()
			formData.append('idCardSide', val.toLowerCase())
			data['imgMsg' + val] = '上传中'
			data['imgIsLoading' + val] = true
			try {
				const res = await uploadImg(file, 'ocr/idCard', formData)
				if (res.resultCode === 1) {
					data['imgMsg' + val] = '上传完成'
					data['imgIsLoading' + val] = false
					Object.assign(params, res.data)
				} else {
					data['imgMsg' + val] = '上传失败'
				}
			} catch {
				data['imgIsLoading' + val] = false
			}
		}
		const toSign = () => {
			bindMemberIdCardInfo(params).then(res => {
				if (res.resultCode === 1) {
					Toast('操作成功')
				}
			})
		}
		return {
			params,
			...toRefs(data),
			dis,
			afterRead,
			upload,
			toSign
		}
	}
})
</script>
<template>
	<div class="login-cont">
		<CellGroup>
			<div class="flex-space img-item">
				<p>身份证正面</p>
				<Uploader
					v-model="imgListFront"
					:after-read="() => afterRead('Front')"
					upload-text="身份证正面照"
					:max-count="1"
				/>
				<Button
					type="primary"
					:disabled="!imgListFront.length || imgMsgFront !== '上传'"
					:loading="imgIsLoadingFront"
					@click="upload('Front')"
					>{{ imgMsgFront }}</Button
				>
			</div>
			<div class="flex-space img-item">
				<p>身份证反面</p>
				<Uploader
					v-model="imgListBack"
					:after-read="() => afterRead('Back')"
					upload-text="身份证反面照"
					:max-count="1"
				/>
				<Button
					type="primary"
					:disabled="!imgListBack.length || imgMsgBack !== '上传'"
					:loading="imgIsLoadingBack"
					@click="upload('Back')"
					>{{ imgMsgBack }}</Button
				>
			</div>
			<Field v-model="params.name" center clearable label="真实姓名" placeholder="真实姓名" readonly />
			<Field v-model="params.idCardNo" center clearable label="身份证号" placeholder="身份证号" readonly />
		</CellGroup>
		<div class="page-tips">
			<p class="title">温馨提示：</p>
			<div>
				<p>1、若提示图片过大，可用手机截图重新上传</p>
			</div>
		</div>
		<!-- <input type="file" /> -->
		<Button class="btn" @click="toSign" :disabled="dis">提 交</Button>
	</div>
</template>
<style lang="less" scoped>
@import '../../assets/css/local.less';
// box-sizing: border-box;
.login-cont {
	box-sizing: border-box;
	// height: calc(100vh - 46px);
	padding: 20 * @fontSize 0;
	text-align: center;
	// background: #fff;
	.input {
		position: relative;
		padding-top: 140 * @fontSize;
		input {
			width: 100%;
			margin-top: 70 * @fontSize;
			padding: 12 * @fontSize;
			border-bottom: 1px solid #ccc;
		}
		span {
			position: absolute;
			right: 0;
			bottom: 10 * @fontSize;
			padding: 0 10 * @fontSize;
			color: #ccc;
			line-height: 40 * @fontSize;
			border: 1px solid #ccc;
			border-radius: 20 * @fontSize;
		}
	}
	.btn {
		display: inline-block;
		width: calc(100% - 32px);
		margin-top: 50 * @fontSize;
		color: #fff;
		font-size: 30 * @fontSize;
		line-height: 80 * @fontSize;
		background: #e7283b;
		border-radius: 10 * @fontSize;
	}
}
.img-item {
	margin-top: 20 * @fontSize;
	padding: 10px 16px;
	& > p {
		width: 150 * @fontSize;
		margin-bottom: 8px;
		color: #646566;
		text-align: left;
	}

	& > button {
		margin-bottom: 8px;
	}
}
.bank-list {
	.title {
		margin-top: 90px;
		font-size: 36 * @fontSize;
		text-align: center;
	}
}
.page-tips {
	text-align: left;
}
</style>
