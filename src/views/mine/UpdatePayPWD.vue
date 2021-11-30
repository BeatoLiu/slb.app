<template>
	<PayPWDComponent bizType="update"> </PayPWDComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PayPWDComponent from './components/PayPWDComponent.vue'

export default defineComponent({
	name: 'UpDatePayPWD',
	components: {
		PayPWDComponent
	},
	setup() {}
})
</script>
