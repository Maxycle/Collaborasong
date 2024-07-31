import { defineStore } from "pinia";
import { useSessionStore } from "./sessionStore";

const BACKEND_URL = "http://localhost:3000";

export const useChatroomStore = defineStore({
	id: 'chatroomStore',
	state: () => ({
		chatrooms: [],
		chatroom: {
			id: null,
			messages: [],
			chatterID: undefined,
			chatterUsername: '',
			name: '',
			isAboutTrack: undefined
		},
		uzers: []
	}),

	getters: {
		getChatrooms() {
			return this.chatrooms;
		},

		getChatroom() {
			return this.chatroom;
		},

		getChatroomId() {
			return this.chatroom.id;
		},

		getMessages() {
			return this.chatroom.messages;
		},

		getUzers() {
			return this.uzers;
		}
	},

	actions: {
		async chatroomsIndex() {
			const res = await fetch(`${BACKEND_URL}/chatrooms`, {
				headers: { Authorization: localStorage.getItem("authToken") }
			});

			if (!res.ok) {
				console.error('Failed to fetch chatrooms');
				return;
			}

			const response = await res.json();
			const data = response.chatrooms;
			this.uzers = response.uzers;

			if (data && data.length > 0) {
				this.chatrooms = data;
				this.updateChatroomId(this.chatrooms[0].id);
			} else {
				const sessionStore = useSessionStore();
				console.log('sessionStore.getUserId', sessionStore.getUserId)
				await this.createChatroom('noTrackId', 'Welcome to Collaborasound', [sessionStore.getUserId, sessionStore.getUserId]);
			}
		},

		setChatroomDetails(id) {
			const sessionStore = useSessionStore();
			const userId = sessionStore.getUserId;

			const chatroom = this.chatrooms.find(chatroom => chatroom.id === id);
			if (!chatroom) {
				console.error('Chatroom not found');
				return;
			}

			const chatterID = chatroom.protagonists_ids.find(id => id !== userId);
			this.chatroom.chatterID = chatterID;

			const chatterUser = this.uzers.find(user => user.id === chatterID);
			if (chatterUser) {
				this.chatroom.chatterUsername = chatterUser.username;
			}
			this.chatroom.isAboutTrack = chatroom.isAboutTrack
			this.chatroom.name = chatroom.name
		},

		async updateChatroomId(id) {
			this.chatroom.id = id;
			this.setChatroomDetails(id);
			await this.messagesIndex();
		},

		async messagesIndex() {
			const res = await fetch(`${BACKEND_URL}/chatrooms/${this.getChatroomId}/messages`, {
				headers: { Authorization: localStorage.getItem("authToken") }
			});

			if (!res.ok) {
				console.error('Failed to fetch messages');
				return;
			}

			const data = await res.json();
			this.chatroom.messages = data;
		},

		async messagesCreate(messageBody) {
			await fetch(`${BACKEND_URL}/chatrooms/${this.getChatroomId}/messages`, {
				method: "POST",
				headers: { Authorization: localStorage.getItem("authToken"), "Content-Type": "application/json" },
				body: JSON.stringify({ message: { content: messageBody } })
			});
			await this.messagesIndex();
		},

		addMessage(data) {
			this.chatroom.messages.push(data);
		},

		async createChatroom(trackId, songTitle, protagonistsIds) {
			const isTrackChat = trackId !== 'noTrackId';
			try {
				// Create the chatroom
				const response = await fetch(`${BACKEND_URL}/chatrooms`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': localStorage.getItem("authToken")
					},
					body: JSON.stringify({ chatroom: { name: songTitle, protagonists_ids: protagonistsIds, isAboutTrack: isTrackChat } }),
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const data = await response.json();
				this.chatrooms.push(data);

				// Update the track with the new chat_id
				if (isTrackChat) {
					const updateResponse = await fetch(`${BACKEND_URL}/tracks/${trackId}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.getItem("authToken")
						},
						body: JSON.stringify({ music_track: { chat_id: data.id } }),
					});

					if (!updateResponse.ok) {
						throw new Error('Failed to update track with chat_id');
					}

					const updatedTrack = await updateResponse.json();
					await this.updateChatroomId(data.id);
					return updatedTrack;
				}
				await this.updateChatroomId(data.id);
				return data; // Return the chatroom data if no track update is needed

			} catch (error) {
				console.error('Failed to create chatroom or update track:', error);
				throw error; // Re-throw the error if you want to handle it further up the call stack
			}
		}
	}
});
