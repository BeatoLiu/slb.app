<template>
	<div>预返{{ taaPrice }}TAA</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue-demi'
import { useEcGasCalc } from '../../../hooks/mx/useEcGasCalc'
const props = defineProps({
	mCode: Number,
	price: Number
})

const taaPrice = ref(0)
const calcPower = useEcGasCalc()
calcPower(props.mCode, props.price).then(res => {
	taaPrice.value = res.value
})
</script>
