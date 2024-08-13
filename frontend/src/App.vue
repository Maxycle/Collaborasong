<template>
	<div class="flex flex-col h-screen text-orange-900 font-serif">
		<div class="sticky top-0 z-10">
			<Hero />
		</div>
		<div class="grow overflow-hidden">
			<router-view v-slot="{ Component }">
				<transition name="fade-to-black" mode="out-in" @before-leave="showOverlay" @after-leave="hideOverlay"
					@before-enter="showOverlay" @after-enter="hideOverlay">
					<component :is="Component" />
				</transition>
			</router-view>
			<transition name="fade-overlay">
				<div v-if="overlayVisible" class="overlay"></div>
			</transition>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue"
import Hero from './components/Hero.vue'
import { createConsumer } from "@rails/actioncable"
import { useSessionStore } from "@/stores/modules/sessionStore"
import { useChatroomStore } from "@/stores/modules/chatroomStore"

const sessionStore = useSessionStore()
const chatroomStore = useChatroomStore()
const actionCableConsumer = createConsumer("ws://localhost:3000/cable")
const overlayVisible = ref(false)
let channel

const subscribeToNotifications = () => {
	const userId = sessionStore.getUserId
	channel = actionCableConsumer.subscriptions.create(
		{ channel: "NotificationsChannel", user_id: userId },
		{
			async received(data) {
				const hasUnread = await chatroomStore.hasUnreadMessage(data.chatroom_id)
				if (hasUnread) {
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
	subscribeToNotifications()
	watch(
		() => sessionStore.getUserId,
		async (newUserId) => {
			if (newUserId) {
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

const showOverlay = () => {
	overlayVisible.value = true;
}

const hideOverlay = () => {
	overlayVisible.value = false;
}

onBeforeUnmount(() => channel.unsubscribe())

</script>
