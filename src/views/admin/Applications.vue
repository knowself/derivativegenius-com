<template>
  <div class="min-h-screen bg-gray-100">
    <div class="pl-64">
      <!-- Top Navigation -->
      <header class="bg-white shadow">
        <div class="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-900">Applications</h1>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Create Application
          </button>
        </div>
      </header>

      <!-- Applications List -->
      <main class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Filters -->
          <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
              <div>
                <label for="client" class="block text-sm font-medium text-gray-700">Client</label>
                <select id="client" v-model="filters.client" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option value="all">All Clients</option>
                  <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
                </select>
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" v-model="filters.status" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div>
                <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
                <input type="text" id="search" v-model="filters.search" placeholder="Search applications..." class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
          </div>

          <!-- Applications Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="app in filteredApplications" :key="app.id" class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-6">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h3 class="text-lg font-medium text-gray-900">{{ app.name }}</h3>
                    <p class="mt-1 text-sm text-gray-500">{{ app.description }}</p>
                  </div>
                  <span :class="[
                    app.status === 'active' ? 'bg-green-100 text-green-800' : 
                    app.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800',
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                  ]">
                    {{ app.status }}
                  </span>
                </div>

                <div class="mt-6">
                  <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div class="sm:col-span-1">
                      <dt class="text-sm font-medium text-gray-500">Client</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ app.client }}</dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-sm font-medium text-gray-500">API Calls (24h)</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ app.apiCalls }}</dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-sm font-medium text-gray-500">Created</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ app.created }}</dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ app.lastUpdated }}</dd>
                    </div>
                  </dl>
                </div>

                <div class="mt-6 flex space-x-3">
                  <button @click="viewDetails(app)" class="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    View Details
                  </button>
                  <button @click="toggleStatus(app)" class="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {{ app.status === 'active' ? 'Pause' : 'Activate' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">1</span>
                  to
                  <span class="font-medium">10</span>
                  of
                  <span class="font-medium">{{ totalApplications }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'AdminApplicationsPage',
  setup() {
    const filters = ref({
      client: 'all',
      status: 'all',
      search: ''
    })

    const clients = ref([
      { id: 1, name: 'TechCorp Industries' },
      { id: 2, name: 'InnovateTech Solutions' },
      { id: 3, name: 'DataDrive Analytics' }
    ])

    const applications = ref([
      {
        id: 1,
        name: 'Sales Analytics Dashboard',
        description: 'Real-time sales data visualization and analytics platform',
        status: 'active',
        client: 'TechCorp Industries',
        apiCalls: '45,231',
        created: '2023-01-15',
        lastUpdated: '2 hours ago'
      },
      {
        id: 2,
        name: 'Inventory Management System',
        description: 'Automated inventory tracking and management solution',
        status: 'paused',
        client: 'InnovateTech Solutions',
        apiCalls: '12,458',
        created: '2023-02-20',
        lastUpdated: '5 days ago'
      },
      {
        id: 3,
        name: 'Customer Insights Platform',
        description: 'AI-powered customer behavior analysis tool',
        status: 'error',
        client: 'DataDrive Analytics',
        apiCalls: '89,742',
        created: '2023-03-10',
        lastUpdated: '1 hour ago'
      }
    ])

    const totalApplications = computed(() => applications.value.length)

    const filteredApplications = computed(() => {
      return applications.value.filter(app => {
        const matchesClient = filters.value.client === 'all' || app.client === clients.value.find(c => c.id === filters.value.client)?.name
        const matchesStatus = filters.value.status === 'all' || app.status === filters.value.status
        const matchesSearch = app.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
                            app.description.toLowerCase().includes(filters.value.search.toLowerCase())
        
        return matchesClient && matchesStatus && matchesSearch
      })
    })

    const viewDetails = (app) => {
      // Implement view details functionality
      console.log('View details:', app)
    }

    const toggleStatus = (app) => {
      // Implement status toggle functionality
      console.log('Toggle status:', app)
    }

    return {
      filters,
      clients,
      applications,
      totalApplications,
      filteredApplications,
      viewDetails,
      toggleStatus
    }
  }
}
</script>
