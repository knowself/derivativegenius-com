<template>
  <div :class="{'dark': isDark}" class="min-h-screen">
    <!-- Admin Routes -->
    <router-view v-slot="{ Component }" v-if="isAdminRoute">
      <transition name="page" mode="out-in">
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </router-view>

    <!-- Public Routes -->
    <template v-else>
      <!-- Navigation -->
      <nav class="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-[145px]">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <router-link to="/" class="flex items-center">
                  <img class="h-[125px] w-auto" src="/images/DG-AAA.png" alt="Derivative Genius">
                </router-link>
              </div>
              <div class="flex ml-6 space-x-8 items-center">
                <router-link to="/services" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Services
                </router-link>
                <router-link to="/chatbots" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Chatbots
                </router-link>
                <router-link to="/articles" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Articles
                </router-link>
                <router-link to="/about" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About
                </router-link>
                <router-link to="/contact" class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact
                </router-link>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Dark Mode Toggle -->
              <button 
                @click="toggleDarkMode" 
                class="p-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label="Toggle dark mode"
              >
                <svg 
                  v-if="isDark"
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
                <svg 
                  v-else
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                  />
                </svg>
              </button>

              <!-- Auth Links -->
              <template v-if="!isAuthenticated">
                <router-link 
                  to="/login" 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </router-link>
              </template>
              <template v-else>
                <div class="relative">
                  <button
                    @click="showUserMenu = !showUserMenu"
                    class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span class="sr-only">Open user menu</span>
                    <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600">
                      <span class="text-sm font-medium leading-none text-white">
                        {{ userInitials }}
                      </span>
                    </span>
                  </button>
                  
                  <!-- User Menu -->
                  <div
                    v-if="showUserMenu"
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div class="py-1" role="none">
                      <router-link
                        v-if="isAdmin"
                        to="/admin"
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Admin Dashboard
                      </router-link>
                      <button
                        @click="handleSignOut"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
        <main>
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" :key="$route.fullPath" />
            </transition>
          </router-view>
        </main>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const isDark = ref(localStorage.getItem('theme') === 'dark')

// Update HTML class when dark mode changes
const updateHTMLClass = (dark) => {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Initialize auth state
onMounted(async () => {
  await authStore.initializeAuth()
  updateHTMLClass(isDark.value)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  authStore.cleanup()
})

// Auth state
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.currentUser)
const userInitials = computed(() => {
  const name = user.value?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

// Route state
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

function toggleDarkMode() {
  isDark.value = !isDark.value
}

// Watch for auth state changes
watch([isAuthenticated, isAdmin], ([newAuth, newAdmin], [oldAuth, oldAdmin]) => {
  if (!newAuth && oldAuth) {
    // User was logged out
    if (route.meta.requiresAuth || route.meta.requiresAdmin) {
      router.push('/login')
    }
  }
})

async function handleSignOut() {
  try {
    await authStore.signOut()
    showUserMenu.value = false
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

// Save dark mode preference and update HTML class
watch(isDark, (newDark) => {
  localStorage.setItem('theme', newDark ? 'dark' : 'light')
  updateHTMLClass(newDark)
})

// Close user menu when clicking outside
function handleClickOutside(event) {
  const userMenu = document.getElementById('user-menu')
  if (userMenu && !userMenu.contains(event.target)) {
    showUserMenu.value = false
  }
}
</script>

<style>
/* Transition Animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Dark Mode Transitions */
.dark .transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #4f46e5;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4338ca;
}

/* Global Focus Styles */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* Base Styles */
body {
  @apply antialiased;
}

.dark body {
  @apply bg-gray-900 text-white;
}
</style>
