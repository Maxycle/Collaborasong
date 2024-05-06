<template>
	<Container>
		<div class="w-4/5">
			<div class="flex justify-center space-x-4 pb-4">
				<div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
					<div class="grid grid-cols-2 gap-2 mb-2">
						<div>Instrument(s) added</div>
						<div></div>
						<Autocomplete canAddNewOption heading='Instrument recherchié' @item-selected="addParameters"
							@add-new-option="addNewOption" />
						<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">Upload
							your track</button>
						<div class="flex flex-wrap mt-2">
							<div v-for="item in instrumentsList" :key="item">
								<ParamButton :item="item" removable @removed="removeParameters" />
							</div>
						</div>
						<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-span-2"
							@click="createTrack">Add your création</button>
					</div>
				</div>
			</div>
		</div>
	</Container>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import axios from 'axios'
import Container from '@/components/Container.vue'
import Autocomplete from '@/components/Autocomplete.vue'
import ParamButton from '@/components/buttons/ParamButton.vue'
import router from '@/router.js'
import { fetchTracks, fetchMyTracks } from '@/helpers/requests.js'
import { useSessionStore } from '@/stores/modules/sessionStore';
import { useTrackStore } from '@/stores/modules/tracks';
import { useRoute } from 'vue-router';

const route = useRoute();
const trackId = ref(Number(route.params.zeTrackId))
const instrumentsList = ref([])
const storeSession = useSessionStore()
const storeTrack = useTrackStore();

const addParameters = (obj) => {
	const instrumentListNames = instrumentsList.value.map(item => item.name)
	if (obj.name !== '' && !instrumentListNames.includes(obj.name)) {
		instrumentsList.value.push(obj)
	}
}

const removeParameters = (itemToRemove) => {
	instrumentsList.value = instrumentsList.value.filter(item => item.id !== itemToRemove.id)
}

const createTrack = async () => {

	try {
		const response = await axios.post('/tracks', {
			music_track: {
				title: storeTrack.trackBasicData.title,
				instrument_ids: instrumentsList.value.map(item => item.id),
				music_genre_ids: storeTrack.trackBasicData.genres.map(item => item.id),
				parent_id: trackId.value
			}
		},
			{
				headers: {
					Authorization: `${storeSession.getAuthToken}`
				}
			})

		await Promise.all([
			fetchTracks('/tracks'),
			fetchMyTracks()
		])

		router.push('/')
		console.log('New track created:', response.data)
	} catch (error) {
		console.error('Error creating track:', error)
	}
}

const addNewOption = async (obj) => {
	await createResource('instruments', obj.newOption, instrumentsList);
}


const createResource = async (endpoint, value, itemsProp) => {

	try {
		const response = await axios.post(`/${endpoint}`, { [endpoint.slice(0, -1)]: { name: value } },
			{
				headers: {
					Authorization: `${storeSession.getAuthToken}`
				}
			}
		);
		const newResource = { id: response.data.id, name: response.data.name }
		itemsProp.value.push(newResource)
	} catch (error) {
		console.error(`Error creating ${endpoint}:`, error);
	}
}
</script>
