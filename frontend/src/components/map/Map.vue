<template>
	<div v-if="mapboxAccessToken !== 'no tok'">
		<div v-if="trackCardDisplayed" class="">
			<TrackCard :trackId="trackCardDisplayed" class="mb-2" :key="refreshKey" />
		</div>
		<MapboxMap :access-token="mapboxAccessToken" style="height: 400px" map-style="mapbox://styles/mapbox/streets-v11"
			:center="mapCenter" :zoom="10">
			<div v-for="track in storeTrack.filteredTracks">
				<MapboxMarker v-if="track.coordinates.length" :lng-lat="track.coordinates" popup class="">
					<template v-slot:popup>
						<div class="cursor-pointer" @click="toggleTrackCard(track.id)">
							<p>Click to {{ trackCardDisplayed === track.id ? 'close' : 'open' }}</p>
							<p class="font-extrabold italic">"{{ track.title }}"</p>
						</div>
					</template>
				</MapboxMarker>
			</div>
		</MapboxMap>
	</div>
	<div v-else>
		Loading...
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { MapboxMap, MapboxMarker } from '@studiometa/vue-mapbox-gl';
import { useTrackStore } from '@/stores/modules/tracks';
import 'mapbox-gl/dist/mapbox-gl.css';
import TrackCard from '@/components/TrackCard.vue';

const mapboxAccessToken = ref("no tok");
const storeTrack = useTrackStore();
const trackCardDisplayed = ref(undefined)
const refreshKey = ref(0)

onMounted(() => {
	mapboxAccessToken.value = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
})

const mapCenter = computed(() => storeTrack.mapCenter.length === 2 ? storeTrack.mapCenter : [2.35410, 48.86744])

const toggleTrackCard = (id) => {
	trackCardDisplayed.value = trackCardDisplayed.value !== id ? id : undefined
	refreshKey.value++
}

watch(
	() => storeTrack.filteredTracks,
	(newFilteredTracks) => {
		trackCardDisplayed.value = undefined
	}
)
</script>
