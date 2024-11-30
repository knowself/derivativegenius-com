<!-- Admin Dashboard -->
<template>
  <div class="min-h-screen bg-primary-50">
    <!-- Sidebar -->
    <nav class="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white">
      <div class="px-4 py-6">
        <img class="h-8 w-auto" src="/images/DG-AAA.png" alt="Derivative Genius">
      </div>
      <div class="mt-6">
        <router-link 
          v-for="item in navigation" 
          :key="item.name"
          :to="item.href"
          :class="[
            item.current ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'group flex items-center px-4 py-2 text-sm font-medium'
          ]"
        >
          <component 
            :is="item.icon" 
            :class="[
              item.current ? 'text-white' : 'text-gray-400 group-hover:text-white',
              'mr-3 h-6 w-6'
            ]"
          />
          {{ item.name }}
        </router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="pl-64">
      <!-- Top Navigation -->
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-primary-900">Dashboard</h1>
          <div class="flex items-center">
            <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span>New Report</span>
            </button>
            <button 
              @click="handleLogout" 
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <span>Logout</span>
            </button>
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <button class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <main class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="stat in stats" :key="stat.name" class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <component :is="stat.icon" class="h-6 w-6 text-gray-400" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
                      <dd class="flex items-baseline">
                        <div class="text-2xl font-semibold text-gray-900">{{ stat.value }}</div>
                        <div :class="[
                          stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600',
                          'ml-2 flex items-baseline text-sm font-semibold'
                        ]">
                          {{ stat.change.value }}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <!-- Usage Chart -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Usage Analytics</h3>
                <div class="mt-4 h-96">
                  <!-- Chart will be mounted here -->
                </div>
              </div>
            </div>

            <!-- Revenue Chart -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Revenue Overview</h3>
                <div class="mt-4 h-96">
                  <!-- Chart will be mounted here -->
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="mt-8">
            <div class="bg-white shadow rounded-lg">
              <div class="px-5 py-4 border-b border-gray-200">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              </div>
              <ul class="divide-y divide-gray-200">
                <li v-for="activity in recentActivity" :key="activity.id" class="p-5">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <component :is="activity.icon" class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ activity.title }}</p>
                      <p class="text-sm text-gray-500">{{ activity.description }}</p>
                    </div>
                    <div>
                      <span class="text-sm text-gray-500">{{ activity.time }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup name="AdminDashboard">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  ChartBarIcon,
  Cog6ToothIcon as CogIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const navigation = ref([
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, current: true },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, current: false },
  { name: 'Clients', href: '/admin/clients', icon: UsersIcon, current: false },
  { name: 'Applications', href: '/admin/applications', icon: FolderIcon, current: false },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon, current: false },
])

async function handleLogout() {
  await authStore.signOut()
  router.push('/')
}

// Update current route highlight
navigation.value = navigation.value.map(item => ({
  ...item,
  current: router.currentRoute.value.path === item.href
}))

const stats = ref([
  {
    name: 'Total Clients',
    value: '71',
    icon: UsersIcon,
    change: { value: '+5.4%', type: 'increase' }
  },
  {
    name: 'Active Applications',
    value: '245',
    icon: FolderIcon,
    change: { value: '+3.2%', type: 'increase' }
  },
  {
    name: 'API Calls',
    value: '23.4k',
    icon: ChartBarIcon,
    change: { value: '+2.3%', type: 'increase' }
  },
  {
    name: 'Revenue',
    value: '$45,233',
    icon: ChartBarIcon,
    change: { value: '+4.1%', type: 'increase' }
  }
])

const recentActivity = ref([
  {
    id: 1,
    title: 'New Client Registration',
    description: 'TechCorp Industries signed up for Enterprise plan',
    time: '2 hours ago',
    icon: UsersIcon
  },
  {
    id: 2,
    title: 'API Usage Spike',
    description: 'Unusual activity detected for client ID: 2847',
    time: '4 hours ago',
    icon: ChartBarIcon
  },
  {
    id: 3,
    title: 'System Update',
    description: 'Successfully deployed v2.3.0',
    time: '6 hours ago',
    icon: CogIcon
  }
])

</script>
