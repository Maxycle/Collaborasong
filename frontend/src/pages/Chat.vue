<template>
	<div class="flex h-full">
		<!-- eslint-disable-next-line max-len -->
		<div
			class="w-1/6 bg-gradient-to-l from-neutral-400 to-neutral-300 flex flex-col hover:bg-color-gradient transition duration-300">
			<div class="grow overflow-hidden p-2 hover:text-orange-700 transition duration-300">
				<nav class="flex flex-col items-start">
					<!-- eslint-disable-next-line max-len -->
					<button v-for="chatroom in chatroomList" :key="chatroom.id" @click="moveToChatroom(chatroom.id)"
						class="underline hover:text-blue-700 relative"
						:class="{ 'text-blue-700': chatroomSelected === chatroom.id }">
						<span v-if="chatroom.isAboutTrack">
							<FontAwesomeIcon icon="fa-solid fa-music" class="pr-2" />
						</span>{{ conversationTitle(chatroom) }}
						<FontAwesomeIcon v-if="hasUnreadMessages(chatroom.id)" icon="fa-solid fa-envelope" class="pl-2" />
					</button>

				</nav>
			</div>
		</div>
		<transition mode="out-in" name="fade-to-black" @before-leave="showOverlay" @after-leave="hideOverlay"
			@before-enter="showOverlay" @after-enter="hideOverlay">
			<Conversation class="w-full" :key="refreshKey" />
		</transition>
		<transition name="fade-overlay">
			<div v-if="overlayVisible" class="overlay"></div>
		</transition>
	</div>
</template>

<script setup>

import { useChatroomStore } from "@/stores/modules/chatroomStore"
import { useSessionStore } from "@/stores/modules/sessionStore"

import { ref, onMounted } from "vue"
import Conversation from "@/pages/Conversation.vue"

const chatroomStore = useChatroomStore()
const sessionStore = useSessionStore()
const chatroomList = ref([])
const refreshKey = ref(0)
const chatroomSelected = ref(undefined)
const overlayVisible = ref(false)

const moveToChatroom = async id => {
	chatroomSelected.value = id
	await chatroomStore.updateChatroomId(id)
	refreshKey.value++
}

onMounted(async () => {
	await chatroomStore.chatroomsIndex()
	chatroomList.value = chatroomStore.getChatrooms
	chatroomSelected.value = chatroomList.value[0].id
	await chatroomStore.updateChatroomId(chatroomSelected.value)
	refreshKey.value++
})

const conversationTitle = (chatroom) => {
	if (chatroom.isAboutTrack) { return chatroom.name }
	else if (chatroom.name !== 'Welcome to Collaborasound') { return `Chat with ${chatter(chatroom.protagonists_ids).username}` }
	else return chatroom.name
}

const hasUnreadMessages = (chatroomId) => {
	return chatroomStore.getUnreadChatrooms.includes(chatroomId)
}

const chatter = (protagonistsIds) => {
	const chatterId = protagonistsIds.find(id => id !== sessionStore.getUserId)
	return chatroomStore.getUzers.find(user => user.id === chatterId);
}

const showOverlay = () => {
	overlayVisible.value = true;
}

const hideOverlay = () => {
	overlayVisible.value = false;
}
</script>
