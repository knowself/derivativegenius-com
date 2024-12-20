import { defineStore } from 'pinia'
import axios from 'axios'

export const usePerformanceStore = defineStore('performance', {
  state: () => ({
    systemMetrics: {},
    djangoMetrics: {},
    apiMetrics: {},
    loading: false,
    error: null,
    lastUpdated: null
  }),

  actions: {
    async fetchMetrics() {
      this.loading = true
      this.error = null
      
      try {
        const [systemResponse, djangoResponse, apiResponse] = await Promise.all([
          axios.get('/api/metrics/system'),
          axios.get('/api/metrics/django'),
          axios.get('/api/metrics/api')
        ])

        this.systemMetrics = systemResponse.data
        this.djangoMetrics = djangoResponse.data
        this.apiMetrics = apiResponse.data
        this.lastUpdated = new Date()
      } catch (error) {
        this.error = error.message
        console.error('Error fetching metrics:', error)
      } finally {
        this.loading = false
      }
    },

    startMetricPolling(interval = 10000) {
      // Poll metrics every 10 seconds by default
      this.stopMetricPolling() // Clear any existing interval
      this.pollInterval = setInterval(() => {
        this.fetchMetrics()
      }, interval)
    },

    stopMetricPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval)
        this.pollInterval = null
      }
    }
  },

  getters: {
    isHealthy: (state) => {
      if (!state.systemMetrics || !state.djangoMetrics || !state.apiMetrics) {
        return false
      }

      // Check system metrics
      const { cpu_usage, memory_usage, disk_usage } = state.systemMetrics
      if (cpu_usage > 90 || memory_usage > 90 || disk_usage > 90) {
        return false
      }

      // Check Django metrics
      const { database, cache } = state.djangoMetrics
      if (database?.query_time > 500 || cache?.response_time > 1000) {
        return false
      }

      // Check API metrics
      const { response_time, error_rate } = state.apiMetrics
      if (response_time > 1000 || error_rate > 5) {
        return false
      }

      return true
    },

    formattedLastUpdate: (state) => {
      if (!state.lastUpdated) return 'Never'
      return new Date(state.lastUpdated).toLocaleTimeString()
    }
  }
})
