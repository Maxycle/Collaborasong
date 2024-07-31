<template>
	<div class="flex flex-col h-screen text-orange-900 font-serif">
		<div class="sticky top-0 z-10">
			<Hero />
			<ul class="">
      <li v-for="(notification, index) in notifications" :key="index">
        {{ notification.message }}
      </li>
    </ul>
		</div>
		<div class="grow overflow-hidden">
			<router-view></router-view>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import Hero from './components/Hero.vue';
import { createConsumer } from "@rails/actioncable"
import { useSessionStore } from "@/stores/modules/sessionStore"

const sessionStore = useSessionStore()
const actionCableConsumer = createConsumer("ws://localhost:3000/cable")
const notifications = ref([])
let channel

onMounted(async () => {
	if (sessionStore.getUserId) {
		subscribeToNotifications()
	}
})

const subscribeToNotifications = () => {
	const userId = sessionStore.getUserId
	channel = actionCableConsumer.subscriptions.create(
		{ channel: "NotificationsChannel", user_id: userId },
		{
			received(data) {
				console.log('Received data:', data)
				notifications.value.push(data)
				// notifications.value = [...notifications.value, data]
			},
			connected() {
				console.log('Connected to NotificationsChannel')
			},
			disconnected() {
				console.log('Disconnected from NotificationsChannel')
			}
		}
	)
	console.log('WebSocket connection from main:', actionCableConsumer)
}

onBeforeUnmount(() => channel.unsubscribe())
</script>
