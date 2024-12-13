<template>
  <div>
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage your account settings and preferences.
        </p>
      </div>
    </div>

    <!-- Profile Settings -->
    <div class="mt-8 bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Profile Settings</h3>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" v-model="profile.name" 
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
          </div>
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" v-model="profile.email" 
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
          </div>
          <div class="sm:col-span-3">
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select v-model="profile.role" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
        <div class="mt-6">
          <button @click="saveProfile" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Save Profile
          </button>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="mt-8 bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
        <div class="mt-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" v-model="security.currentPassword" 
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" v-model="security.newPassword" 
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" v-model="security.confirmPassword" 
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
          </div>
          <div class="flex items-center">
            <button @click="changePassword" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="mt-8 bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>
        <div class="mt-6 space-y-6">
          <div class="relative flex items-start">
            <div class="flex h-5 items-center">
              <input type="checkbox" v-model="notifications.email" 
                     class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500">
            </div>
            <div class="ml-3 text-sm">
              <label class="font-medium text-gray-700">Email Notifications</label>
              <p class="text-gray-500">Receive notifications about new applications and updates.</p>
            </div>
          </div>
          <div class="relative flex items-start">
            <div class="flex h-5 items-center">
              <input type="checkbox" v-model="notifications.browser" 
                     class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500">
            </div>
            <div class="ml-3 text-sm">
              <label class="font-medium text-gray-700">Browser Notifications</label>
              <p class="text-gray-500">Receive browser notifications when you're online.</p>
            </div>
          </div>
          <div class="flex items-center">
            <button @click="saveNotifications" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const profile = ref({
  name: authStore.user?.displayName || '',
  email: authStore.user?.email || '',
  role: 'admin'
})

const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notifications = ref({
  email: true,
  browser: false
})

const saveProfile = async () => {
  console.log('Saving profile:', profile.value)
  // Add your save logic here
}

const changePassword = async () => {
  if (security.value.newPassword !== security.value.confirmPassword) {
    alert('New passwords do not match')
    return
  }
  console.log('Changing password')
  // Add your password change logic here
}

const saveNotifications = async () => {
  console.log('Saving notification preferences:', notifications.value)
  // Add your save logic here
}
</script>
