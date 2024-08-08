import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',  // Adjust the base URL to your Rails API address
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  createTrack(formData) {
    return apiClient.post('/tracks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: localStorage.getItem('authToken'),
      },
    });
  },
  getTracks() {
    return apiClient.get('/tracks', {
      headers: {
        Authorization: localStorage.getItem('authToken'),
      },
    });
  },
};
