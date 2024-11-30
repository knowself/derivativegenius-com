import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor for CSRF token
api.interceptors.request.use(config => {
  // Get CSRF token from cookie
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Log the error for debugging
    console.error('API Error:', error.response || error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - clearing auth state');
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      console.warn('Forbidden access - clearing auth state');
    }
    
    return Promise.reject(error);
  }
);

export default api;
