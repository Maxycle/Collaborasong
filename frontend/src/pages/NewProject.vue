<template>
	<Container>
		<div class="w-4/5">
			<div class="flex justify-center space-x-4 pb-4">
				<div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
					<div class="grid grid-cols-4 gap-2 sm:mt-20">
						<div v-for="label in filterHeaders" :key="label">{{ label }}</div>
						<div>{{ t('trackTitle') }}</div>
						<div v-for="param in newProjectParams" :key="param.name">
							<Autocomplete :heading="param.name" canAddNewOption @item-selected="addParameters"
								@item-inputted="onNewItemInput" @add-new-option="addNewOption" />
						</div>
						<Autocomplete heading='Track title' @item-selected="addParameters" @item-inputted="onNewItemInput" />
						<div class="flex flex-wrap mt-2">
							<div v-for="item in genres" :key="item">
								<ParamButton :item="item" removable @removed="removeParameters('Music style', item)" />
							</div>
						</div>
						<div class="flex flex-wrap mt-2">
							<div v-for="item in instruments" :key="item">
								<ParamButton :item="item" removable @removed="removeParameters('Instrument needed', item)" />
							</div>
						</div>
						<div class="flex flex-wrap mt-2"></div>
						<div
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-start-2 col-span-2 mt-2 shadow-md shadow-zinc-600">
							<input type="file" @change="handleFileUpload" required />
						</div>
						<!-- <button
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-start-2 col-span-2 mt-2 shadow-md shadow-zinc-600"
							@click="createTrack">Upload your track</button> -->
						<button
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-start-2 col-span-2 shadow-md shadow-zinc-600"
							@click="createTrack">Create project</button>
					</div>
				</div>
			</div>
		</div>
	</Container>
</template>

<script setup>
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import Container from '@/components/Container.vue'
import Autocomplete from '@/components/Autocomplete.vue'
import ParamButton from '@/components/buttons/ParamButton.vue'
import { ref, reactive, computed } from 'vue'
import { fetchTracks, fetchMyTracks } from '@/helpers/requests.js'
import { useRouter } from 'vue-router';
import { useSessionStore } from '@/stores/modules/sessionStore';

const trackTitle = ref('')
const instruments = ref([])
const genres = ref([])
const router = useRouter()
const store = useSessionStore();
const audioFile = ref(null);
const { t } = useI18n()

const newProjectParams = reactive([
	{ name: 'Music style', value: '12' },
	{ name: 'Instrument needed', value: '300+' },
	{ name: 'Location', value: '300+' }
])

const filterHeaders = computed(() => {
 return [t('filters.musicStyle'), t('filters.instrument'), t('filters.location')]
})

const handleFileUpload = (event) => {
	audioFile.value = event.target.files[0];
}

const createTrack = async () => {
	const formData = new FormData();
	formData.append('music_track[title]', trackTitle.value);

	selectNamesOrIds(instruments.value, 'id').forEach(id => {
		formData.append('music_track[instrument_ids][]', id);
	});

	// Append each genre ID individually
	selectNamesOrIds(genres.value, 'id').forEach(id => {
		formData.append('music_track[genre_ids][]', id);
	});

	formData.append('music_track[audio_file]', audioFile.value);
	try {
		const response = await axios.post('/tracks', formData, {
			headers: {
				Authorization: `${store.getAuthToken}`,
				'Content-Type': 'multipart/form-data'
			}
		});

		await Promise.all([
			fetchTracks('/tracks'),
			fetchMyTracks()
		])

		router.push('/')
		console.log('New track created:', response.data);
	} catch (error) {
		console.error('Error creating track:', error);
	}
}

const createResource = async (endpoint, value, itemsProp) => {

	try {
		const response = await axios.post(`/${endpoint}`, { [endpoint.slice(0, -1)]: { name: value } },
			{
				headers: {
					Authorization: `${store.getAuthToken}`
				}
			}
		);
		const newResourse = { id: response.data.id, name: response.data.name }
		itemsProp.value.push(newResourse)
	} catch (error) {
		console.error(`Error creating ${endpoint}:`, error);
	}
}

const addNewOption = async (obj) => {
	if (obj.from === 'Instrument needed') {
		await createResource('instruments', obj.newOption, instruments);
	} else {
		await createResource('genres', obj.newOption, genres);

	}
}

const addParameters = (obj) => {
	if (obj.name !== '') {
		switch (obj.header) {
			case 'Instrument needed':
				if (!selectNamesOrIds(instruments.value, 'name').includes(obj.name))
					instruments.value.push(obj)
				console.log('instru ids', selectNamesOrIds(instruments.value, 'id'))
				break;
			case 'Music style':
				if (!selectNamesOrIds(genres.value, 'name').includes(obj.name))
					genres.value.push(obj)
				console.log('genres ids', selectNamesOrIds(genres.value, 'id'))
				break;
			default:
				console.log('default !!!!!!');
		}
	}
}

const onNewItemInput = (obj) => {
	trackTitle.value = obj.name
}

const removeParameters = (additionalParameter, itemToRemove) => {
	switch (additionalParameter) {
		case 'Instrument needed':
			const instrumentIndex = instruments.value.findIndex(obj => obj.name === itemToRemove.name);
			if (instrumentIndex !== -1) {
				instruments.value.splice(instrumentIndex, 1);
			}
			break;
		case 'Music style':
			const genreIndex = genres.value.findIndex(obj => obj.name === itemToRemove.name);
			if (genreIndex !== -1) {
				genres.value.splice(genreIndex, 1);
			}
			break;
		default:
			console.log('default !!!!!!');
	}
}

const selectNamesOrIds = (array, names_or_ids) => {
	const arrayOfNames = names_or_ids === 'name' ? array.map(item => item.name) : array.map(item => item.id)
	return arrayOfNames
}
</script>