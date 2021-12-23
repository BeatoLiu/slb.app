<template>
	<div class="pay-success">
		<div class="pay-cont">
			<div class="img-wrapper">
				<img src="../../assets/img/success.png" alt="" v-if="status === 2" />
				<img src="../../assets/img/fail.png" alt="" v-else />
			</div>
			<!-- <div class="money" v-if="status === 2">订单支付成功 </div> -->
			<div class="money" v-if="status === 2">订单支付成功</div>
			<div class="money error" v-else-if="status === 3">订单支付失败</div>
			<div class="money" v-else-if="status === 0">订单待支付</div>
			<div class="return" @click="$router.replace({ name: 'MxMall' })"><p>返回商城</p></div>
		</div>
	</div>
</template>

<script>
// import { setInterval } from 'timers'
import { defineComponent } from 'vue'
import { selectPayOrderByBizOrderCode } from '../../apis/mx'
export default defineComponent({
	name: 'PaySuccess',
	data() {
		return {
			status: 0, // 0 待支付，2成功，3失败
			id: this.$route.query.id,
			type: this.$route.query.type || null,
			newParams: {
				orderBizCode: +this.$route.query.id,
				orderBizType: 1
			},
			params: {
				orderCode: this.$route.query.id
			}
		}
	},
	mounted() {
		// console.log(this.$route)
		// let timer = setInterval(this.getStatus, 3000)
		if (this.type === 'new') {
			this.status = 2
		} else {
			let count = 0
			const timer = setInterval(() => {
				if (count < 3) {
					selectPayOrderByBizOrderCode(this.newParams).then(res => {
						// console.log(res)
						if (res.resultCode === 1) {
							this.status = res.data.orderPayStatus
						}
					})
					count++
				} else {
					clearInterval(timer)
				}
			}, 3000)
		}
		// this.aaa()
		// this.getStatus()
	}
})
</script>

<style scoped lang="less">
@import '../../assets/css/local.less';
.pay-success {
	position: relative;
	height: calc(100vh - 90px);
	background: #fff;
	.pay-cont {
		padding: 0 20 * @fontSize;
		text-align: center;

		.img-wrapper {
			padding-top: 320 * @fontSize;
			img {
				width: 302 * @fontSize;
			}
		}
		.money {
			margin-top: 35 * @fontSize;
			color: #333;
			font-weight: bold;
			font-size: 36 * @fontSize;
		}
		.error {
			color: red;
		}
	}
	.return {
		margin-top: 50px;
	}
}
</style>
