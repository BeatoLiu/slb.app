<template>
	<PayPWDComponent> </PayPWDComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PayPWDComponent from './components/PayPWDComponent.vue'

export default defineComponent({
	name: 'SetPayPWD',
	components: {
		PayPWDComponent
	},
	setup() {}
})
</script>
