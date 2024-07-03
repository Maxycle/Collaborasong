import { createRouter, createWebHistory } from 'vue-router'
import LoginSignup from "@/pages/LoginSignup.vue"
import Home from '@/pages/Home.vue'
import NewProject from '@/pages/NewProject.vue'
import NewResultTrack from '@/pages/NewResultTrack.vue'
import Track from '@/pages/Track.vue'
import MyTracks from '@/pages/MyTracks.vue'
import { useSessionStore } from '@/stores/modules/sessionStore'
import Chat from '@/pages/Chat.vue'
import Conversation from '@/pages/Conversation.vue'

const routes = [
	{ path: '/login_signup', name: 'LoginSignup', component: LoginSignup, meta: { requiresAuth: false } },
	{ path: '/', name: 'Home', component: Home, meta: { requiresAuth: false } },
	{ path: '/track/:zeTrackId', name: 'track', component: Track, meta: { requiresAuth: true } },
	{ path: '/new_project', name: 'result_track', component: NewProject, meta: { requiresAuth: true } },
	{ path: '/new_result/:zeTrackId', name: 'new_result_track', component: NewResultTrack, meta: { requiresAuth: true } },
	{ path: "/chat", name: "Chat", component: Chat, meta: { requiresAuth: true } },
	{ path: "/conversation/:songTitle", name: "Conversation", component: Conversation, meta: { requiresAuth: true } },
	{ path: '/my_own_tracks', name: 'my_tracks', component: MyTracks, meta: { requiresAuth: false } }
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to, from, next) => {
	const store = useSessionStore();

	const isAuthenticated = store.getAuthToken !== null/* Check if user is authenticated (e.g., token exists) */;

	if (to.meta.requiresAuth && !isAuthenticated) {
		// Redirect to login page if authentication is required and user is not authenticated
		next('/login_signup');
	} else {
		// Continue to requested route
		next();
	}
})

export default router

