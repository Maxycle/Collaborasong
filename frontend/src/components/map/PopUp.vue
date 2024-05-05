<template>
  <div>
    <div ref="popup" />
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export default {
  data() {
    return {
      geocoder: null,
      geocoderResult: null
    };
  },
  mounted() {
    this.initializeGeocoder();
  },

  methods: {
    initializeGeocoder() {
      mapboxgl.accessToken = 'pk.eyJ1Ijoia2ViYWJhY29vbCIsImEiOiJjbHQ1bnVoN3QwMmdnMmxzMGppenlja3VvIn0.IFeRK3uh56z33cdb--8Nbw';
      this.geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'country,region,place,postcode,locality,neighborhood'
      });

      this.geocoder.addTo(this.$refs.popup);

      const results = document.getElementById('result');

      this.geocoder.on('result', (e) => {
        this.geocoderResult = e.result, null, 2
				// this.geocoderResult = JSON.stringify(e.result, null, 2);
      });

      this.geocoder.on('clear', () => {
        this.geocoderResult = '';
      });
    }
  }
};
</script>

<style>
    .geocoder {
				background-color: rgb(20 184 166);
    }
    .mapboxgl-ctrl-geocoder {
        min-width: 50%;
				background-color: rgb(27, 135, 49);
    }
</style>
