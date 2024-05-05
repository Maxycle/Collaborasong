<template>
	<Container class="overflow-y-auto">
		<TrackList isMyTracks/>
	</Container>
</template>

<script>
import Container from '@/components/Container.vue'
import TrackList from '@/components/TrackList.vue'

export default {
	components: {
		Container,
		TrackList
	}
}
</script>
