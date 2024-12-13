import { defineStore } from 'pinia'

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    metrics: [
      { name: 'Total Revenue', value: '$12,345', trend: 8.2 },
      { name: 'Active Users', value: '1,234', trend: 12.5 },
      { name: 'New Clients', value: '45', trend: -2.4 },
      { name: 'Avg. Response Time', value: '250ms', trend: -5.1 }
    ],
    revenueData: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Monthly Revenue',
          data: [30000, 35000, 32000, 40000, 38000, 45000],
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Target Revenue',
          data: [28000, 32000, 35000, 37000, 40000, 42000],
          borderColor: 'rgb(209, 213, 219)',
          borderDash: [5, 5],
          tension: 0.4,
          pointStyle: false
        }
      ]
    },
    userGrowthData: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Active Users',
          data: [800, 950, 1100, 1250, 1400, 1600],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchAnalytics() {
      this.isLoading = true
      this.error = null
      
      try {
        // Simulate API call with current month data
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const currentDate = new Date()
        const months = []
        const revenueData = []
        const targetData = []
        const userData = []
        
        // Generate last 6 months of data
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
          months.unshift(date.toLocaleString('default', { month: 'long' }))
          
          // Generate somewhat random but trending upward data
          const baseRevenue = 30000 + (i * 3000)
          const variance = Math.random() * 5000 - 2500
          revenueData.unshift(Math.round(baseRevenue + variance))
          
          const targetRevenue = baseRevenue - 2000
          targetData.unshift(targetRevenue)
          
          const baseUsers = 800 + (i * 150)
          const userVariance = Math.random() * 100 - 50
          userData.unshift(Math.round(baseUsers + userVariance))
        }
        
        // Update the store with new data
        this.revenueData = {
          labels: months,
          datasets: [
            {
              ...this.revenueData.datasets[0],
              data: revenueData
            },
            {
              ...this.revenueData.datasets[1],
              data: targetData
            }
          ]
        }
        
        this.userGrowthData = {
          labels: months,
          datasets: [
            {
              ...this.userGrowthData.datasets[0],
              data: userData
            }
          ]
        }
        
        // Update metrics
        const lastMonthRevenue = revenueData[revenueData.length - 2]
        const currentRevenue = revenueData[revenueData.length - 1]
        const revenueTrend = ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        
        const lastMonthUsers = userData[userData.length - 2]
        const currentUsers = userData[userData.length - 1]
        const userTrend = ((currentUsers - lastMonthUsers) / lastMonthUsers) * 100
        
        this.metrics = [
          { 
            name: 'Total Revenue', 
            value: `$${currentRevenue.toLocaleString()}`,
            trend: Number(revenueTrend.toFixed(1))
          },
          { 
            name: 'Active Users',
            value: currentUsers.toLocaleString(),
            trend: Number(userTrend.toFixed(1))
          },
          { 
            name: 'New Clients',
            value: Math.round(currentUsers * 0.03).toString(),
            trend: Number((userTrend * 0.8).toFixed(1))
          },
          { 
            name: 'Avg. Response Time',
            value: '250ms',
            trend: -5.1
          }
        ]
      } catch (err) {
        this.error = 'Failed to load analytics data'
        console.error('[Analytics Store] Error:', err)
      } finally {
        this.isLoading = false
      }
    }
  }
})
