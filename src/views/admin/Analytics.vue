import SystemHealthMonitor from '../../components/SystemHealthMonitor.vue'

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Analytics</h1>
    
    <!-- Metrics Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="metric in metrics" :key="metric.name" 
           class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-gray-500">{{ metric.name }}</h3>
        <p class="mt-2 text-3xl font-semibold text-indigo-600">{{ metric.value }}</p>
        <p class="mt-2 text-sm text-gray-600">
          <span :class="metric.trend > 0 ? 'text-green-600' : 'text-red-600'">
            {{ Math.abs(metric.trend) }}%
          </span>
          vs last month
        </p>
      </div>
    </div>

    <!-- System Health Monitor -->
    <SystemHealthMonitor />

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
        <LineChart :chart-data="revenueData" :options="chartOptions" />
      </div>

      <!-- User Growth Chart -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
        <LineChart :chart-data="userGrowthData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

defineOptions({
  name: 'AdminAnalyticsPage'
})

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Sample metrics data
const metrics = ref([
  { name: 'Total Revenue', value: '$24,567', trend: 12 },
  { name: 'Active Users', value: '2,345', trend: 8 },
  { name: 'New Clients', value: '145', trend: -3 },
  { name: 'Conversion Rate', value: '3.2%', trend: 5 }
])

// Chart configuration
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

// Sample revenue data
const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [30000, 35000, 32000, 40000, 45000, 50000],
      borderColor: '#4F46E5',
      tension: 0.4
    }
  ]
}

// Sample user growth data
const userGrowthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Users',
      data: [1200, 1400, 1600, 1800, 2100, 2345],
      borderColor: '#10B981',
      tension: 0.4
    }
  ]
}
</script>
