import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
    loading.value = false
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
    error.value = err
    loading.value = false
  }

  async function initializeAuth() {
    try {
      loading.value = true
      const storedToken = localStorage.getItem('idToken')
      
      const response = await fetch('/firebase/auth/session/', {
        headers: storedToken ? {
          'Authorization': `Bearer ${storedToken}`
        } : {}
      })
      const data = await response.json()
      
      if (data.user) {
        setUser(data.user)
        setToken(storedToken) // Keep existing token if valid
      } else {
        setUser(null)
        setToken(null)
      }
    } catch (err) {
      setError('Failed to initialize authentication')
      setUser(null)
      setToken(null)
    }
  }

  async function signIn({ email, password }) {
    try {
      loading.value = true
      error.value = null
      
      // Get CSRF token from cookie if using Django's CSRF protection
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1]

      const response = await fetch('/firebase/auth/signin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || 'Authentication failed'
        console.error('Sign in error:', errorMessage)
        throw new Error(errorMessage)
      }

      if (!data.user || !data.token) {
        console.error('Invalid response format:', data)
        throw new Error('Invalid server response')
      }

      setUser(data.user)
      setToken(data.token)
      return data.user
    } catch (err) {
      console.error('Sign in error:', err)
      setError(err.message || 'Authentication failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      const response = await fetch('/firebase/auth/signout/', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Signout failed')
      }
      
      setUser(null)
      setToken(null)
    } catch (err) {
      setError('An error occurred during sign out')
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    userEmail,
    isAdmin,
    token,
    signIn,
    signOut,
    initializeAuth,
    setUser,  // Expose setUser for testing
    setToken  // Expose setToken for testing
  }
})
