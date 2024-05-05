<template>
	<div class="flex flex-col items-center py-4 w-full h-full bg-amber-100">
		<button v-if="$route.path === '/'"
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 shadow-lg shadow-zinc-600"
			@click="toggleModal">{{ mapButtonText }}</button>
		<div v-if="isModalOpen" class="w-4/6 transition ease-in-out duration-1000 opacity-100 mb-2">
			<Map class="w-full" />
		</div>
		<slot />
	</div>
</template>

<script>
import Map from './map/Map.vue'
export default {
	components: {
		Map
	},

	data() {
		return {
			isModalOpen: false
		};
	},
	computed: {
		mapButtonText() {
			return this.isModalOpen ? 'Close da muzzakuckin map' : 'See on da muzzakuckin map'
		}
	},

	methods: {
		toggleModal() {
			this.isModalOpen = !this.isModalOpen
		}
	}
}
</script>