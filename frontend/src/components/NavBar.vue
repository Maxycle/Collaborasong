<template>
	<div class="flex justify-between px-4 items-center bg-gradient-to-r from-neutral-400 to-neutral-300 shadow-md shadow-gray-700">
		<div>{{ $t('home.logIn.welcome') }} {{ loggedInUser.username }} you muzzafucka !!</div>
		<div class="flex justify-end space-x-2">
			<NavBarButton :isActive="isRouteActive('/')">
				<span class="relative"><router-link to="/">Home</router-link></span>
			</NavBarButton>
			<NavBarButton :isActive="isRouteActive('/my_own_tracks')">
				<span class="relative"><router-link to="/my_own_tracks">My tracks</router-link></span>
			</NavBarButton>
			<NavBarButton :isActive="isRouteActive('/chat')">
				<span class="relative"><router-link to="/chat">My messages</router-link></span>
			</NavBarButton>
			<NavBarButton @click="redirectToEditProfile">
				<span class="relative">Edit profile</span>
			</NavBarButton>
			<NavBarButton @click="logout">
				<span class="relative">Logout</span>
			</NavBarButton>
		</div>
	</div>
</template>

<script setup>
import axios from 'axios';
import NavBarButton from './buttons/NavBarButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useSessionStore } from '@/stores/modules/sessionStore';

const store = useSessionStore();
const router = useRouter();
const route = useRoute();
const isLoading = ref(false)

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
};
</script>