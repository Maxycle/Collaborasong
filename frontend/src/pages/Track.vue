<template>
	<Container>
		<div class="w-4/5">
			<div class="pb-4">
				<span class="font-bold">{{ author.username }}</span> needs some <span class="font-bold">{{ instrument || 'stuff'
					}}</span> to make some <span class="font-bold">{{ genre || 'weird' }}</span> music.
			</div>
			<div class="flex justify-center space-x-4 pb-4">
				<AnarcapButton class=" transition hover:-translate-x-6 hover:scale-110 duration-300">
					<span class="relative">listen to "{{ trackBasicData.title
						}}"</span>
				</AnarcapButton>
				<AnarcapButton class="transition hover:translate-y-2 hover:scale-y-150 duration-300"><span class="relative">download "{{
					trackBasicData.title
						}}"</span></AnarcapButton>
				<AnarcapButton class=" transition hover:translate-x-6 hover:scale-110 duration-300">
					<span class="relative"><router-link :to="{ name: 'result_track', params: { zeTrackId: trackId } }">upload your
							track/result</router-link></span>
				</AnarcapButton>
			</div>
			<div class="flex justify-center">
				<TracksList isResult :trackId="trackId" class="justify-center" />
			</div>
		</div>
	</Container>
</template>

<script setup>
import { ref, computed } from 'vue';
import Container from '@/components/Container.vue';
import AnarcapButton from '@/components/buttons/AnarcapButton.vue';
import TracksList from '@/components/TrackList.vue';
import { useRoute } from 'vue-router';
import { useTrackStore } from '@/stores/modules/tracks';

const route = useRoute();
const store = useTrackStore();

// Extract trackId from route params
const trackId = ref(Number(route.params.zeTrackId));

// Compute genre, author, instrument, band from trackBasicData in Vuex store
const trackBasicData = computed(() => store.trackBasicData);
const genre = computed(() => trackBasicData.value.genres.map(item => item.name).join('/'));
const author = computed(() => trackBasicData.value.author);
const instrument = computed(() => trackBasicData.value.instruments.map(item => item.name).join('/'));
</script>
