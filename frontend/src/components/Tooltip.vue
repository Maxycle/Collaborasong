<template>
	<div v-if="visible" :class="tooltipClasses" :style="style">
		{{ text }}
	</div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

const props = defineProps({
	text: {
		type: String,
		required: true
	},
	position: {
		type: String,
		default: 'top'
	}
})

const visible = ref(true)
const style = ref({})

const showTooltip = (event) => {
	visible.value = true
	const { top, left, width, height } = event.target.getBoundingClientRect()
	const tooltipHeight = 30 // Approximate height of the tooltip

	switch (props.position) {
		case 'top':
			style.value = {
				left: `${left + width / 2}px`,
				top: `${top - tooltipHeight}px`,
				transform: 'translateX(-50%)'
			}
			break
		case 'bottom':
			style.value = {
				left: `${left + width / 2}px`,
				top: `${top + height + tooltipHeight}px`,
				transform: 'translateX(-50%)'
			}
			break
		case 'left':
			style.value = {
				left: `${left - tooltipHeight}px`,
				top: `${top + height / 2}px`,
				transform: 'translateY(-50%)'
			}
			break
		case 'right':
			style.value = {
				left: `${left + width + tooltipHeight}px`,
				top: `${top + height / 2}px`,
				transform: 'translateY(-50%)'
			}
			break
	}
}

const hideTooltip = () => {
	visible.value = false
}

// Expose the methods so they can be called from outside
defineExpose({
	showTooltip,
	hideTooltip
})

const tooltipClasses = ref("absolute top-2 left-2 bg-black text-white text-sm px-2 py-1 rounded shadow-lg pointer-events-none z-50")
</script>

<style scoped>
.tooltip {
	transition: opacity 0.3s ease;
}
</style>
