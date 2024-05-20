import { useTrackStore } from '@/stores/modules/tracks.js';
import { useSessionStore } from '@/stores/modules/sessionStore';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000'
// Function to fetch tracks from the API

export async function fetchTracks(url) {
  const storeTrack = useTrackStore();
	const storeSession = useSessionStore();
  try {
    const fetchedTracks = await storeTrack.searchTracks(url, storeSession.getAuthToken);
    console.log('Fetched tracks:', fetchedTracks);
    return fetchedTracks;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
}

// Function to fetch user's tracks from the API
export async function fetchMyTracks() {
  const storeTrack = useTrackStore();
	const storeSession = useSessionStore();
  try {
    const fetchedMyTracks = await storeTrack.searchTracks('/my_tracks', storeSession.getAuthToken);
    console.log('Fetched my tracks in requests:', fetchedMyTracks);
    return fetchedMyTracks;
  } catch (error) {
    console.error('Error fetching my tracks:', error);
    throw error;
  }
}

// Function to fetch a conversation by ID from the API
export async function fetchConversation(conversationId) {
  try {
    const response = await axios.get(`/track_conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}
