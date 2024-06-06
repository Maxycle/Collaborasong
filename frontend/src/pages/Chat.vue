<template>
	<div class="flex h-full">
		<!-- eslint-disable-next-line max-len -->
		<div class="w-1/6 bg-orange-700 flex flex-col">
			<div class="grow overflow-hidden p-2">
				<nav>
					<!-- eslint-disable-next-line max-len -->
					<button v-for="chatroom in chatroomList" :key="chatroom.id" @click="moveToChatroom(chatroom.id)"
						class="underline text-white">
						<div v-if="chatroom.protagonists_ids.includes(sessionStore.getUserId)">
							<span># </span><span>{{ chatroom.name }}</span>
						</div>
					</button>
				</nav>
			</div>
		</div>
		<Conversation class="w-full" />
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

const moveToChatroom = async id => {
	await chatroomStore.updateChatroomId(id)
}

onMounted(async () => {
	await chatroomStore.chatroomsIndex()
	await chatroomStore.updateChatroomId(1)
	chatroomList.value = chatroomStore.getChatrooms
})
</script>
