<template>
	<div class="w-4/5">
		<div class="flex items-center justify-center w-full p-4">
			<div class="w-4/5">
				<p v-if="props.isMyTracks" class="text-2xl font-bold flex justify-center">{{ t('trackList.myTracks') }}</p>
				<p v-else-if="props.isResult" class="text-2xl font-bold flex justify-center">{{
					t('trackList.peopleCollaborations') }}</p>
				<div v-if="currentTrackList.length > 0">
					<div v-for="track in currentTrackList" :key="track.id" class="">
						<TrackCard :trackId="track.id" :parentTrackId="trackId" :isMyTracks="isMyTracks" :isResult="isResult" class="w-full my-6" />
					</div>
				</div>
				<p v-else class="text-center text-gray-500 bg-blue-400">{{ t('trackList.noTracks') }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import TrackCard from './TrackCard.vue';
import { useTrackStore } from '@/stores/modules/tracks';
import { useSessionStore } from '@/stores/modules/sessionStore';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
const currentTrackList = ref([]);
const { isLoggedIn, getAuthToken } = useSessionStore();

watch(
	[() => isLoggedIn, () => storeTrack.trackListIds, () => storeTrack.myTrackListIds],
	([loggedIn, trackListIds, myTrackListIds]) => {
		if (loggedIn) {
			console.log('initTrackList')
			initTrackList();
		}
	},
	{ immediate: true }
);

function initTrackList() {
	if (props.trackId !== undefined) {
		fetchTrackChildrenIds(props.trackId);
	} else {
		currentTrackList.value = props.isMyTracks ? storeTrack.myTrackListIds : storeTrack.trackListIds
	}
}

async function fetchTrackChildrenIds(trackId) {
	try {
		const response = await axios.get(`/index_results/${trackId}`,
			{
				headers: {
					Authorization: `${getAuthToken}`
				}
			});
		currentTrackList.value = response.data;
		currentTrackList.value.map((item) => storeTrack.setResultTracks(item.id))
	} catch (error) {
		console.error('Error fetching tracks:', error);
	}
}
</script>
