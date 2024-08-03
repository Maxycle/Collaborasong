<template>
	<div class="flex flex-col h-screen text-orange-900 font-serif">
		<div class="sticky top-0 z-10">
			<Hero />
			<ul class="">
			</ul>
		</div>
		<div class="grow overflow-hidden">
			<router-view></router-view>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, watchEffect } from "vue"
import Hero from './components/Hero.vue'
import { createConsumer } from "@rails/actioncable"
import { useSessionStore } from "@/stores/modules/sessionStore"
import { useChatroomStore } from "@/stores/modules/chatroomStore"

const sessionStore = useSessionStore()
const chatroomStore = useChatroomStore()
const actionCableConsumer = createConsumer("ws://localhost:3000/cable")
const notifications = ref([])

let channel

const subscribeToNotifications = () => {
	const userId = sessionStore.getUserId
	channel = actionCableConsumer.subscriptions.create(
		{ channel: "NotificationsChannel", user_id: userId },
		{
			async received(data) {
				const hasUnread = await chatroomStore.hasUnreadMessage(data.chatroom_id)
				console.log('unRead ??', hasUnread)
				if (hasUnread) {
					// unreadChatrooms.value.push(data.chatroom_id)
					chatroomStore.addUnreadChatroom(data.chatroom_id)
				}
			},
			connected() {
				console.log('Connected to NotificationsChannel')
			},
			disconnected() {
				console.log('Disconnected from NotificationsChannel')
			}
		}
	)
}

onMounted(async () => {
	await chatroomStore.chatroomsIndex();

	watch(
		() => sessionStore.getUserId,
		async (newUserId) => {
			if (newUserId) {
				subscribeToNotifications()
				await chatroomStore.chatroomsIndex()
				await chatroomStore.setUnreadChatrooms()
			}
		}
	)

	watch(
		() => chatroomStore.getChatrooms,
		async (newChatrrooms) => {
			await chatroomStore.setUnreadChatrooms()
		},
		{ immediate: true }
	)
})



onBeforeUnmount(() => channel.unsubscribe())

watchEffect(() => {
	console.log('chatroomStore.getChatrooms value:', chatroomStore.getChatrooms)
})
</script>
