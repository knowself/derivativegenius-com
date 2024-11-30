import axios from 'axios'
import { useAuthStore } from '@/store/auth'

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable CSRF cookie handling
})

// Request interceptor for API calls
api.interceptors.request.use(
  async config => {
    const authStore = useAuthStore()
    const token = authStore.getAuthToken()
    
    // Ensure we have CSRF token
    if (!document.cookie.includes('csrftoken')) {
      await fetch('/health/', { credentials: 'include' })
    }
    
    // Get CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1]
    
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
api.interceptors.response.use(
  response => response,
  async error => {
    const authStore = useAuthStore()
    
    // Handle different error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - sign out user
          await authStore.signOut()
          break
        case 403:
          // Forbidden - could be CSRF token issue
          if (error.response.data.detail?.includes('CSRF')) {
            // Retry request once with fresh CSRF token
            const originalRequest = error.config
            if (!originalRequest._retry) {
              originalRequest._retry = true
              await fetch('/health/', { credentials: 'include' })
              return api(originalRequest)
            }
          }
          break
        case 500:
          console.error('Server error:', error.response.data)
          break
      }
    }
    return Promise.reject(error)
  }
)

// Health check functions
export const healthApi = {
  async checkDjango() {
    try {
      const response = await fetch('/health/', { 
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  },
  
  async checkVueStatus() {
    try {
      const response = await fetch('/vue-status/', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Vue status check failed:', error)
      return false
    }
  }
}

export const adminApi = {
  // Clients
  async getClients(params = {}) {
    const response = await api.get('/clients/', { params })
    return response.data
  },

  async createClient(data) {
    const response = await api.post('/clients/', data)
    return response.data
  },

  async updateClient(id, data) {
    const response = await api.put(`/clients/${id}/`, data)
    return response.data
  },

  async deleteClient(id) {
    await api.delete(`/clients/${id}/`)
  },

  // Applications
  async getApplications(params = {}) {
    const response = await api.get('/applications/', { params })
    return response.data
  },

  async updateApplication(id, data) {
    const response = await api.put(`/applications/${id}/`, data)
    return response.data
  },

  // Analytics
  async getAnalytics() {
    const response = await api.get('/analytics/overview/')
    return response.data
  },

  async getRevenueData(params = {}) {
    const response = await api.get('/analytics/revenue/', { params })
    return response.data
  },

  async getUserGrowthData(params = {}) {
    const response = await api.get('/analytics/user-growth/', { params })
    return response.data
  },

  // User Profile
  async updateProfile(data) {
    const response = await api.put('/users/profile/', data)
    return response.data
  },

  async updatePassword(data) {
    const response = await api.post('/users/change-password/', data)
    return response.data
  },

  async updateNotificationSettings(data) {
    const response = await api.put('/users/notifications/', data)
    return response.data
  }
}

export default api
