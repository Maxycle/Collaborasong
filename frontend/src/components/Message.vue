<template>
	<div :class="{ own: message.user_id === sessionStore.getUserId, message: true }">
		<div class="italic">
			<h3 v-if="lastMessage === null || isDifferrentUser">{{ message.username }},</h3>
			<span v-if="lastMessage === null || isDifferrentTime || isDifferrentUser">
				{{ formatDate(message.created_at) }}
			</span>
		</div>

		<p>{{ message.content }}</p>
	</div>
</template>

<script setup>
import { toRef } from "vue"
import { useSessionStore } from "@/stores/modules/sessionStore"

const props = defineProps({
	message: Object,
	lastMessage: Object
})

const sessionStore = useSessionStore()
const message = toRef(props, "message")
const lastMessage = toRef(props, "lastMessage")

const formatDate = date => {
	const formattedDate = new Date(date)
	const dateString = formattedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
	const timeString = formattedDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).replace(" ", "").toLowerCase()

	return `${dateString}, ${timeString}`
}

const isDifferrentUser = lastMessage.value === null || lastMessage.value.username !== message.value.username
const isDifferrentTime = lastMessage.value === null
	|| formatDate(lastMessage.value.created_at) !== formatDate(message.value.created_at)
</script>

<style lang="scss" scoped>
.message {
	font-size: 0.8rem;
	margin: 5px 0;
	width: 100%;

	div {
		align-items: center;
		display: flex;
		gap: 10px;

		span, h3 {
			color: rgb(77, 87, 61);
			font-size: 0.8em;
		}
	}
}

.own {
	text-align: right;

	div {
		justify-content: flex-end;
	}
}
</style>