<template>
  <div :class="{'dark': isDark}" class="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
    <!-- Navigation -->
    <nav v-if="!isAdminRoute" class="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
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
            <template v-if="!authStore.isAuthenticated">
              <router-link to="/login" class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </router-link>
            </template>
            <template v-else>
              <router-link v-if="authStore.isAdmin" to="/admin" class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mr-4">
                Admin Dashboard
              </router-link>
              <button @click="handleSignOut" class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <transition name="page" mode="out-in">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </transition>
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div class="flex justify-center space-x-6 md:order-2">
          <a href="#" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
            <span class="sr-only">Twitter</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
            <span class="sr-only">LinkedIn</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
        <div class="mt-8 md:mt-0 md:order-1">
          <p class="text-center text-base text-gray-400 dark:text-gray-500">
            &copy; 2024 Derivative Genius. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup name="MainApp">
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, computed, watch, ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const isAdminRoute = computed(() => {
  return router.currentRoute.value.path.startsWith('/admin')
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

const isDark = ref(false)

function toggleDarkMode() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}

// Watch for auth state changes
watch([isAuthenticated, isAdmin], ([newAuth, newAdmin], [oldAuth, oldAdmin]) => {
  if (!newAuth && oldAuth) {
    // User was logged out
    router.push('/login')
  } else if (newAuth && newAdmin && !isAdminRoute.value) {
    // Admin user should be redirected to admin panel
    router.push('/admin')
  }
})

onMounted(async () => {
  try {
    await authStore.initializeAuth();
  } catch (error) {
    console.error('Error initializing auth:', error);
    // Ensure we redirect to login if auth fails
    if (router.currentRoute.value.meta.requiresAuth) {
      router.push('/login');
    }
  }
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

onUnmounted(() => {
  authStore.cleanup()
})

async function handleSignOut() {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

watch(isDark, (newDark) => {
  localStorage.setItem('theme', newDark ? 'dark' : 'light')
})
</script>

<script>
import { debug } from '@/utils/debug'

export default {
  name: 'MainApp',
  errorCaptured(err, vm, info) {
    debug.error('ErrorBoundary:', {
      error: err.message,
      component: vm.$options.name || 'Anonymous',
      info,
      stack: err.stack,
      timestamp: new Date().toISOString()
    })
    // Log to our monitoring service
    debug.error('Full error details:', {
      error: err,
      componentTree: this._getComponentTree(vm),
      timestamp: new Date().toISOString()
    })
    return false // Prevent error from propagating
  },
  methods: {
    _getComponentTree(vm) {
      const tree = []
      while (vm) {
        tree.push(vm.$options.name || 'Anonymous')
        vm = vm.$parent
      }
      return tree.reverse()
    }
  }
}
</script>

<style>
html {
  scroll-behavior: smooth;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.dark {
  background-color: #2f2f2f;
  color: #fff;
}

.dark .bg-white {
  background-color: #333;
}

.dark .text-gray-700 {
  color: #fff;
}

.dark .text-gray-200 {
  color: #ccc;
}

.dark .text-gray-400 {
  color: #aaa;
}

.dark .text-gray-500 {
  color: #999;
}

.dark .text-gray-600 {
  color: #888;
}

.dark .text-gray-800 {
  color: #666;
}

.dark .text-gray-900 {
  color: #444;
}

.dark .hover:text-gray-700 {
  color: #fff;
}

.dark .hover:text-gray-200 {
  color: #ccc;
}

.dark .hover:text-gray-400 {
  color: #aaa;
}

.dark .hover:text-gray-500 {
  color: #999;
}

.dark .hover:text-gray-600 {
  color: #888;
}

.dark .hover:text-gray-800 {
  color: #666;
}

.dark .hover:text-gray-900 {
  color: #444;
}
</style>
