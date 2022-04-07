import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { CellGroup, Uploader, Button, Field, Popup, Search, UploaderFileListItem, Cell, Toast } from 'vant'
import { useRouter } from 'vue-router'
import { useImgPath } from '@/hooks/mx/useImgPath'
import './AddCreditCard.less'
import { addCreditCard, getCreditCardByMccCode, showBankList, updateCreditCard } from '@/apis/bankCard'
import { IShowBankListItem } from '@/apis/model/bankCardModel'
import { useUploadImg } from '@/hooks/web/useUploadImg'

export default defineComponent({
	name: 'AddCreditCard',
	setup() {
		const { push, currentRoute } = useRouter()
		const { imgPath } = useImgPath()
		const { uploadImg } = useUploadImg()
		const data = reactive({
			id: (currentRoute.value.query.id as string) || '',
			mccCardName: '',
			mccBankName: '',
			mccCard: '',
			mccBankId: '',
			mccCardImgUrl: '',
			imgMsg: '上传',
			isImgUpload: false,
			// 选择银行相关
			showBankListPop: false,
			keywords: ''
		})
		const imgList = ref<UploaderFileListItem[]>([])
		const bankList = ref<IShowBankListItem[]>([])
		const dataList = ref<IShowBankListItem[]>([])
		const afterRead = () => {
			data.imgMsg = '上传'
			data.isImgUpload = false
		}
		// 上传图片
		const upload = async () => {
			const file = imgList.value[0].file as File
			const formData = new FormData()
			const res = await uploadImg(file, 'ocr/bankCard', formData)
			if (res.resultCode === 1) {
				data.imgMsg = '上传完成'
				data.isImgUpload = true
				data.mccCardImgUrl = res.data.image
				res.data.bankCardNumber && (data.mccCard = res.data.bankCardNumber)
				Toast('上传成功')
			} else {
				data.imgMsg = '上传失败'
			}
			// data.imgIsLoading = false
		}
		// 提交
		const toSign = () => {
			const params = {
				mccBankName: data.mccBankName,
				mccCard: data.mccCard,
				mccCardName: data.mccCardName,
				mccBankId: data.mccBankId,
				mccCardImgUrl: data.mccCardImgUrl,
				mccCardType: 2
			}
			if (data.id) {
				updateCreditCard({ ...params, mccCode: +data.id }).then(res => {
					if (res.resultCode === 1) {
						Toast('修改成功！')
						push({ name: 'CreditCard' })
					}
				})
			} else {
				addCreditCard(params).then(res => {
					if (res.resultCode === 1) {
						Toast('新增成功！')
						push({ name: 'CreditCard' })
					}
				})
			}
		}
		// 检索银行
		const filterBank = (e: InputEvent) => {
			// !e.target需要明确声明为 HTMLTextAreaElement类型，才会有value属性
			const keywords = (e.target as HTMLTextAreaElement).value
			bankList.value = dataList.value.filter(item => item.biName.indexOf(keywords) > -1)
		}
		const dis = computed(() => {
			return data.mccCardName.length > 1 && data.mccBankName && data.mccCard && data.mccCardImgUrl
		})
		onMounted(() => {
			if (data.id) {
				// 提交信用卡修改
				getCreditCardByMccCode({ mccCode: +data.id }).then(res => {
					if (res.resultCode === 1) {
						data.mccBankName = res.data.mccBankName
						data.mccCard = res.data.mccCard
						data.mccCardName = res.data.mccCardName
						data.mccBankId = res.data.mccBankId
						data.mccCardImgUrl = res.data.mccCardImgUrl
						res.data.mccCardImgUrl && imgList.value.push({ url: imgPath(res.data.mccCardImgUrl) })
					}
				})
				document.title = '修改信用卡'
			}
			// 获取银行列表
			showBankList({ biType: 1 }).then(res => {
				if (res.resultCode === 1) {
					dataList.value = res.data.dataIn
					bankList.value = res.data.dataIn
				}
			})
		})
		return () => {
			return (
				<div class="add-credit-card">
					<div class="login-cont">
						<CellGroup>
							<div class="flex-space img-item">
								<p>卡照</p>
								<Uploader
									v-model={[imgList.value]}
									after-read={afterRead}
									upload-text="卡正面照"
									max-count="1"
								/>
								<Button
									type="primary"
									disabled={!imgList.value.length || data.imgMsg !== '上传'}
									onClick={upload}
								>
									{data.imgMsg}
								</Button>
							</div>
							<Field
								v-model={[data.mccCard]}
								center
								clearable
								type="digit"
								label="卡号"
								placeholder="信用卡卡号"
							/>
							<Field
								v-model={[data.mccBankName]}
								label="银行"
								placeholder="发卡银行"
								right-icon="arrow"
								readonly
								onClick={() => {
									data.showBankListPop = true
								}}
							/>
							<Field v-model={[data.mccCardName]} clearable label="姓名" placeholder="持卡人姓名" />
						</CellGroup>
						<div class="page-tips">
							<p class="title">温馨提示：</p>
							<div>
								<p>1、若提示图片过大，可用手机截图重新上传</p>
								<p>2、若卡号识别失败，可手动输入</p>
							</div>
						</div>
						<Button type="primary" class="btn" onClick={toSign} disabled={!dis.value}>
							提 交
						</Button>
					</div>
					<Popup v-model={[data.showBankListPop, 'show']} position="top">
						<div class="bank-list">
							<p class="title">银行选择</p>
							<Search shape="round" placeholder="请输入银行名称" clearable onInput={filterBank} />
							<CellGroup>
								{bankList.value.map(item => {
									return (
										<Cell
											key={item.biCode}
											title={item.biName}
											onClick={() => {
												data.mccBankName = item.biName
												data.mccBankId = item.bankId
												data.showBankListPop = false
											}}
										/>
									)
								})}
							</CellGroup>
						</div>
					</Popup>
				</div>
			)
		}
	}
})
