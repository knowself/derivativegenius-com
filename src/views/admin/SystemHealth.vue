&lt;template&gt;
  &lt;div class="p-6"&gt;
    &lt;h1 class="text-2xl font-semibold text-gray-900 mb-6"&gt;System Health Monitor&lt;/h1&gt;
    
    &lt;!-- Real-time Status Overview --&gt;
    &lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"&gt;
      &lt;div v-for="metric in healthMetrics" :key="metric.name" 
           :class="['bg-white p-6 rounded-lg shadow-sm', 
                    metric.status === 'healthy' ? 'border-l-4 border-green-500' :
                    metric.status === 'warning' ? 'border-l-4 border-yellow-500' :
                    'border-l-4 border-red-500']"&gt;
        &lt;h3 class="text-sm font-medium text-gray-500"&gt;{{ metric.name }}&lt;/h3&gt;
        &lt;p class="mt-2 text-3xl font-semibold"
           :class="metric.status === 'healthy' ? 'text-green-600' :
                   metric.status === 'warning' ? 'text-yellow-600' :
                   'text-red-600'"&gt;
          {{ metric.value }}
        &lt;/p&gt;
        &lt;p class="mt-2 text-sm text-gray-600"&gt;{{ metric.description }}&lt;/p&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div class="grid grid-cols-1 lg:grid-cols-2 gap-6"&gt;
      &lt;!-- Vue Performance --&gt;
      &lt;div class="bg-white p-6 rounded-lg shadow-sm"&gt;
        &lt;h2 class="text-lg font-medium text-gray-900 mb-4"&gt;Vue.js Performance&lt;/h2&gt;
        &lt;div class="space-y-4"&gt;
          &lt;div v-for="metric in vueMetrics" :key="metric.name" class="flex justify-between items-center"&gt;
            &lt;span class="text-sm text-gray-600"&gt;{{ metric.name }}&lt;/span&gt;
            &lt;span class="text-sm font-medium" 
                  :class="metric.status === 'healthy' ? 'text-green-600' :
                         metric.status === 'warning' ? 'text-yellow-600' :
                         'text-red-600'"&gt;
              {{ metric.value }}
            &lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;LineChart :chart-data="vuePerformanceData" :options="chartOptions" class="mt-4 h-64" /&gt;
      &lt;/div&gt;

      &lt;!-- Django Performance --&gt;
      &lt;div class="bg-white p-6 rounded-lg shadow-sm"&gt;
        &lt;h2 class="text-lg font-medium text-gray-900 mb-4"&gt;Django Performance&lt;/h2&gt;
        &lt;div class="space-y-4"&gt;
          &lt;div v-for="metric in djangoMetrics" :key="metric.name" class="flex justify-between items-center"&gt;
            &lt;span class="text-sm text-gray-600"&gt;{{ metric.name }}&lt;/span&gt;
            &lt;span class="text-sm font-medium"
                  :class="metric.status === 'healthy' ? 'text-green-600' :
                         metric.status === 'warning' ? 'text-yellow-600' :
                         'text-red-600'"&gt;
              {{ metric.value }}
            &lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;LineChart :chart-data="djangoPerformanceData" :options="chartOptions" class="mt-4 h-64" /&gt;
      &lt;/div&gt;

      &lt;!-- Firebase Operations --&gt;
      &lt;div class="bg-white p-6 rounded-lg shadow-sm"&gt;
        &lt;h2 class="text-lg font-medium text-gray-900 mb-4"&gt;Firebase Operations&lt;/h2&gt;
        &lt;div class="space-y-4"&gt;
          &lt;div v-for="metric in firebaseMetrics" :key="metric.name" class="flex justify-between items-center"&gt;
            &lt;span class="text-sm text-gray-600"&gt;{{ metric.name }}&lt;/span&gt;
            &lt;span class="text-sm font-medium"
                  :class="metric.status === 'healthy' ? 'text-green-600' :
                         metric.status === 'warning' ? 'text-yellow-600' :
                         'text-red-600'"&gt;
              {{ metric.value }}
            &lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;LineChart :chart-data="firebasePerformanceData" :options="chartOptions" class="mt-4 h-64" /&gt;
      &lt;/div&gt;

      &lt;!-- System Resources --&gt;
      &lt;div class="bg-white p-6 rounded-lg shadow-sm"&gt;
        &lt;h2 class="text-lg font-medium text-gray-900 mb-4"&gt;System Resources&lt;/h2&gt;
        &lt;div class="space-y-4"&gt;
          &lt;div v-for="metric in systemMetrics" :key="metric.name" class="flex justify-between items-center"&gt;
            &lt;span class="text-sm text-gray-600"&gt;{{ metric.name }}&lt;/span&gt;
            &lt;span class="text-sm font-medium"
                  :class="metric.status === 'healthy' ? 'text-green-600' :
                         metric.status === 'warning' ? 'text-yellow-600' :
                         'text-red-600'"&gt;
              {{ metric.value }}
            &lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;LineChart :chart-data="systemResourceData" :options="chartOptions" class="mt-4 h-64" /&gt;
      &lt;/div&gt;
    &lt;/div&gt;
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

// Firebase metrics
const firebaseMetrics = ref([
  { name: 'Read Operations/sec', value: '23', status: 'healthy' },
  { name: 'Write Operations/sec', value: '12', status: 'healthy' },
  { name: 'Authentication Time', value: '180ms', status: 'healthy' },
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

const firebasePerformanceData = ref({
  labels: timeLabels,
  datasets: [{
    label: 'Operations/sec',
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
const updateMetrics = async () => {
  try {
    const metrics = await performanceStore.fetchMetrics()
    // Update all metrics with real data
    updateHealthMetrics(metrics)
  } catch (error) {
    console.error('Failed to update metrics:', error)
  }
}

onMounted(() => {
  updateMetrics()
  updateInterval = setInterval(updateMetrics, 10000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
&lt;/script&gt;
