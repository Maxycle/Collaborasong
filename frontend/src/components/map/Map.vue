<template>
	<div v-if="mapboxAccessToken !== 'no tok'">
		<MapboxMap :access-token="mapboxAccessToken" style="height: 400px" map-style="mapbox://styles/mapbox/streets-v11"
			:center="mapCenter" :zoom="1">
			<MapboxMarker :lng-lat="[0, 0]" />
			<MapboxMarker :lng-lat="[55, 1]" />
			<!-- <MapboxPopup :lng-lat="[0, 0]" class="bg-red-300">
      <p>{{ kruughEtSaReum }}</p>
    </MapboxPopup> -->
		</MapboxMap>
	</div>
	<div v-else>
		Loading...
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { MapboxMap, MapboxMarker, MapboxPopup } from '@studiometa/vue-mapbox-gl';
import { useTrackStore } from '@/stores/modules/tracks';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxAccessToken = ref("no tok");
const mapCenter = ref([0, 0]);
const kruughEtSaReum = computed(() => 'mange ton chien');
const storeTrack = useTrackStore();

onMounted(() => {
	console.log('Environment Variables:', import.meta.env);
	mapboxAccessToken.value = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
	console.log('tok tok token =>', mapboxAccessToken.value)
})
</script>
