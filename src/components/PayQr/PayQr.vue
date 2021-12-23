<template>
	<div>
		<!-- 支付二维码 -->
		<div id="qr" class="qr-img" hidden>
			<VueQr :logoSrc="imageUrl" :text="qrText" :size="260" :margin="5" :dotScale="1" :logoScale="16"></VueQr>
			<p>请用{{ payTypeName }}扫码支付</p>
		</div>
		<van-image-preview v-model:show="show" :images="images" :before-close="beforeClose">
			<template #index>请用{{ payTypeName }}扫码支付</template>
		</van-image-preview>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue'
import { ImagePreview } from 'vant'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'

export default defineComponent({
	name: 'payQr',
	components: {
		[ImagePreview.Component.name]: ImagePreview.Component,
		VueQr
	},
	props: {
		imageUrl: String,
		qrText: String,
		payTypeName: String,
		show: {
			type: Boolean,
			default: false
		}
		// images: Array
	},
	setup(props, { emit }) {
		const { show, imageUrl, qrText, payTypeName } = toRefs(props)
		const images = ref<any[]>([])
		watch(
			imageUrl,
			options => {
				// 若不设置定时器，图片会显示上一条
				setTimeout(() => {
					const div = document.getElementById('qr')
					const imgUrl = div!.getElementsByTagName('img')[0] // 获取二维码
					images.value = [imgUrl.src]
				}, 500)
			}
			// {
			// 	// immediate: true, // 是否第一次就执行watch，默认false
			// 	deep: true // deep無效
			// }
		)
		const updateShow = (show: boolean) => emit('update:show', show)
		// !不能直接修改showQr的值，只能绕个弯，即使如此，控制台还是会报错，但暂别无它法
		// Todo
		const beforeClose = () => {
			updateShow(false)
			return true
		}

		return {
			// ...toRefs(props),
			images,
			show,
			imageUrl,
			qrText,
			payTypeName,
			beforeClose
		}
	}
})
</script>

<style lang="less" scoped>
.qr-img {
	text-align: center;
}
</style>
