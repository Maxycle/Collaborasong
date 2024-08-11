<template>
	<div
		class="flex justify-between px-4 items-center bg-gradient-to-r from-neutral-400 to-neutral-300 shadow-md shadow-gray-700">
		<div>{{ $t('home.logIn.welcome') }} {{ loggedInUser.username }} you muzzafucka !!</div>
		<div class="flex justify-end space-x-2">
			<NavBarButton :isActive="isRouteActive('/')">
				<span class="relative"><router-link to="/">{{ t('navbar.home') }}</router-link></span>
			</NavBarButton>
			<NavBarButton :isActive="isRouteActive('/my_own_tracks')">
				<span class="relative"><router-link to="/my_own_tracks">{{ t('navbar.myTracks') }}</router-link></span>
			</NavBarButton>
			<NavBarButton :isActive="isRouteActive('/chat')" class="relative">
				<span class="relative"><router-link to="/chat">{{ t('navbar.messages') }}</router-link></span>
				<FontAwesomeIcon v-if="chatroomStore.getUnreadChatrooms.length" icon="fa-solid fa-envelope"
					class="text-orange-900 absolute right-2 bottom-0" />
			</NavBarButton>
			<NavBarButton @click="redirectToEditProfile">
				<span class="relative">{{ t('navbar.profileEdit') }}</span>
			</NavBarButton>
			<!-- <NavBarButton> -->
			<LangSwitch class=""></LangSwitch>
			<!-- </NavBarButton> -->
			<NavBarButton @click="logout">
				<span class="relative">{{ t('navbar.logout') }}</span>
			</NavBarButton>
		</div>
	</div>
</template>

<script setup>
import axios from 'axios'
import NavBarButton from './buttons/NavBarButton.vue'
import LangSwitch from './LangSwitch.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useSessionStore } from '@/stores/modules/sessionStore'
import { useChatroomStore } from "@/stores/modules/chatroomStore"
import { useI18n } from 'vue-i18n'

const store = useSessionStore()
const router = useRouter()
const route = useRoute()
const chatroomStore = useChatroomStore()
const { t } = useI18n()

axios.defaults.baseURL = 'http://localhost:3000'

const loggedInUser = computed(() => {
	return store.user;
})

const isRouteActive = (path) => {
	return route.path === path;
};

const logout = async () => {
	try {
		await store.logoutUser()
		router.push('/')
	} catch (error) {
		console.error('Error logging out', error);
	}
};

const redirectToEditProfile = () => {
	window.location.href = '/users/edit';
}
</script>