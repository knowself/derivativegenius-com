import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// Configure axios for development
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : '/api'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'  // Required for Django CSRF
  }
})

// Add request interceptor to set CSRF token
api.interceptors.request.use(config => {
  const csrfToken = document.cookie.split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1]
  
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken
  }
  
  // Add CORS headers for development
  if (process.env.NODE_ENV === 'development') {
    config.headers['Access-Control-Allow-Origin'] = 'http://localhost:8080'
    config.headers['Access-Control-Allow-Credentials'] = 'true'
  }
  
  return config
}, error => {
  console.error('Request interceptor error:', error)
  return Promise.reject(error)
})

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const token = ref(localStorage.getItem('idToken'))

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email)
  const isAdmin = computed(() => user.value?.isAdmin || false)

  // Actions
  function setUser(newUser) {
    user.value = newUser
  }

  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('idToken', newToken)
      // Set token in authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      localStorage.removeItem('idToken')
      delete api.defaults.headers.common['Authorization']
    }
  }

  function setError(err) {
    if (err?.response?.data) {
      error.value = err.response.data.error || err.response.data.details || 'An error occurred'
    } else {
      error.value = err?.message || 'An error occurred'
    }
  }

  async function initializeAuth() {
    loading.value = true
    try {
      // Try to get stored token
      const storedToken = localStorage.getItem('idToken')
      if (storedToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      }
      
      const response = await api.get('/firebase/auth/session/')
      if (response.data.user) {
        setUser(response.data.user)
        return true
      } else {
        setUser(null)
        setToken(null)
        return false
      }
    } catch (err) {
      console.error('Auth initialization error:', err)
      setError(err)
      setUser(null)
      setToken(null)
      return false
    } finally {
      loading.value = false
    }
  }

  async function signIn({ email, password }) {
    loading.value = true
    error.value = null
    
    try {
      // Ensure we have a CSRF token
      await api.get('/firebase/auth/')  // This endpoint sets the CSRF cookie
      
      const response = await api.post('/firebase/auth/signin/', { 
        email, 
        password 
      })
      
      const { token: newToken, user: userData } = response.data
      
      setToken(newToken)
      setUser(userData)
      return true
    } catch (err) {
      console.error('Sign in error:', err)
      setError(err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    loading.value = true
    error.value = null

    try {
      await api.post('/firebase/auth/signout/')
      setUser(null)
      setToken(null)
      return true
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Initialize auth when store is created
  if (token.value) {
    initializeAuth()
  } else {
    loading.value = false
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    userEmail,
    isAdmin,
    initializeAuth,
    signIn,
    signOut,
    setError
  }
})
