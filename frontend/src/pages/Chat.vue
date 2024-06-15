<template>
	<div class="flex h-full">
		<!-- eslint-disable-next-line max-len -->
		<div class="w-1/6 bg-orange-700 flex flex-col">
			<div class="grow overflow-hidden p-2">
				<nav class="flex flex-col items-start">
					<!-- eslint-disable-next-line max-len -->
					<button v-for="chatroom in chatroomList" :key="chatroom.id" @click="moveToChatroom(chatroom.id)"
						class="underline text-white">
						<!-- <span># </span><span v-if="!chatroom.isAboutTrack">Conversation with </span><span>{{ chatroom.name }}</span> -->
					#	{{ conversationTitle(chatroom) }}
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

const moveToChatroom = async id => {
	await chatroomStore.updateChatroomId(id)
	refreshKey.value ++
}

onMounted(async () => {
	await chatroomStore.chatroomsIndex()
	chatroomList.value = chatroomStore.getChatrooms
	await chatroomStore.updateChatroomId(chatroomList.value[0].id)
})

const conversationTitle = (chatroom) => {
	if (chatroom.isAboutTrack) { return chatroom.name }
	else if (chatroom.name !== 'Welcome to Collaborasound') { return `Chat with ${chatroom.name}` }
	else return chatroom.name
}
</script>
