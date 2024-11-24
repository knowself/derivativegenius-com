import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use(config => {
  const authStore = useAuthStore()
  const token = authStore.getAuthToken()
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.signOut()
    }
    return Promise.reject(error)
  }
)

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
