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

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
        <Line 
          v-if="revenueChartData" 
          :data="revenueChartData" 
          :options="chartOptions" 
          class="h-64"
        />
      </div>

      <!-- User Growth Chart -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
        <Line 
          v-if="userGrowthChartData" 
          :data="userGrowthChartData" 
          :options="chartOptions" 
          class="h-64"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Analytics'
})
</script>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useAnalyticsStore } from '@/store/analytics'
import { storeToRefs } from 'pinia'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const analyticsStore = useAnalyticsStore()
const { metrics, revenueData: revenueChartData, userGrowthData: userGrowthChartData, isLoading, error } = storeToRefs(analyticsStore)

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(context.parsed.y)
          }
          return label
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false
      },
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(value)
        }
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  elements: {
    line: {
      tension: 0.4
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 6
    }
  }
}

onMounted(async () => {
  await analyticsStore.fetchAnalytics()
  
  // Set up periodic updates
  const updateInterval = setInterval(async () => {
    await analyticsStore.fetchAnalytics()
  }, 60000) // Update every minute
  
  // Clean up interval on component unmount
  onUnmounted(() => {
    clearInterval(updateInterval)
  })
})
</script>
