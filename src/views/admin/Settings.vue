<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>

    <!-- Profile Settings -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" v-model="profile.name" 
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" v-model="profile.email" 
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Role</label>
          <select v-model="profile.role" 
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
      <div class="space-y-4">
        <div class="flex items-center">
          <input type="checkbox" v-model="notifications.email" 
                 class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
          <label class="ml-2 block text-sm text-gray-900">Email Notifications</label>
        </div>
        <div class="flex items-center">
          <input type="checkbox" v-model="notifications.push" 
                 class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
          <label class="ml-2 block text-sm text-gray-900">Push Notifications</label>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="bg-white shadow-sm rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Current Password</label>
          <input type="password" v-model="security.currentPassword" 
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">New Password</label>
          <input type="password" v-model="security.newPassword" 
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input type="password" v-model="security.confirmPassword" 
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-6">
      <button @click="saveSettings" 
              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'AdminSettingsPage'
})

const profile = ref({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
})

const notifications = ref({
  email: true,
  push: false
})

const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const saveSettings = () => {
  // TODO: Implement settings save functionality
  console.log('Saving settings...')
  console.log('Profile:', profile.value)
  console.log('Notifications:', notifications.value)
  console.log('Security:', security.value)
}
</script>
