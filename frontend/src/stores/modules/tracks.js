import { defineStore } from 'pinia';
import axios from 'axios';
import { useSessionStore } from '@/stores/modules/sessionStore';

axios.defaults.baseURL = 'http://localhost:3000'

export const useTrackStore = defineStore({
	id: 'tracks',
	state: () => ({
		trackListIdsInStore: [],
		myTrackListIdsInStore: [],
		trackBasicDataInStore: {},
		loading: false
	}),

	actions: {
		async searchTracks(urlToFetch) {
			const storeSession = useSessionStore();

			try {
				this.loading = true
				const response = await axios.get(urlToFetch,
					{
						headers: {
							Authorization: `${storeSession.getAuthToken}`
						}
					});
				const data = response.data;
				if (urlToFetch === '/my_tracks') {
					this.myTrackListIdsInStore = data; // Directly mutating state
				} else {
					this.trackListIdsInStore = data; // Directly mutating state
				}
				this.loading = false
				console.log('Fetched tracks pinia:', data);
				return data;
			} catch (error) {
				console.error('Error fetching tracks in store:', error);
				throw error;
			}
		},

		setTrackBasicData(data) {
			this.trackBasicDataInStore = data; // Directly mutating state
		}
	},

	getters: {
		trackListIds: (state) => state.trackListIdsInStore,
		trackBasicData: (state) => state.trackBasicDataInStore,
		myTrackListIds: (state) => state.myTrackListIdsInStore,
		loadingData: (state) => state.loading
	}
});
