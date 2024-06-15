<template>
	<div class="relative isolate sm:py-4">
		<div class="absolute top-4 left-4 font-bold text-xl pl-6">Collaborasound<span class="font-thin">.org</span></div>
		<img src="/img/Flag_of_Anarcho-capitalism.png" alt="anarcap flag"
			class="absolute inset-0 -z-10 h-full w-full object-fill md:object-center " />
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none border-4 border-stone-500 rounded-xl shadow-md shadow-stone-500">
				<!-- <div class="bg-gradient-to-b from-stone-500 to-stone-300 p-1 rounded-xl"> -->
					<!-- <dl class="grid grid-cols-4 gap-2 p-4 rounded-xl bg-gradient-to-t from-anarcapYellow to-black"> -->
						<dl class="grid grid-cols-4 gap-2 p-4 rounded-xl">
						<div v-for="label in searchParams" class="font-extrabold p-1 rounded">{{
							label.name
						}}</div>
						<div></div>
						<div v-for="param in searchParams" :key="param.name" class="">
							<Autocomplete :heading="param.name" @item-selected="addQueryParamToUrl"
								class="shadow-lg shadow-zinc-600" />
						</div>
						<button
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg shadow-zinc-600"
							@click="fetch">Look
							for a project</button>
						<button
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-start-2 col-span-2 mt-4 shadow-lg shadow-zinc-600"><router-link
								to="/new_project" class="">Start a new collaboration</router-link></button>
					</dl>
				<!-- </div> -->
			</div>
		</div>
	</div>
	<NavBar v-show="store.isLoggedIn" />
</template>

<script setup>
import Autocomplete from './Autocomplete.vue';
import { ref, onMounted } from 'vue';
import { fetchTracks } from '../helpers/requests.js';
import { useSessionStore } from '@/stores/modules/sessionStore';
import { useRouter } from 'vue-router';
import NavBar from './NavBar.vue'

const searchParams = [
	{ name: 'Genre de zikmu', value: '12' },
	{ name: 'Instrument recherchié', value: '300+' },
	{ name: 'Où ca ??', value: '40' },
];

let urlToFetch = ref('/tracks');
let instrumentParam = ref('')
let genreParam = ref('')
let locationParam = ref('')
const router = useRouter()
const store = useSessionStore()

onMounted(() => {
	fetchTracks(urlToFetch.value);
});

const fetch = () => {
	fetchTracks(urlToFetch.value)
	router.push('/')
};

const addQueryParamToUrl = (obj) => {
	switch (obj.header) {
		case 'Instrument recherchié':
			instrumentParam.value = obj.name
			break;
		case 'Genre de zikmu':
			genreParam.value = obj.name
			break;
		case 'Où ca ??':
			locationParam.value = obj.coordinates
			break;
		default:
			urlToFetch.value = '/tracks';
	}
	urlToFetch.value = `/tracks?instrument=${instrumentParam.value}&genre=${genreParam.value}&location=${locationParam.value}`
};
</script>
