import { unref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTitle as usePageTitle } from '@vueuse/core'
import { useI18n } from '../setting/useI18n'

export const useTitle = () => {
	const TITLE = '数联宝'
	const { currentRoute } = useRouter()
	const { t } = useI18n()
	const pageTitle = usePageTitle()
	// console.log(currentRoute)
	watch(
		() => currentRoute.value.path,
		() => {
			const route = unref(currentRoute)
			// console.log(route)
			const tTitle = t(route.meta.title as string)
			pageTitle.value = tTitle || TITLE
		},
		{ immediate: true }
	)

}
