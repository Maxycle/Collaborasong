<template>
  <Container>
    <TrackList class="w-full"/>
  </Container>
	<h1 class="bg-red-400">Ze HoMe !!</h1>
</template>
  
<script>
import Container from '@/components/Container.vue'
import TrackList from '@/components/TrackList.vue'

export default {
  components: {
    Container,
    TrackList
},

  data() {
    return {
      tracks: []
    };
  }
}
</script>
  