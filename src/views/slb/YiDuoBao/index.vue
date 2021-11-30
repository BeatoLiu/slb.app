<template>
	<div class="yi-duo-bao">
		<div @click="$router.push({ name: 'PayForYDB', query: { buyType: 1 } })"></div>
		<div @click="$router.push({ name: 'PayForYDB', query: { buyType: 2 } })"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	setup() {}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.yi-duo-bao {
	width: 100vw;
	// min-height: 100vh;
	height: 2600 * @fontSize;
	background-image: url('https://ytxxkj-bucket.oss-cn-hangzhou.aliyuncs.com/img/secret/yiduobao/ydb-bg.jpg');
	background-size: contain;
	background-repeat: no-repeat;
	display: inline-block;
	div {
		width: 480 * @fontSize;
		height: 200 * @fontSize;
		margin-left: 132 * @fontSize;
	}
	div:nth-child(1) {
		margin-top: 630 * @fontSize;
	}
	div:nth-child(2) {
		margin-top: 64 * @fontSize;
	}
}
</style>
