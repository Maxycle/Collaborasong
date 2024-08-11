<template>
	<div
		class="flex flex-col items-center py-4 w-full h-full bg-gradient-to-r from-neutral-300 to-neutral-400 overflow-y-auto">
		<button v-if="$route.path === '/'"
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 shadow-lg shadow-zinc-600"
			@click="toggleModal">{{ mapButtonText }}</button>
		<div v-if="isModalOpen" class="w-4/6 transition ease-in-out duration-1000 opacity-100 mb-2">
			<Map class="w-full" />
		</div>
		<slot />
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Map from './map/Map.vue';

const { t } = useI18n();
const isModalOpen = ref(false);

const mapButtonText = computed(() => isModalOpen.value ? t('home.closeMap') : t('home.openMap'));

const toggleModal = () => {
	isModalOpen.value = !isModalOpen.value;
};
</script>
