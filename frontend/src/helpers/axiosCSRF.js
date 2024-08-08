// Axios setup (e.g., in main.js or a separate axios.js file)
import axios from 'axios';

// Fetch the CSRF token
const fetchCsrfToken = async () => {
  try {
    const response = await axios.post('/new_csrf_token');
    return response.data.csrf_token;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

// Set the CSRF token in Axios headers
const setCsrfToken = async () => {
  const csrfToken = await fetchCsrfToken();
  axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
};

// Call setCsrfToken before making requests that require CSRF protection
setCsrfToken();

export default axios
