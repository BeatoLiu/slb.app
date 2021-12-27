<template>
	<div>预返{{ taaPrice }}TAA</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useEcGasCalc } from '@/hooks/mx/useEcGasCalc'
// eslint-disable-next-line no-undef
const props = defineProps({
	mCode: { type: Number, default: 0 },
	price: { type: Number, default: 0 }
})

const taaPrice = ref(0)
const calcPower = useEcGasCalc()
calcPower(props.mCode, props.price).then(res => {
	taaPrice.value = res.value
})
</script>
