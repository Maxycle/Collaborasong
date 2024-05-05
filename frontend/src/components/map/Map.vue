<template>
	<MapboxMap access-token="pk.eyJ1Ijoia2ViYWJhY29vbCIsImEiOiJjbHQ1bnVoN3QwMmdnMmxzMGppenlja3VvIn0.IFeRK3uh56z33cdb--8Nbw"
		style="height: 400px" map-style="mapbox://styles/mapbox/streets-v11" :center="mapCenter" :zoom="1">
		<MapboxMarker :lng-lat="[0, 0]" />
		<MapboxMarker :lng-lat="[55, 1]" />
		<!-- <MapboxPopup :lng-lat="[0, 0]" class="bg-red-300">
      <p>{{ kruughEtSaReum }}</p>
    </MapboxPopup> -->
	</MapboxMap>
</template>

<script setup>
import { ref, computed } from 'vue';
import { MapboxMap, MapboxMarker, MapboxPopup } from '@studiometa/vue-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const mapCenter = ref([0, 0]);
const kruughEtSaReum = computed(() => 'mange ton chien');

</script>
