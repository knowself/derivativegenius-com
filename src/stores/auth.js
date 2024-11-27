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
    const name = 'csrftoken='
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(';')
    
    for (let cookie of cookieArray) {
      cookie = cookie.trim()
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length)
      }
    }
    console.warn('CSRF token not found in cookies')
    return null
  }

  // Ensure CSRF token is present
  async function ensureCsrfToken() {
    try {
      const currentToken = getCsrfToken()
      if (!currentToken) {
        console.log('Fetching new CSRF token')
        
        // Make request to health check endpoint to set CSRF cookie
        const response = await fetch('/health/', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        })
        
        if (!response.ok) {
          console.error('Failed to fetch CSRF token:', response.status)
          throw new Error(`Failed to fetch CSRF token: ${response.status}`)
        }

        const data = await response.json()
        console.log('Health check response:', data)

        // Get token from cookie after health check
        const newToken = getCsrfToken()
        if (!newToken) {
          console.error('No CSRF token received after fetch')
          throw new Error('No CSRF token received')
        }
        
        console.log('Successfully retrieved CSRF token:', newToken)
        return newToken
      }
      return currentToken
    } catch (error) {
      console.error('Error ensuring CSRF token:', error)
      throw error
    }
  }

  // Create authenticated fetch wrapper
  async function authenticatedFetch(url, options = {}) {
    try {
      // Ensure we have a CSRF token
      const csrfToken = await ensureCsrfToken()
      
      // Merge headers with defaults
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
        ...(options.headers || {})
      }

      // If we have an auth token, add it
      if (token.value) {
        headers['Authorization'] = `Bearer ${token.value}`
      }

      // Merge options with defaults
      const fetchOptions = {
        ...options,
        credentials: 'include',
        headers
      }

      console.log('Fetch request:', {
        url,
        method: fetchOptions.method || 'GET',
        headers: {
          ...fetchOptions.headers,
          Authorization: fetchOptions.headers.Authorization ? '[REDACTED]' : undefined
        }
      })

      const response = await fetch(url, fetchOptions)
      
      if (!response.ok) {
        console.error('Request failed:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        })
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
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
      
      // First ensure we have a valid CSRF token
      try {
        console.log('Fetching fresh CSRF token...')
        const healthResponse = await fetch('/health/', {
          credentials: 'include'
        })
        if (!healthResponse.ok) {
          console.error('Health check failed:', healthResponse.status)
          throw new Error('Failed to initialize session')
        }
      } catch (err) {
        console.error('Health check error:', err)
        throw new Error('Failed to initialize session')
      }

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
