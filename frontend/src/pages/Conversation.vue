<template>
	<div class="flex h-full">
		<div v-if="chatroomStore.getChatroom.isAboutTrack"
			class="flex bg-gradient-to-l from-neutral-400 to-neutral-300 w-1/5 justify-center pt-4">
			<div
				class="flex flex-col items-center border-4 rounded-xl border-gray-500 bg-orange-700 text-white h-fit p-2 shadow-md shadow-black">
				<div>Talk to <span class="font-bold italic">{{ chatroomStore.getChatroom.chatterUsername }} </span></div>
				<p>about...</p>
				<div class="font-bold">{{ chatroomStore.getChatroom.name }} !!</div>
			</div>
		</div>
		<div class="bg-gradient-to-r from-neutral-400 to-neutral-300 grow flex flex-col py-4">
			<div ref="messagesElement" class="grow overflow-y-auto">
				<!-- eslint-disable-next-line max-len -->
				<Message v-for="(message, index) in chatroomStore.getMessages" :key="message.id" :message="message"
					:last-message="(index === 0) ? null : chatroomStore.getMessages[index - 1]" class="px-4" />
			</div>
			<form @submit.prevent="messagesCreate" class="sticky bottom-2 px-4 flex flex-col">
				<div class="relative w-full">
					<textarea v-model="newMessage" rows="1" @keyup.enter.exact.prevent="messagesCreate"
						class="w-full border border-green-700 bg-black text-white rounded pr-12 pb-12"></textarea>
					<button type="submit" class="absolute bottom-2 right-2 bg-orange-700 px-3 py-2 rounded text-white">
						<FontAwesomeIcon icon="fa-solid fa-paper-plane" class="send" />
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount, onMounted, computed } from "vue"
import { createConsumer } from "@rails/actioncable"

import { useChatroomStore } from "@/stores/modules/chatroomStore"
import Message from "@/components/Message.vue"

const chatroomStore = useChatroomStore()
const actionCableConsumer = createConsumer("ws://localhost:3000/cable")
let channel

const messagesElement = ref(null)
const newMessage = ref("")

const scrollDown = () => {
	nextTick(() => {
		if (messagesElement.value.lastElementChild) { messagesElement.value.lastElementChild.scrollIntoView() }
	})
}

const addMessage = data => {
	chatroomStore.addMessage(data)
	scrollDown()
}

const subscribeToChannel = () => {
	channel = actionCableConsumer.subscriptions.create(
		{ channel: "ChatroomChannel", id: chatroomStore.getChatroomId },
		{ received: data => addMessage(data) }
	)
}

const messagesCreate = async () => {
	await chatroomStore.messagesCreate(newMessage.value)
	newMessage.value = ""
}

onMounted(() => {
	scrollDown()
	subscribeToChannel()
})

onBeforeUnmount(() => channel.unsubscribe())
</script>
