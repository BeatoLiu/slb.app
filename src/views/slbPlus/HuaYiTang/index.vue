<template>
	<div>
		<div><img :src="data.bg1" alt="霍老" /></div>
		<div class="btn"><Button type="primary" size="large" @click="push('')">预约课程</Button></div>
		<div><img :src="data.bg2" alt="地龙蛋白人参" /></div>
		<div class="btn bg-white"><Button type="primary" size="large">立即购买</Button></div>
		<div><img :src="data.bg3" alt="人参枸杞子" /></div>
		<div class="btn bg-white"><Button type="primary" size="large">立即购买</Button></div>
	</div>
</template>

<script lang="ts">
import { assetsOrigin } from '@/utils/config'
import { Button } from 'vant'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'HuaYiTang',
	components: {
		Button
	},
	setup() {
		const { push } = useRouter()
		const data = reactive({
			bg1: assetsOrigin + '/img/slbApp/slb-plus/huaYiTang/bg-1.png',
			bg2: assetsOrigin + '/img/slbApp/slb-plus/huaYiTang/bg-2.png',
			bg3: assetsOrigin + '/img/slbApp/slb-plus/huaYiTang/bg-3.png'
		})
		return {
			data,
			push
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../../assets/css/local.less';
.btn {
	padding: 0 6 * @basePadding 2 * @basePadding 6 * @basePadding;
}
.bg-white {
	background-color: #fff;
}
</style>
