<!-- Admin Layout -->
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile menu button -->
    <div class="fixed top-0 left-0 z-40 md:hidden">
      <button
        type="button"
        class="px-4 py-3 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        @click="openMobileMenu"
      >
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="h-6 w-6" />
      </button>
    </div>

    <!-- Navigation -->
    <AdminNavigation />

    <!-- Main content -->
    <div class="md:pl-64">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Debug info -->
        <div v-if="debug" class="mb-4 p-4 bg-yellow-100 rounded-lg">
          <p>Route: {{ $route.path }}</p>
          <p>Auth: {{ isAuthenticated }}</p>
          <p>Admin: {{ isAdmin }}</p>
        </div>

        <!-- Page content -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import AdminNavigation from '@/components/admin/Navigation.vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'

const route = useRoute()
const authStore = useAuthStore()
const debug = ref(true)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

const openMobileMenu = () => {
  // This will be handled by the Navigation component
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
