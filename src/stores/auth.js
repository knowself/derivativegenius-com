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

  // Get CSRF token from cookie with fallback
  function getCsrfToken() {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1]
    
    if (!token) {
      console.warn('CSRF token not found in cookies')
      return null
    }
    return token
  }

  // Ensure CSRF token is present
  async function ensureCsrfToken() {
    try {
      const currentToken = getCsrfToken()
      if (!currentToken) {
        console.log('Fetching new CSRF token')
        const response = await fetch('/firebase/auth/session/', {
          credentials: 'include',
          headers: token.value ? {
            'Authorization': `Bearer ${token.value}`
          } : {}
        })
        
        if (!response.ok) {
          console.error('Failed to fetch CSRF token:', response.status)
          throw new Error('Failed to fetch CSRF token')
        }

        const newToken = getCsrfToken()
        if (!newToken) {
          console.error('No CSRF token received after fetch')
          throw new Error('No CSRF token received')
        }
        return newToken
      }
      return currentToken
    } catch (err) {
      console.error('Error ensuring CSRF token:', err)
      throw err
    }
  }

  // Create authenticated fetch wrapper
  async function authenticatedFetch(url, options = {}) {
    try {
      const csrfToken = await ensureCsrfToken()
      
      const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {}),
        ...options.headers
      }

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      })

      // Log response details in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${options.method || 'GET'}] ${url}:`, response.status)
        console.log('Response headers:', Object.fromEntries(response.headers))
      }

      return response
    } catch (err) {
      console.error('Authenticated fetch error:', err)
      throw err
    }
  }

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
      
      // First, get CSRF token
      const csrfResponse = await authenticatedFetch('/firebase/auth/session/', {
        headers: storedToken ? {
          'Authorization': `Bearer ${storedToken}`
        } : {}
      })

      // Check if response is JSON
      const contentType = csrfResponse.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid response content type:', contentType)
        console.error('Response status:', csrfResponse.status)
        console.error('Response text:', await csrfResponse.text())
        throw new Error('Server returned invalid response format')
      }

      const data = await csrfResponse.json()
      
      if (data.user) {
        setUser(data.user)
        setToken(storedToken) // Keep existing token if valid
      } else {
        setUser(null)
        setToken(null)
      }
    } catch (err) {
      console.error('Auth initialization error:', err)
      setError('Failed to initialize authentication')
      setUser(null)
      setToken(null)
    }
  }

  async function signIn({ email, password }) {
    try {
      loading.value = true
      error.value = null

      console.log('Starting sign in process...')

      const response = await authenticatedFetch('/firebase/auth/signin/', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      console.log('Sign in response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers))

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid response content type:', contentType)
        const responseText = await response.text()
        console.error('Response text:', responseText)
        throw new Error(`Server returned invalid response format (${contentType}). Response: ${responseText}`)
      }

      let data
      try {
        data = await response.json()
        console.log('Response data:', { ...data, token: data.token ? '[REDACTED]' : undefined })
      } catch (err) {
        console.error('Failed to parse response JSON:', err)
        throw new Error('Failed to parse server response')
      }

      if (!response.ok) {
        const errorMessage = data.error || 'Authentication failed'
        const errorDetails = data.details ? `: ${data.details}` : ''
        console.error('Sign in error:', errorMessage, errorDetails)
        throw new Error(errorMessage + errorDetails)
      }

      if (!data.user || !data.token) {
        console.error('Invalid response format:', { ...data, token: '[REDACTED]' })
        throw new Error('Invalid server response: missing user or token')
      }

      console.log('Sign in successful')
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
      loading.value = true
      error.value = null

      const response = await authenticatedFetch('/firebase/auth/signout/', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to sign out')
      }

      setUser(null)
      setToken(null)
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err.message || 'Failed to sign out')
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    token,
    isAuthenticated,
    userEmail,
    isAdmin,
    initializeAuth,
    signIn,
    signOut,
    setError,
    authenticatedFetch
  }
})
