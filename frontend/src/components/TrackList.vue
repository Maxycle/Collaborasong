<template>
	<div class="w-4/5">
		<div class="flex items-center justify-center w-full p-4">
			<div class="w-4/5">
				<p v-if="props.isMyTracks" class="text-2xl font-bold flex justify-center">My tracks</p>
				<p v-else-if="props.isResult" class="text-2xl font-bold flex justify-center">People's collaborations</p>
				<div v-if="currentTrackList.length > 0" :key="refreshFlag">
					<div v-for="track in currentTrackList" :key="track.id" class="">
						<TrackCard :trackId="track.id" :parentTrackId="trackId" class="w-full my-6" />
					</div>
				</div>
				<p v-else class="text-center text-gray-500 bg-blue-400">No tracks available yet</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import TrackCard from './TrackCard.vue';
import { fetchMyTracks } from '../helpers/requests.js';
import { useTrackStore } from '@/stores/modules/tracks';
import { useSessionStore } from '@/stores/modules/sessionStore';


const props = defineProps({
	isResult: {
		type: Boolean,
		default: false
	},
	isMyTracks: {
		type: Boolean,
		default: false
	},
	trackId: {
		type: Number,
		default: undefined
	},
});

const storeTrack = useTrackStore();
const storeSession = useSessionStore();
const isMyTracks = ref(false);
const currentTrackList = ref([]);
const refreshFlag = ref(0);
const initTrackListExecuted = ref(false);

watch(() => storeTrack.loadingData, (newValue, oldValue) => {
	if (newValue === false && !initTrackListExecuted.value) {
		initTrackList()
		console.log('Loading state changed track:', newValue);
	}
})

watch(() => storeSession.isLoggedIn, (newValue, oldValue) => {
	if (newValue === true) {
		initTrackList()
		console.log('Loading state changed session:', newValue);
	}
})

onMounted(() => {
	initTrackList()
})

function initTrackList() {
	if (props.trackId !== undefined) {
		// initTrackListExecuted.value = false
		fetchTrackChildrenIds(props.trackId);
	} else {
		currentTrackList.value = props.isMyTracks ? storeTrack.myTrackListIds : storeTrack.trackListIds;
	}
	if (storeSession.isLoggedIn) {
		fetchMyTracks()
		initTrackListExecuted.value = true
	}
}

async function fetchTrackChildrenIds(trackId) {
	try {
		const response = await axios.get(`/index_results/${trackId}`,
			{
				headers: {
					Authorization: `${storeSession.getAuthToken}`
				}
			});
		currentTrackList.value = response.data;
	} catch (error) {
		console.error('Error fetching tracks:', error);
	}
}
</script>
