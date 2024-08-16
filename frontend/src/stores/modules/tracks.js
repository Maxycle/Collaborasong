import { defineStore } from 'pinia';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000'

export const useTrackStore = defineStore({
	id: 'tracks',
	state: () => ({
		trackListIdsInStore: [],
		filteredTracksInStore: [],
		myTrackListIdsInStore: [],
		myTrackListInStore: [],
		trackBasicDataInStore: {},
		resultTracksInStore: [],
		mapCenterInStore: []
	}),

	actions: {
		async searchTracks(urlToFetch, authToken) {

			try {
				// this.loading = true
				const response = await axios.get(urlToFetch,
					{
						headers: {
							Authorization: `${authToken}`
						}
					});
				const data = response.data;
				if (urlToFetch === '/my_tracks') {
					this.myTrackListIdsInStore = data; // Directly mutating state
					const tracksData = await Promise.all(
						this.myTrackListIdsInStore.map((item) => this.fetchTrackData(item.id))
					);

					// Update the filteredTracksInStore with the resolved track data
					this.myTrackListInStore = tracksData;
				} else {
					this.trackListIdsInStore = data; // Directly mutating state
					const tracksData = await Promise.all(
						this.trackListIdsInStore.map((item) => this.fetchTrackData(item.id))
					);

					// Update the filteredTracksInStore with the resolved track data
					this.filteredTracksInStore = tracksData;
				}
				// this.loading = false
			} catch (error) {
				console.error('Error fetching tracks in store:', error);
				this.loading = false;
				throw error;
			}
		},

		setTrackBasicData(data) {
			this.trackBasicDataInStore = data; // Directly mutating state
		},

		async setResultTracks(id) {
			// Check if the track already exists in the resultTracksInStore
			const existingTrack = this.resultTracksInStore.find(track => track.id === id);

			if (!existingTrack) {
				// Only fetch and push if the track does not already exist
				const trackData = await this.fetchTrackData(id);
				this.resultTracksInStore.push(trackData);
			} else {
				console.log(`Track with id ${id} already exists in resultTracksInStore.`);
			}
		},
	

		async fetchTrackData(id) {
			try {
				const response = await axios.get(`/tracks/${id}`);
				return response.data;
			} catch (error) {
				console.error('Error fetching tracks in store:', error);
				throw error;
			}
		},

		setMapCenter(coordinates) {
			this.mapCenterInStore = coordinates
		}
	},

	getters: {
		trackListIds: (state) => state.trackListIdsInStore,
		filteredTracks: (state) => state.filteredTracksInStore,
		trackBasicData: (state) => state.trackBasicDataInStore,
		myTrackListIds: (state) => state.myTrackListIdsInStore,
		myTracks: (state) => state.myTrackListInStore,
		resultTracks: (state) => state.resultTracksInStore,
		mapCenter: (state) => state.mapCenterInStore
	}
});
