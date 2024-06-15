<template>
	<div class="relative isolate w-full">
		<img :src="trackImageUrl" alt="Track Image"
			class="absolute inset-0 -z-10 h-full w-full object-fill md:object-center rounded-2xl" />
		<div v-if="!isMyOwnTracksPage && !isMyTrack" class="absolute top-4 left-4">
			<div class="flex item-center justify-center">
				<v-tooltip :text="writeTo">
					<template v-slot:activator="{ props }">
						<font-awesome-icon v-bind="props" icon="fa-solid fa-pen-fancy" class="h-8 text-orange-700 cursor-pointer"
							@click="goToConversationWithAuthorOfTrack" />
					</template>
				</v-tooltip>
			</div>
		</div>
		<div v-if="showCollaborationBadge" class="absolute top-2 right-2 bg-anarcapYellow rounded">
			<div class="border-b-4 border-anarcapYellow bg-anarcapYellow rounded-xl">
				<div
					class="bg-orange-300 rounded p-1 border border-black transition shadow-md shadow-black hover:scale-110 duration-300">
					<router-link :to="{ name: 'track', params: { zeTrackId: trackId } }" @click="sendTrackDetailsToPinia">
						has {{ trackData.children.length }} collaborasound<span v-if="trackData.children.length > 1">s</span>
					</router-link>
				</div>
			</div>
		</div>
		<div v-if="showMyCollaborationBadge" class="absolute top-2 right-2 bg-anarcapYellow rounded">
			<div class="border-b-4 border-anarcapYellow bg-anarcapYellow rounded-xl">
				<div class="bg-green-500 p-1 border border-black shadow-md shadow-black rounded">My collaborasound</div>
			</div>
		</div>
		<div class="p-4 rounded-2xl shadow-lg shadow-zinc-600">
			<div class="flex justify-center pb-2">
				<div class="border-b-4 border-anarcapYellow bg-anarcapYellow rounded-xl">
					<div class="max-w-fit rounded-xl bg-lime-100 border border-black p-2 shadow-md shadow-black">
						<p v-if="!isTrackPage" class="font-bold text-2xl flex justify-center">{{ trackData.title }}</p>
						<div v-if="trackData.author && !isMyOwnTracksPage" class="text-lg">{{ headers.origin }} <span
								class="font-bold">{{ trackData.author.username }}</span></div>
					</div>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<div :class="{ 'invisible': !trackData.genres || !trackData.genres.length }">
					<p class="text-center mx-2 font-bold">Music style</p>
					<div v-for="genre in trackData.genres" :key="genre.name" class="">
						<div class="border border-b-anarcapYellow bg-anarcapYellow rounded-full">
							<ParamButton :item="genre" color='blue' class="rounded-full shadow-md shadow-black" />
						</div>
					</div>
				</div>
				<button
					class="shadow-md shadow-black outline outline-blue-400 outline-2 outline-offset-2 bg-lime-100 border border-black transition hover:translate-x-6 hover:scale-110 duration-300 rounded-xl h-10 w-1/4 flex items-center justify-center">listen</button>
				<button v-if="trackData && !trackData.isResult"
					class="outline outline-blue-400 outline-2 outline-offset-2 bg-lime-100 border border-black transition hover:-translate-x-6 hover:scale-110 duration-300 rounded-xl h-10 w-1/4 flex items-center justify-center">
					<router-link :to="{ name: 'track', params: { zeTrackId: trackId } }" @click="sendTrackDetailsToPinia">{{
						isMyOwnTracksPage ? 'Go to my track page' : 'Collaborate' }}</router-link>
				</button>
				<button v-else
					class="outline outline-blue-400 outline-2 outline-offset-2 bg-lime-100 border border-black transition hover:-translate-x-6 hover:scale-110 duration-300 rounded-xl h-10 w-1/4 flex items-center justify-center"
					:class="{ 'hidden': !showSeeConversationButton }" @click="goToConversation">See the conversation</button>
				<div :class="{ 'invisible': !trackData.instruments || !trackData.instruments.length }">
					<p class="text-center text-white font-bold">{{ headers.instruments }}</p>
					<div v-for="instrument in trackData.instruments" :key="instrument.name">
						<div class="border border-black rounded-full">
							<ParamButton :item="instrument" color="blue" border-color="blue" class="rounded-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useRouter } from "vue-router"
import { useTrackStore } from '@/stores/modules/tracks';
import { useSessionStore } from '@/stores/modules/sessionStore';
import { useChatroomStore } from '@/stores/modules/chatroomStore';
import ParamButton from './buttons/ParamButton.vue';

const route = useRoute();
const router = useRouter()
const props = defineProps({
	trackId: {
		type: Number,
		default: undefined
	},
	parentTrackId: {
		type: Number,
		default: undefined
	}
});

const storeTrack = useTrackStore();
const storeSession = useSessionStore()
const storeChatroom = useChatroomStore()
const trackData = ref({});
const instrumentHeader = ref('instrument');
const authorId = ref()

const isTrackPage = computed(() => route.path === `/track/${props.parentTrackId}`);
const isMyOwnTracksPage = computed(() => route.path === '/my_own_tracks');
const showCollaborationBadge = computed(() => trackData.value.children && trackData.value.children.length > 0);
const showMyCollaborationBadge = computed(() => trackData.value.isResult && !isTrackPage.value);
const isMyProject = computed(() => storeSession.getUserId === trackData.value.parent_track_user_id);
const isMyTrack = computed(() => storeSession.getUserId === authorId.value);
const showSeeConversationButton = computed(() => isMyProject.value || isMyTrack.value)
const headers = computed(() => {
	return trackData.value.isResult ? { instruments: `${instrumentHeader.value} added`, origin: 'instrument(s) added by' } : { instruments: `${instrumentHeader.value} needed`, origin: 'from' };
})
const writeTo = computed(() => { return trackData.value.author ? `Write to ${trackData.value.author.username}` : '' })
const trackImageUrl = ref('/img/Flag_of_Anarcho-capitalism.png');

const fetchTrackDetails = async () => {
	try {
		const response = await axios.get(`/tracks/${props.trackId}`);
		trackData.value = response.data;
		authorId.value = trackData.value.author.id
		instrumentHeader.value = trackData.value.instruments.length > 1 ? 'Instruments' : 'Instrument';
	} catch (error) {
		console.error('Error fetching tracks:', error);
	}
};

const sendTrackDetailsToPinia = () => {
	storeTrack.setTrackBasicData(trackData.value);
};

const goToConversation = async () => {
	if (!trackData.value.chat_id) {
		await storeChatroom.createChatroom(props.trackId, trackData.value.title, [trackData.value.parent_track_user_id, authorId.value]);
	} else await storeChatroom.updateChatroomId(trackData.value.chat_id)

	router.push({
		name: "Conversation",
		params: {
			songTitle: trackData.value.title
		}
	})
};

const goToConversationWithAuthorOfTrack = async () => {
	await storeChatroom.chatroomsIndex()
	const chatrooms = storeChatroom.getChatrooms
	const chatroomWithAuthor = chatrooms.filter(chatroom => chatroom.protagonists_ids.includes(authorId.value) && !chatroom.isAboutTrack);

	if (!chatroomWithAuthor.length) {
		await storeChatroom.createChatroom("noTrackId", trackData.value.author.username, [storeSession.getUserId, authorId.value]);
	} else await storeChatroom.updateChatroomId(chatroomWithAuthor[0].id)

	router.push({
		name: "Conversation",
		params: {
			songTitle: `conversation with ${trackData.value.author.username}`
		}
	})
}

onMounted(() => {
	fetchTrackDetails();
})
</script>
