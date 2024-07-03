<template>
	<div class="flex h-full">
		<!-- eslint-disable-next-line max-len -->
		<div class="w-1/6 bg-gradient-to-r from-neutral-400 to-neutral-300 flex flex-col hover:bg-color-gradient transition duration-300">
			<div class="grow overflow-hidden p-2 hover:text-orange-700 transition duration-300">
				<nav class="flex flex-col items-start">
					<!-- eslint-disable-next-line max-len -->
					<button v-for="chatroom in chatroomList" :key="chatroom.id" @click="moveToChatroom(chatroom.id)"
						class="underline hover:text-blue-700" :class="{ 'text-blue-700': chatroomSelected === chatroom.id }">
						<span v-if="chatroom.isAboutTrack">
							<FontAwesomeIcon icon="fa-solid fa-music" class="pr-2" />
						</span>{{ conversationTitle(chatroom) }}
					</button>
				</nav>
			</div>
		</div>
		<Conversation class="w-full" :key="refreshKey" />
	</div>
</template>

<script setup>

import { useChatroomStore } from "@/stores/modules/chatroomStore"
import { ref, onMounted } from "vue"
import Conversation from "@/pages/Conversation.vue"

const chatroomStore = useChatroomStore()
const chatroomList = ref([])
const refreshKey = ref(0)
const chatroomSelected = ref(undefined)

const moveToChatroom = async id => {
	chatroomSelected.value = id
	await chatroomStore.updateChatroomId(id)
	refreshKey.value++
}

onMounted(async () => {
	await chatroomStore.chatroomsIndex()
	chatroomList.value = chatroomStore.getChatrooms
	chatroomSelected.value = chatroomList.value[0].id
	await chatroomStore.updateChatroomId(chatroomList.value[0].id)
})

const conversationTitle = (chatroom) => {
	if (chatroom.isAboutTrack) { return chatroom.name }
	else if (chatroom.name !== 'Welcome to Collaborasound') { return `Chat with ${chatroom.name}` }
	else return chatroom.name
}
</script>
