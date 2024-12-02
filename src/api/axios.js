import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  }
});

// Add request interceptor for CSRF token and auth debugging
api.interceptors.request.use(async config => {
  // Get CSRF token from cookie
  let csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  
  // If no CSRF token is found, try to get one from the server
  if (!csrfToken && config.method !== 'get' && !config.url.endsWith('/signin/')) {
    try {
      console.log('No CSRF token found, fetching from server...');
      // Make a GET request to the signin endpoint to get a CSRF token
      await axios.get(config.baseURL + '/firebase/auth/signin/', { withCredentials: true });
      
      // Try to get the token again
      csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
        
      console.log('Retrieved CSRF token:', csrfToken ? 'Yes' : 'No');
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  }
  
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
    console.log('Using CSRF token:', csrfToken.substring(0, 10) + '...');
  } else {
    console.warn('No CSRF token available for request');
  }

  // Log request details in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
  }
  
  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
    }
    return response;
  },
  error => {
    // Log error details
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          data: error.config.data
        }
      });
    } else if (error.request) {
      console.error('Request error:', {
        request: error.request,
        config: error.config
      });
    } else {
      console.error('Error:', error.message, error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
