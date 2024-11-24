<template>
  <div class="min-h-screen bg-gray-100">
    <div class="pl-64">
      <!-- Top Navigation -->
      <header class="bg-white shadow">
        <div class="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-900">Client Management</h1>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add New Client
          </button>
        </div>
      </header>

      <!-- Client List -->
      <main class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Filters -->
          <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" v-model="filters.status" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label for="plan" class="block text-sm font-medium text-gray-700">Plan</label>
                <select id="plan" v-model="filters.plan" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option value="all">All Plans</option>
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
                <input type="text" id="search" v-model="filters.search" placeholder="Search clients..." class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
          </div>

          <!-- Client Table -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="client in filteredClients" :key="client.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" :src="client.avatar" :alt="client.name">
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                        <div class="text-sm text-gray-500">{{ client.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]">
                      {{ client.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.plan }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.applications }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.lastActive }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="editClient(client)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button @click="deleteClient(client)" class="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                    <span class="font-medium">{{ totalClients }}</span>
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
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'AdminClients',
  setup() {
    const filters = ref({
      status: 'all',
      plan: 'all',
      search: ''
    })

    const clients = ref([
      {
        id: 1,
        name: 'TechCorp Industries',
        email: 'contact@techcorp.com',
        status: 'active',
        plan: 'Enterprise',
        applications: 5,
        lastActive: '2 hours ago',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      // Add more sample clients here
    ])

    const totalClients = computed(() => clients.value.length)

    const filteredClients = computed(() => {
      return clients.value.filter(client => {
        const matchesStatus = filters.value.status === 'all' || client.status === filters.value.status
        const matchesPlan = filters.value.plan === 'all' || client.plan.toLowerCase() === filters.value.plan
        const matchesSearch = client.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
                            client.email.toLowerCase().includes(filters.value.search.toLowerCase())
        
        return matchesStatus && matchesPlan && matchesSearch
      })
    })

    const editClient = (client) => {
      // Implement edit functionality
      console.log('Edit client:', client)
    }

    const deleteClient = (client) => {
      // Implement delete functionality
      console.log('Delete client:', client)
    }

    return {
      filters,
      clients,
      totalClients,
      filteredClients,
      editClient,
      deleteClient
    }
  }
}
</script>
