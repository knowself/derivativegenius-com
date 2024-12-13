<template>
  <div>
    <!-- Static sidebar for desktop -->
    <div class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div class="flex min-h-0 flex-1 flex-col bg-gray-800">
        <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div class="flex flex-shrink-0 items-center px-4">
            <h1 class="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <nav class="mt-5 flex-1 space-y-1 px-2">
            <router-link
              to="/admin"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path === '/admin'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
            >
              <HomeIcon class="mr-3 h-6 w-6 flex-shrink-0" />
              Dashboard
            </router-link>

            <router-link
              to="/admin/analytics"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path.startsWith('/admin/analytics')
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
            >
              <ChartBarIcon class="mr-3 h-6 w-6 flex-shrink-0" />
              Analytics
            </router-link>

            <router-link
              to="/admin/blog"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path.startsWith('/admin/blog')
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
            >
              <DocumentTextIcon class="mr-3 h-6 w-6 flex-shrink-0" />
              Blog Posts
            </router-link>

            <router-link
              to="/admin/applications"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path === '/admin/applications'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
            >
              <WindowIcon class="mr-3 h-6 w-6 flex-shrink-0" />
              Applications
            </router-link>

            <router-link
              to="/admin/settings"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path === '/admin/settings'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              ]"
            >
              <Cog6ToothIcon class="mr-3 h-6 w-6 flex-shrink-0" />
              Settings
            </router-link>
          </nav>
        </div>
        <div class="flex flex-shrink-0 bg-gray-700 p-4">
          <div class="group block w-full flex-shrink-0">
            <div class="flex items-center">
              <div>
                <UserCircleIcon class="inline-block h-9 w-9 rounded-full text-gray-300" />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-white">{{ user?.name || 'Admin User' }}</p>
                <button
                  @click="logout"
                  class="text-xs font-medium text-gray-300 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="fixed inset-0 z-40 flex">
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="closeMobileMenu"></div>

        <div class="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              @click="closeMobileMenu"
            >
              <span class="sr-only">Close sidebar</span>
              <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
            <div class="flex flex-shrink-0 items-center px-4">
              <h1 class="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <nav class="mt-5 space-y-1 px-2">
              <!-- Same navigation links as desktop -->
              <router-link
                to="/admin"
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
                :class="[
                  $route.path === '/admin'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                ]"
                @click="closeMobileMenu"
              >
                <HomeIcon class="mr-4 h-6 w-6 flex-shrink-0" />
                Dashboard
              </router-link>

              <router-link
                to="/admin/analytics"
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
                :class="[
                  $route.path.startsWith('/admin/analytics')
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                ]"
                @click="closeMobileMenu"
              >
                <ChartBarIcon class="mr-4 h-6 w-6 flex-shrink-0" />
                Analytics
              </router-link>

              <router-link
                to="/admin/blog"
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
                :class="[
                  $route.path.startsWith('/admin/blog')
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                ]"
                @click="closeMobileMenu"
              >
                <DocumentTextIcon class="mr-4 h-6 w-6 flex-shrink-0" />
                Blog Posts
              </router-link>

              <router-link
                to="/admin/applications"
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
                :class="[
                  $route.path === '/admin/applications'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                ]"
                @click="closeMobileMenu"
              >
                <WindowIcon class="mr-4 h-6 w-6 flex-shrink-0" />
                Applications
              </router-link>

              <router-link
                to="/admin/settings"
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
                :class="[
                  $route.path === '/admin/settings'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                ]"
                @click="closeMobileMenu"
              >
                <Cog6ToothIcon class="mr-4 h-6 w-6 flex-shrink-0" />
                Settings
              </router-link>
            </nav>
          </div>

          <div class="flex flex-shrink-0 bg-gray-700 p-4">
            <div class="group block w-full flex-shrink-0">
              <div class="flex items-center">
                <div>
                  <UserCircleIcon class="inline-block h-9 w-9 rounded-full text-gray-300" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-white">{{ user?.name || 'Admin User' }}</p>
                  <button
                    @click="logout; closeMobileMenu()"
                    class="text-xs font-medium text-gray-300 hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import {
  HomeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  WindowIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const user = computed(() => authStore.currentUser)

const openMobileMenu = () => {
  mobileMenuOpen.value = true
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const logout = async () => {
  try {
    await authStore.signOut()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style>
.router-link-active {
  background-color: rgb(17, 24, 39);
  color: white;
}
</style>
