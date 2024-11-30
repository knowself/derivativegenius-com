import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
}

const firebaseApp = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(firebaseApp)

// Configure axios for development
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Add request interceptor to set CSRF token
api.interceptors.request.use(config => {
  // Get CSRF token from cookie
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1]
  
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken
  } else {
    console.warn('No CSRF token found in cookies')
  }

  // Add auth token if available
  const token = localStorage.getItem('idToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  
  return config
}, error => {
  console.error('Request interceptor error:', error)
  return Promise.reject(error)
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error)
    
    // Handle 401/403 errors by clearing auth state
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const store = useAuthStore()
      store.clearAuth()
    }
    
    return Promise.reject(error)
  }
)

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
    } else {
      localStorage.removeItem('idToken')
    }
  }

  function setError(err) {
    if (err?.response?.data?.error) {
      error.value = err.response.data.error
    } else if (err?.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err?.message) {
      error.value = err.message
    } else {
      error.value = 'An unexpected error occurred'
    }
    console.error('Auth error:', error.value, err)
  }

  function clearAuth() {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem('idToken')
  }

  async function initializeAuth() {
    loading.value = true
    error.value = null

    try {
      // Only attempt to get session if we have a token
      if (!token.value) {
        setUser(null)
        return false
      }

      const response = await api.get('/firebase/auth/session/')
      const { user: userData } = response.data
      
      if (!userData) {
        // Clear invalid session
        clearAuth()
        return false
      }
      
      setUser(userData)
      return true
    } catch (err) {
      console.error('Initialize auth error:', err)
      clearAuth() // Use clearAuth instead of separate setUser/setToken
      return false
    } finally {
      loading.value = false
    }
  }

  async function signIn({ email, password }) {
    loading.value = true
    error.value = null
    
    try {
      // First authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      const idToken = await userCredential.user.getIdToken()
      
      // Then verify with our backend
      const response = await api.post('/firebase/auth/signin/', { 
        idToken 
      })
      
      const userData = response.data.user
      
      if (!userData) {
        throw new Error('Invalid response from server: missing user data')
      }
      
      setToken(idToken)
      setUser(userData)
      
      return true
    } catch (err) {
      console.error('Sign in error:', err)
      clearAuth()
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

  // Add cleanup function
  function cleanup() {
    user.value = null
    token.value = null
    error.value = null
    loading.value = false
  }

  // Initialize auth when store is created
  if (token.value) {
    initializeAuth()
  } else {
    loading.value = false
  }

  return {
    // State
    user,
    loading,
    error,
    token,

    // Computed
    isAuthenticated,
    userEmail,
    isAdmin,
    
    // Actions
    signIn,
    signOut,
    setError,
    clearAuth,
    initializeAuth,
    cleanup
  }
})
