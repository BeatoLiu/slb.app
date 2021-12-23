<template>
	<div class="take-cash-account">
		<div class="login-cont">
			<CellGroup>
				<Field readonly>
					<template #button>
						<div class="flex-space">
							<div
								id="walletUrl"
								class="flex-center"
								style="color: #07c160; margin-right: 10px"
								:data-clipboard-text="baseWalletUrl"
								@click="clipboard('#walletUrl')"
							>
								<Icon name="description" color="#07c160" size="20" />复制
							</div>
							<div class="flex-center" style="color: #ee0a24" @click="edit">
								<Icon name="edit" color="#ee0a24" size="20" />{{ editText }}
							</div>
						</div>
					</template>
				</Field>
				<Field
					v-if="walletUrlEdit"
					v-model="walletUrlShadow"
					:disabled="walletUrlEdit"
					label="钱包地址"
					placeholder="钱包地址"
					clearable
				/>
				<Field v-else v-model="walletUrl" label="钱包地址" placeholder="钱包地址" clearable />
				<!-- <Field v-model="certCode" center clearable label="验证码" placeholder="请输入短信验证码" v-if="!alipayAcctEdit">
					<template #button>
						<Button size="small" type="primary" @click="getCode" :disabled="!counting">
							{{ counting ? t('common.vCodeText') : t('common.vCodeTimeText', [current.seconds]) }}
						</Button>
					</template>
				</Field> -->
			</CellGroup>
		</div>
		<div class="page-tips">
			<p class="title">温馨提示：</p>
			<div>
				<p>用于完善（修改）TAA的钱包地址</p>
				<p>钱包地址为去中心化钱包的收款地址<Icon @click="showHelpImg = true" name="question" color="red" /></p>
			</div>
		</div>
		<Button class="btn" @click="toSign" :disabled="!dis" v-if="!walletUrlEdit">提交绑定</Button>

		<van-image-preview v-model:show="showHelpImg" :images="helpImages" @change="onChange">
			<template v-slot:index>
				<div class="help-tips">
					<br />
					<p>{{ steps[idx] }}</p>
					<br />
				</div>
			</template>
			<!-- <template v-slot:cover>第{{ idx }}页</template> -->
		</van-image-preview>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onActivated, reactive, toRefs } from 'vue'
import { Toast, Field, CellGroup, Button, Icon, ImagePreview } from 'vant'
import { getMemberWalletUrl, updateWalletUrl } from '@/apis/tAA'
import { useRouter } from 'vue-router'
import { picDisplayPath } from '@/utils/config'
import useClipboard from '../../hooks/web/useClipboard'
import { useStore } from '@/store'

export default defineComponent({
	name: 'TakeCashAccount-alive',
	components: {
		Field,
		CellGroup,
		Button,
		[ImagePreview.Component.name]: ImagePreview.Component,
		Icon
	},
	setup() {
		const { go } = useRouter()
		const clipboard = useClipboard()
		const store = useStore()
		// const { t } = useI18n()
		// const countDown = useCountDown({
		// 	// 倒计时 24 小时
		// 	time: 60000,
		// 	onFinish: () => {
		// 		data.counting = true
		// 	}
		// })

		const data = reactive({
			walletUrl: '',
			baseWalletUrl: '',
			walletUrlShadow: '',
			walletUrlEdit: false,
			editText: '修改',
			// password: '',
			// alipayAcct: '',
			// alipayAcctEdit: false,
			// certCode: '',
			// //倒计时
			// counting: true

			showHelpImg: false,
			helpImages: [
				picDisplayPath + 'slbApp/slb/wallet-help-1.png',
				picDisplayPath + 'slbApp/slb/wallet-help-2.png'
			],
			steps: ['1、打开去中心化钱包首页，点击“收款”', '2、复制钱包地址，在数联宝APP粘贴即可'],
			idx: 0
		})
		const dis = computed(() => {
			return data.walletUrl
		})

		const edit = () => {
			// data.alipayAcctEdit = false
			// data.walletUrlEdit = false
			data.walletUrlEdit = !data.walletUrlEdit
			!data.walletUrlEdit
				? ((data.editText = '取消'), (data.walletUrl = data.baseWalletUrl))
				: (data.editText = '修改')
		}
		const onChange = (index: number) => {
			data.idx = index
		}
		// 提交
		const toSign = () => {
			const params = {
				// alipayAcct: data.alipayAcct,
				// certCode: data.certCode,
				walletUrl: data.walletUrl
			}
			updateWalletUrl(params).then(res => {
				if (res.resultCode === 1) {
					const userInfo = { ...JSON.parse(localStorage.userInfo), walletUrl: data.walletUrl }
					store.dispatch('user/setUserInfo', userInfo)
					Toast('钱包地址上传成功')
					// push('/mine')
					go(-1)
				}
			})
		}

		onActivated(() => {
			// 先查看會員是否已有提現賬號
			getMemberWalletUrl().then(res => {
				if (res.resultCode === 1) {
					data.walletUrl = res.data.walletUrl || ''
					data.baseWalletUrl = res.data.walletUrl
					data.walletUrlShadow =
						data.walletUrl.substring(0, 4) + '****' + data.walletUrl.substring(data.walletUrl.length - 4)
					if (data.walletUrl) data.walletUrlEdit = true
				}
			})
		})
		return {
			...toRefs(data),
			dis,
			onChange,
			// current: countDown.current,
			clipboard,
			edit,
			// getCode,
			toSign
			// t
		}
	}
})
</script>

<style lang="less" scoped>
@import '../../assets/css/local.less';
.take-cash-account {
	// height: calc(100vh - 90px);
	box-sizing: border-box;
	padding: 20 * @fontSize;
	font-size: 28 * @fontSize;
	.login-cont {
		// height: calc(100vh);
		padding-bottom: 20 * @fontSize;
		text-align: center;
		background: #fff;
	}
	.btn {
		width: 100%;
		margin: 90 * @fontSize 0;
		color: #fff;
		font-size: 28 * @fontSize;
		line-height: 80 * @fontSize;
		text-align: center;
		background: #e7283b;
		border-radius: 10px;
	}
	.help-tips {
		width: 100vw;
		text-align: center;
		background: rgba(0, 0, 0, 0.7);
	}
}
</style>
