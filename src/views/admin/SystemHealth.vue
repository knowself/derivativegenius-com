&lt;template&gt;
  &lt;div class="min-h-screen bg-primary-50"&gt;
    &lt;header class="bg-white shadow"&gt;
      &lt;div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"&gt;
        &lt;h1 class="text-3xl font-bold text-primary-900"&gt;System Health&lt;/h1&gt;
      &lt;/div&gt;
    &lt;/header&gt;

    &lt;main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"&gt;
      &lt;!-- System Status Overview --&gt;
      &lt;div class="bg-white shadow rounded-lg mb-6"&gt;
        &lt;div class="px-4 py-5 sm:p-6"&gt;
          &lt;h2 class="text-xl font-semibold text-primary-900 mb-4"&gt;System Status Overview&lt;/h2&gt;
          &lt;div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"&gt;
            &lt;div class="bg-primary-50 rounded-lg p-4"&gt;
              &lt;div class="flex items-center"&gt;
                &lt;div class="flex-shrink-0"&gt;
                  &lt;svg class="h-6 w-6 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"&gt;
                    &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /&gt;
                  &lt;/svg&gt;
                &lt;/div&gt;
                &lt;div class="ml-3"&gt;
                  &lt;h3 class="text-sm font-medium text-primary-900"&gt;System Status&lt;/h3&gt;
                  &lt;p class="mt-1 text-sm text-primary-700"&gt;{{ systemStatus }}&lt;/p&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;

            &lt;div class="bg-primary-50 rounded-lg p-4"&gt;
              &lt;div class="flex items-center"&gt;
                &lt;div class="flex-shrink-0"&gt;
                  &lt;svg class="h-6 w-6 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"&gt;
                    &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /&gt;
                  &lt;/svg&gt;
                &lt;/div&gt;
                &lt;div class="ml-3"&gt;
                  &lt;h3 class="text-sm font-medium text-primary-900"&gt;Uptime&lt;/h3&gt;
                  &lt;p class="mt-1 text-sm text-primary-700"&gt;{{ uptime }}&lt;/p&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;

            &lt;div class="bg-primary-50 rounded-lg p-4"&gt;
              &lt;div class="flex items-center"&gt;
                &lt;div class="flex-shrink-0"&gt;
                  &lt;svg class="h-6 w-6 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"&gt;
                    &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /&gt;
                  &lt;/svg&gt;
                &lt;/div&gt;
                &lt;div class="ml-3"&gt;
                  &lt;h3 class="text-sm font-medium text-primary-900"&gt;Response Time&lt;/h3&gt;
                  &lt;p class="mt-1 text-sm text-primary-700"&gt;{{ responseTime }}ms&lt;/p&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- Health Metrics --&gt;
      &lt;div class="bg-white shadow rounded-lg mb-6"&gt;
        &lt;div class="px-4 py-5 sm:p-6"&gt;
          &lt;h2 class="text-xl font-semibold text-primary-900 mb-4"&gt;Health Metrics&lt;/h2&gt;
          &lt;div class="space-y-4"&gt;
            &lt;div v-for="metric in healthMetrics" :key="metric.name" class="bg-primary-50 rounded-lg p-4"&gt;
              &lt;div class="flex items-center justify-between"&gt;
                &lt;div class="flex items-center"&gt;
                  &lt;span class="text-sm font-medium text-primary-900"&gt;{{ metric.name }}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class="ml-2"&gt;
                  &lt;span class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-accent-100 text-accent-800': metric.status === 'healthy',
                      'bg-secondary-100 text-secondary-800': metric.status === 'warning',
                      'bg-red-100 text-red-800': metric.status === 'critical'
                    }"&gt;
                    {{ metric.value }}
                  &lt;/span&gt;
                &lt;/div&gt;
              &lt;/div&gt;
              &lt;div class="mt-1"&gt;
                &lt;div class="relative pt-1"&gt;
                  &lt;div class="overflow-hidden h-2 text-xs flex rounded bg-primary-200"&gt;
                    &lt;div
                      :style="{ width: metric.percentage + '%' }"
                      :class="{
                        'bg-accent-600': metric.status === 'healthy',
                        'bg-secondary-600': metric.status === 'warning',
                        'bg-red-600': metric.status === 'critical'
                      }"
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- Recent Alerts --&gt;
      &lt;div class="bg-white shadow rounded-lg"&gt;
        &lt;div class="px-4 py-5 sm:p-6"&gt;
          &lt;h2 class="text-xl font-semibold text-primary-900 mb-4"&gt;Recent Alerts&lt;/h2&gt;
          &lt;div class="space-y-4"&gt;
            &lt;div v-for="alert in recentAlerts" :key="alert.id" 
              class="p-4 rounded-lg"
              :class="{
                'bg-accent-50': alert.severity === 'info',
                'bg-secondary-50': alert.severity === 'warning',
                'bg-red-50': alert.severity === 'critical'
              }"&gt;
              &lt;div class="flex"&gt;
                &lt;div class="flex-shrink-0"&gt;
                  &lt;svg class="h-5 w-5" 
                    :class="{
                      'text-accent-400': alert.severity === 'info',
                      'text-secondary-400': alert.severity === 'warning',
                      'text-red-400': alert.severity === 'critical'
                    }"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"&gt;
                    &lt;path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /&gt;
                  &lt;/svg&gt;
                &lt;/div&gt;
                &lt;div class="ml-3"&gt;
                  &lt;h3 class="text-sm font-medium"
                    :class="{
                      'text-accent-800': alert.severity === 'info',
                      'text-secondary-800': alert.severity === 'warning',
                      'text-red-800': alert.severity === 'critical'
                    }"&gt;
                    {{ alert.title }}
                  &lt;/h3&gt;
                  &lt;div class="mt-2 text-sm"
                    :class="{
                      'text-accent-700': alert.severity === 'info',
                      'text-secondary-700': alert.severity === 'warning',
                      'text-red-700': alert.severity === 'critical'
                    }"&gt;
                    &lt;p&gt;{{ alert.message }}&lt;/p&gt;
                  &lt;/div&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/main&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, onMounted, onUnmounted } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { usePerformanceStore } from '@/stores/performance'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

defineOptions({
  name: 'SystemHealthPage'
})

const performanceStore = usePerformanceStore()

// Overall health metrics
const healthMetrics = ref([
  { name: 'System Status', value: 'Healthy', status: 'healthy', description: 'All systems operational' },
  { name: 'Response Time', value: '45ms', status: 'healthy', description: 'Average API response time' },
  { name: 'Error Rate', value: '0.01%', status: 'healthy', description: 'Last 24 hours' },
  { name: 'Uptime', value: '99.99%', status: 'healthy', description: 'Last 30 days' }
])

// Vue.js metrics
const vueMetrics = ref([
  { name: 'Component Load Time', value: '12ms', status: 'healthy' },
  { name: 'Memory Usage', value: '24MB', status: 'healthy' },
  { name: 'Route Change Time', value: '8ms', status: 'healthy' },
  { name: 'Active Watchers', value: '156', status: 'healthy' }
])

// Django metrics
const djangoMetrics = ref([
  { name: 'Request/sec', value: '45', status: 'healthy' },
  { name: 'Database Query Time', value: '15ms', status: 'healthy' },
  { name: 'Cache Hit Rate', value: '94%', status: 'healthy' },
  { name: 'Active Sessions', value: '234', status: 'healthy' }
])

// API metrics
const apiMetrics = ref([
  { name: 'Response Time', value: '23ms', status: 'healthy' },
  { name: 'Error Rate', value: '0.01%', status: 'healthy' },
  { name: 'Request Rate', value: '180/s', status: 'healthy' },
  { name: 'Active Connections', value: '89', status: 'healthy' }
])

// System metrics
const systemMetrics = ref([
  { name: 'CPU Usage', value: '35%', status: 'healthy' },
  { name: 'Memory Usage', value: '2.1GB', status: 'healthy' },
  { name: 'Disk Space', value: '45%', status: 'healthy' },
  { name: 'Network I/O', value: '1.2MB/s', status: 'healthy' }
])

// Chart configuration
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Sample performance data
const timeLabels = ['1m ago', '50s ago', '40s ago', '30s ago', '20s ago', '10s ago', 'Now']

const vuePerformanceData = ref({
  labels: timeLabels,
  datasets: [{
    label: 'Response Time (ms)',
    data: [45, 42, 47, 43, 44, 41, 45],
    borderColor: '#4F46E5',
    tension: 0.4
  }]
})

const djangoPerformanceData = ref({
  labels: timeLabels,
  datasets: [{
    label: 'Requests/sec',
    data: [42, 45, 43, 47, 44, 46, 45],
    borderColor: '#10B981',
    tension: 0.4
  }]
})

const apiPerformanceData = ref({
  labels: timeLabels,
  datasets: [{
    label: 'Response Time (ms)',
    data: [35, 32, 37, 34, 36, 33, 35],
    borderColor: '#F59E0B',
    tension: 0.4
  }]
})

const systemResourceData = ref({
  labels: timeLabels,
  datasets: [{
    label: 'CPU Usage %',
    data: [32, 35, 33, 36, 34, 35, 33],
    borderColor: '#EC4899',
    tension: 0.4
  }]
})

let updateInterval

// Update metrics every 10 seconds
const updateMetrics = async () =&gt; {
  try {
    const metrics = await performanceStore.fetchMetrics()
    // Update all metrics with real data
    updateHealthMetrics(metrics)
  } catch (error) {
    console.error('Failed to update metrics:', error)
  }
}

onMounted(() =&gt; {
  updateMetrics()
  updateInterval = setInterval(updateMetrics, 10000)
})

onUnmounted(() =&gt; {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
&lt;/script&gt;
