<template>
  <div class="mb-8">
    <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
      System Health
      <span class="text-sm font-normal text-gray-500">
        Last updated: {{ performanceStore.formattedLastUpdate }}
      </span>
    </h2>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- System Resources -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 mb-4">System Resources</h3>
        <div class="space-y-4">
          <div v-for="(value, key) in performanceStore.systemMetrics" :key="key" 
               class="flex justify-between items-center">
            <span class="text-gray-600">{{ formatMetricName(key) }}</span>
            <span :class="getMetricStatusColor(key, value)" class="font-medium">
              {{ formatMetricValue(key, value) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Django Performance -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Django Performance</h3>
        <div class="space-y-4">
          <div v-for="(metrics, category) in performanceStore.djangoMetrics" :key="category">
            <h4 class="font-medium text-gray-700 mb-2">{{ formatMetricName(category) }}</h4>
            <div v-for="(value, key) in metrics" :key="key" 
                 class="flex justify-between items-center mt-2">
              <span class="text-gray-600">{{ formatMetricName(key) }}</span>
              <span :class="getMetricStatusColor(key, value)" class="font-medium">
                {{ formatMetricValue(key, value) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Firebase Performance -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Firebase Performance</h3>
        <div class="space-y-4">
          <div v-for="(metrics, category) in performanceStore.firebaseMetrics" :key="category">
            <h4 class="font-medium text-gray-700 mb-2">{{ formatMetricName(category) }}</h4>
            <div v-for="(value, key) in metrics" :key="key" 
                 class="flex justify-between items-center mt-2">
              <span class="text-gray-600">{{ formatMetricName(key) }}</span>
              <span :class="getMetricStatusColor(key, value)" class="font-medium">
                {{ formatMetricValue(key, value) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { usePerformanceStore } from '../stores/performance'

defineOptions({
  name: 'SystemHealthMonitor'
})

const performanceStore = usePerformanceStore()

// Format metric names for display
function formatMetricName(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Format metric values with appropriate units
function formatMetricValue(key, value) {
  if (typeof value !== 'number') return value
  
  if (key.includes('time')) {
    return `${value.toFixed(2)}ms`
  }
  if (key.includes('usage')) {
    return `${value.toFixed(1)}%`
  }
  if (key.includes('memory')) {
    return `${value.toFixed(1)}MB`
  }
  return value
}

// Get color based on metric status
function getMetricStatusColor(key, value) {
  if (typeof value !== 'number') return 'text-gray-900'

  const thresholds = {
    cpu_usage: { warning: 70, critical: 90 },
    memory_usage: { warning: 70, critical: 90 },
    disk_usage: { warning: 70, critical: 90 },
    query_time: { warning: 100, critical: 500 },
    response_time: { warning: 200, critical: 1000 },
    read_time: { warning: 200, critical: 1000 },
    write_time: { warning: 200, critical: 1000 }
  }

  const threshold = thresholds[key]
  if (!threshold) return 'text-gray-900'

  if (value >= threshold.critical) return 'text-red-600'
  if (value >= threshold.warning) return 'text-yellow-600'
  return 'text-green-600'
}

// Start polling metrics on component mount
onMounted(() => {
  performanceStore.fetchMetrics()
  performanceStore.startMetricPolling()
})

// Stop polling when component is unmounted
onUnmounted(() => {
  performanceStore.stopMetricPolling()
})
</script>
