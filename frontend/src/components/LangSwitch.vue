<template>
	<div class="flex items-center">
		<select v-model="$i18n.locale">
			<option v-for="locale in locales" :key="`locale-${locale}`" :value="locale.value">{{ locale.label }}</option>
		</select>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { availableLocales, locale } = useI18n()

// Define a map of locales with labels
const localeLabels = {
	en: 'English',
	fr: 'Français',
	es: 'Español',
	de: 'Deutsch',
	// Add more language labels as needed
}

// Create a computed property that maps the available locales to their labels
const locales = computed(() => {
	console.log('i18n locale =>', locale.value)
	console.log('i18n availableLocales =>', availableLocales)

	return availableLocales.map(code => ({
		value: code,
		label: localeLabels[code] || code // Fallback to code if label is not found
	}))
})
</script>
