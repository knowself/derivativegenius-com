<!-- Admin Dashboard -->
<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Welcome to your Dashboard</h1>
      <p class="mt-2 text-sm text-gray-600">Here's what's happening with your projects today.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component
                :is="stat.icon"
                class="h-6 w-6 text-primary-600"
                aria-hidden="true"
              />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ stat.name }}
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stat.value }}
                  </div>
                  <div
                    v-if="stat.change"
                    :class="[
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                      'ml-2 flex items-baseline text-sm font-semibold'
                    ]"
                  >
                    <component
                      :is="stat.changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon"
                      class="self-center flex-shrink-0 h-4 w-4 text-current"
                      aria-hidden="true"
                    />
                    <span class="sr-only">
                      {{ stat.changeType === 'increase' ? 'Increased' : 'Decreased' }} by
                    </span>
                    {{ stat.change }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/admin/blog/new"
          class="flex items-center p-4 bg-white shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <DocumentPlusIcon class="h-6 w-6 text-primary-600" />
          <span class="ml-3 text-gray-900">Create New Post</span>
        </router-link>
        <router-link
          to="/admin/applications"
          class="flex items-center p-4 bg-white shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <ListBulletIcon class="h-6 w-6 text-primary-600" />
          <span class="ml-3 text-gray-900">View Applications</span>
        </router-link>
        <router-link
          to="/admin/settings"
          class="flex items-center p-4 bg-white shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          <Cog6ToothIcon class="h-6 w-6 text-primary-600" />
          <span class="ml-3 text-gray-900">Settings</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div class="flow-root">
          <ul role="list" class="-mb-8">
            <li v-for="(activity, index) in recentActivity" :key="activity.id">
              <div class="relative pb-8">
                <span
                  v-if="index !== recentActivity.length - 1"
                  class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div class="relative flex space-x-3">
                  <div>
                    <span
                      :class="[
                        activity.type === 'comment' ? 'bg-blue-500' :
                        activity.type === 'assignment' ? 'bg-green-500' :
                        'bg-gray-400',
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                      ]"
                    >
                      <component
                        :is="activity.icon"
                        class="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p class="text-sm text-gray-500">
                        {{ activity.content }}
                      </p>
                    </div>
                    <div class="text-right text-sm whitespace-nowrap text-gray-500">
                      <time :datetime="activity.datetime">{{ activity.date }}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  UserCircleIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChatBubbleLeftIcon,
  DocumentPlusIcon,
  ListBulletIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

// Initialize data
const stats = ref([
  {
    name: 'Total Clients',
    value: '71',
    icon: UserCircleIcon,
    change: '12%',
    changeType: 'increase'
  },
  {
    name: 'Active Projects',
    value: '13',
    icon: DocumentTextIcon,
    change: '2',
    changeType: 'increase'
  },
  {
    name: 'Revenue',
    value: '$24,500',
    icon: CurrencyDollarIcon,
    change: '4.75%',
    changeType: 'increase'
  },
  {
    name: 'Conversion Rate',
    value: '24.57%',
    icon: ChartBarIcon,
    change: '3.2%',
    changeType: 'decrease'
  }
])

const recentActivity = ref([
  {
    id: 1,
    type: 'comment',
    content: 'New blog post published: "AI-Powered Development Workflow"',
    date: '3 hours ago',
    datetime: '2024-12-12T15:00:00',
    icon: ChatBubbleLeftIcon
  },
  {
    id: 2,
    type: 'assignment',
    content: 'New client onboarded: TechCorp Solutions',
    date: '8 hours ago',
    datetime: '2024-12-12T10:00:00',
    icon: UserCircleIcon
  }
])

// Add console logs for debugging
onMounted(() => {
  console.log('Dashboard mounted')
  console.log('Stats:', stats.value)
  console.log('Recent Activity:', recentActivity.value)
})
</script>
