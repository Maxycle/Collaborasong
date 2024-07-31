<template>
  <div>
    <form @submit.prevent="uploadTrack">
      <input type="text" v-model="title" placeholder="Track title" required />
      <input type="file" @change="handleFileUpload" required />
      <button type="submit">Upload Track</button>
    </form>
  </div>
</template>

<script>
import api from '@/helpers/api';

export default {
  data() {
    return {
      title: '',
      audioFile: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.audioFile = event.target.files[0];
    },
    async uploadTrack() {
      const formData = new FormData();
      formData.append('track[title]', this.title);
      formData.append('track[audio_file]', this.audioFile);

      try {
        await api.createTrack(formData);
        alert('Track uploaded successfully!');
      } catch (error) {
        console.error('Failed to upload track', error);
      }
    },
  },
};
</script>
