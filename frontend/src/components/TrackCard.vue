<template>
	<div class="relative isolate w-full hover:font-sans hover:text-black hover:scale-110 transition duration-300">
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
						{{ t('trackCard.badge.collabo', trackData.children.length) }}
					</router-link>
				</div>
			</div>
		</div>
		<div v-if="showMyCollaborationBadge" class="absolute top-2 right-2 bg-anarcapYellow rounded">
			<div class="border-b-4 border-anarcapYellow bg-anarcapYellow rounded-xl">
				<div class="bg-green-500 p-1 border border-black shadow-md shadow-black rounded">{{
					t('trackCard.badge.myCollabo')
				}}</div>
			</div>
		</div>
		<div class="p-4 rounded-2xl shadow-lg shadow-zinc-600">
			<div class="flex justify-center pb-2">
				<div class="border-b-4 border-anarcapYellow bg-anarcapYellow rounded-xl">
					<div class="max-w-fit rounded-xl bg-lime-100 border border-black p-2 shadow-md shadow-black">
						<p v-if="!isTrackPage && trackData" class="font-bold text-2xl flex justify-center">{{ trackData.title }}</p>
						<div v-if="trackData && trackData.author && !isMyOwnTracksPage" class="text-lg">{{ headers.origin }} <span
								class="font-bold">{{ trackData.author.username }}</span></div>
					</div>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<div v-if="trackData && trackData.genres"
					:class="{ 'invisible': !trackData.genres || !trackData.genres.length }">
					<p class="text-center mx-2 font-bold">{{ t('trackCard.headers.style', trackData.genres.length) }}</p>
					<div v-for="genre in trackData.genres" :key="genre.name">
						<ParamButton :item="genre" color='blue' class="rounded-full shadow-md shadow-black" />
					</div>
				</div>
				<div v-if="audioFileUrl" class="button-audio">
					<audio controls :src="audioFileUrl" class="rounded-full bg-lime-100"></audio>
				</div>
				<div v-else class="button-trackcard">
					{{ t('trackCard.button.noTrack') }}</div>
				<button v-if="trackData && !trackData.isResult" class="button-trackcard">
					<router-link :to="{ name: 'track', params: { zeTrackId: trackId } }" @click="sendTrackDetailsToPinia">{{
						isMyTrack ? t('trackCard.button.collaborateToMyOwnTrack') : t('trackCard.button.collaborate')
					}}</router-link>
				</button>
				<button v-else-if="trackData && showSeeConversationButton" class="button-trackcard" @click="goToConversation">
					{{ t('trackCard.button.conversation') }}
				</button>
				<div v-if="trackData">
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
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from "vue-router"
import { useTrackStore } from '@/stores/modules/tracks';
import { useSessionStore } from '@/stores/modules/sessionStore';
import { useChatroomStore } from '@/stores/modules/chatroomStore';
import ParamButton from './buttons/ParamButton.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
	},
	isMyTracks: {
		type: Boolean,
		default: false
	},
	isResult: {
		type: Boolean,
		default: false
	}
});

const storeTrack = useTrackStore();
const storeSession = useSessionStore()
const storeChatroom = useChatroomStore()
const trackData = ref({});
const authorId = ref()
const audioFileUrl = ref('')

const isTrackPage = computed(() => route.path === `/track/${props.parentTrackId}`);
const isMyOwnTracksPage = computed(() => route.path === '/my_own_tracks');
const showCollaborationBadge = computed(() => { if (trackData.value) return trackData.value.children && trackData.value.children.length > 0 });
const showMyCollaborationBadge = computed(() => { if (trackData.value) return trackData.value.isResult && !isTrackPage.value });
const isMyProject = computed(() => storeSession.getUserId === trackData.value.parent_track_user_id);
const isMyTrack = computed(() => storeSession.getUserId === authorId.value);
const showSeeConversationButton = computed(() => isMyProject.value || isMyTrack.value)
const writeTo = computed(() => { return trackData.value && trackData.value.author ? `${t('trackCard.toolTip')} ${trackData.value.author.username}` : '' })
const trackImageUrl = ref('/img/Flag_of_Anarcho-capitalism.png');

const headers = computed(() => {
	return trackData.value && trackData.value.isResult && trackData.value.instruments
		? {
			instruments: t('trackCard.headers.instrumentsAdded.list', trackData.value.instruments.length),
			origin: t('trackCard.headers.instrumentsAdded.title', trackData.value.instruments.length)
		}
		: trackData.value && trackData.value.instruments
			? {
				instruments: t('trackCard.headers.instrumentsNeeded.list', trackData.value.instruments.length),
				origin: t('trackCard.headers.instrumentsNeeded.title', trackData.value.instruments.length)
			}
			: {
				instruments: '',
				origin: ''
			};
});


const sendTrackDetailsToPinia = () => {
	storeTrack.setTrackBasicData(trackData.value);
};

const goToConversation = async () => {
	await storeChatroom.chatroomsIndex()
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
	if (storeSession.getUserId) {
		await storeChatroom.chatroomsIndex()
		const chatrooms = storeChatroom.getChatrooms
		const chatroomWithAuthor = chatrooms.filter(chatroom => chatroom.protagonists_ids.includes(authorId.value) && !chatroom.isAboutTrack);

		if (!chatroomWithAuthor.length) {
			await storeChatroom.createChatroom("noTrackId", trackData.value.title, [storeSession.getUserId, authorId.value]);
		} else await storeChatroom.updateChatroomId(chatroomWithAuthor[0].id)

		router.push({
			name: "Conversation",
			params: {
				songTitle: `conversation with ${trackData.value.author.username}`
			}
		})
	}
}

watch(
	() => storeTrack.resultTracks,
	async (newResultTracks) => {
		if (await newResultTracks && newResultTracks.length > 0 && props.isResult) {
			console.log('results watcher resultTracks', storeTrack.resultTracks, 'results watcher newResultTracks', newResultTracks, 'trackID =>', props.trackId)
			const foundTrack = newResultTracks.find(track => track.id === props.trackId);
			if (foundTrack) {
				trackData.value = foundTrack;
				authorId.value = trackData.value.author?.id;
			} else {
				console.log(`Track with id ${props.trackId} not found in newResultTracks`);
			}
		}
	},
	{ immediate: true, deep: true }
)

watch(
	() => storeTrack.filteredTracks,
	(newFilteredTracks) => {
		if (newFilteredTracks && newFilteredTracks.length > 0 && !props.isMyTracks) {
			trackData.value = newFilteredTracks.find(track => track.id === props.trackId);
			if (trackData.value) {
				authorId.value = trackData.value.author?.id;
			}
		}
	},
	{ immediate: true }
)

watch(
	() => storeTrack.myTracks,
	(myNewTracks) => {
		if (myNewTracks && myNewTracks.length > 0 && props.isMyTracks) {
			trackData.value = myNewTracks.find(track => track.id === props.trackId);
			if (trackData.value) {
				authorId.value = trackData.value.author?.id;
			}
		}
	},
	{ immediate: true }
);
</script>