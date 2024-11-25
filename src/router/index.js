import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import HomePage from '../views/Home.vue'
import LoginPage from '../views/Login.vue'
import AdminAnalytics from '../views/admin/Analytics.vue'
import AdminSettings from '../views/admin/Settings.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import Clients from '../views/admin/Clients.vue'
import Applications from '../views/admin/Applications.vue'
import { debug } from '@/utils/debug'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/Articles.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/admin',
    name: 'admin',
    component: Dashboard,
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'analytics',
        name: 'admin-analytics',
        component: AdminAnalytics,
        meta: { requiresAdmin: true }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: AdminSettings,
        meta: { requiresAdmin: true }
      },
      {
        path: 'clients',
        name: 'admin-clients',
        component: Clients,
        meta: { requiresAdmin: true }
      },
      {
        path: 'applications',
        name: 'admin-applications',
        component: Applications,
        meta: { requiresAdmin: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    debug.info('Navigation from:', from.path, 'to:', to.path)
    if (savedPosition) {
      debug.info('Restoring scroll position:', savedPosition)
      return savedPosition
    }
    if (to.hash) {
      debug.info('Scrolling to hash:', to.hash)
      return {
        el: to.hash,
        top: 20,
        behavior: 'smooth'
      }
    }
    debug.info('Scrolling to top')
    return { top: 0 }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  debug.info('Navigation started:', {
    from: from.fullPath,
    to: to.fullPath,
    timestamp: new Date().toISOString()
  })
  try {
    const authStore = useAuthStore()
    
    // Wait for auth initialization if loading
    if (authStore.loading) {
      await new Promise(resolve => {
        const unwatch = watch(
          () => authStore.loading,
          (loading) => {
            if (!loading) {
              unwatch()
              resolve()
            }
          }
        )
      })
    }

    // Handle admin route protection
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!authStore.isAuthenticated) {
        // Not logged in, redirect to login page with return url
        next({
          name: 'login',
          query: { redirect: to.fullPath }
        })
      } else if (!authStore.isAdmin) {
        // Logged in but not admin, redirect to home
        console.warn('Unauthorized access attempt to admin route:', to.fullPath)
        next({ name: 'home' })
      } else {
        // Is admin, proceed
        next()
      }
    } else {
      // Not an admin route, proceed
      next()
    }
  } catch (error) {
    console.error('Router navigation error:', error)
    next({ name: 'home' })
  }
})

router.afterEach((to, from) => {
  debug.info('Navigation completed:', {
    from: from.fullPath,
    to: to.fullPath,
    duration: performance.now(),
    timestamp: new Date().toISOString()
  })
})

// Global error handler
router.onError((error) => {
  debug.error('Navigation error:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  })
})

export default router