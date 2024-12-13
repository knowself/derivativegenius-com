<template>
  <div>
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Applications</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage and monitor all client applications.
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Create Application
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-8 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div>
          <label for="client" class="block text-sm font-medium text-gray-700">Client</label>
          <select id="client" v-model="filters.client" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
            <option value="all">All Clients</option>
            <option v-for="client in clients" :key="client.id" :value="client.name">{{ client.name }}</option>
          </select>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select id="status" v-model="filters.status" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Applications List -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Client</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Application Type</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="application in filteredApplications" :key="application.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ application.client }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ application.type }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="[
                      application.status === 'active' ? 'bg-green-100 text-green-800' :
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ application.status }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ application.lastUpdated }}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button @click="viewApplication(application)" class="text-primary-600 hover:text-primary-900">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sample data - replace with actual data from your backend
const clients = ref([
  { id: 1, name: 'TechCorp Solutions' },
  { id: 2, name: 'Global Innovations' },
  { id: 3, name: 'Digital Ventures' }
])

const applications = ref([
  {
    id: 1,
    client: 'TechCorp Solutions',
    type: 'Web Application',
    status: 'active',
    lastUpdated: '2024-12-12'
  },
  {
    id: 2,
    client: 'Global Innovations',
    type: 'Mobile App',
    status: 'pending',
    lastUpdated: '2024-12-11'
  },
  {
    id: 3,
    client: 'Digital Ventures',
    type: 'API Integration',
    status: 'archived',
    lastUpdated: '2024-12-10'
  }
])

const filters = ref({
  client: 'all',
  status: 'all'
})

const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    const clientMatch = filters.value.client === 'all' || app.client === filters.value.client
    const statusMatch = filters.value.status === 'all' || app.status === filters.value.status
    return clientMatch && statusMatch
  })
})

const viewApplication = (application) => {
  console.log('Viewing application:', application)
  // Add your view logic here
}
</script>
