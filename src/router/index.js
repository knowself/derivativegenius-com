import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '../store/auth'
import { debug } from '../utils/debug'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import(/* webpackChunkName: "articles" */ '../views/Articles.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import(/* webpackChunkName: "contact" */ '../views/Contact.vue')
  },
  {
    path: '/services',
    name: 'services',
    component: () => import(/* webpackChunkName: "services" */ '../views/Services.vue')
  },
  // Chatbots routes
  {
    path: '/chatbots',
    name: 'chatbots',
    component: () => import(/* webpackChunkName: "chatbots" */ '../views/ChatbotIndustry.vue')
  },
  {
    path: '/chatbots/technology',
    name: 'chatbots-technology',
    component: () => import(/* webpackChunkName: "chatbots-technology" */ '../views/chatbots/Technology.vue')
  },
  {
    path: '/chatbots/real-estate',
    name: 'chatbots-real-estate',
    component: () => import(/* webpackChunkName: "chatbots-real-estate" */ '../views/chatbots/RealEstate.vue')
  },
  {
    path: '/chatbots/education',
    name: 'chatbots-education',
    component: () => import(/* webpackChunkName: "chatbots-education" */ '../views/chatbots/Education.vue')
  },
  {
    path: '/chatbots/local',
    name: 'chatbots-local',
    component: () => import(/* webpackChunkName: "chatbots-local" */ '../views/chatbots/LocalBusiness.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/admin/Dashboard.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'analytics',
        name: 'admin-analytics',
        component: () => import(/* webpackChunkName: "analytics" */ '../views/admin/Analytics.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import(/* webpackChunkName: "settings" */ '../views/admin/Settings.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'clients',
        name: 'admin-clients',
        component: () => import(/* webpackChunkName: "clients" */ '../views/admin/Clients.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'applications',
        name: 'admin-applications',
        component: () => import(/* webpackChunkName: "applications" */ '../views/admin/Applications.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
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
      debug.info('Admin route detected:', {
        route: to.fullPath,
        isAuthenticated: authStore.isAuthenticated,
        isAdmin: authStore.isAdmin,
        user: authStore.user
      })
      
      if (!authStore.isAuthenticated) {
        debug.warn('Admin route access denied: Not authenticated')
        // Not logged in, redirect to login page with return url
        next({
          name: 'login',
          query: { redirect: to.fullPath }
        })
      } else if (!authStore.isAdmin) {
        // Logged in but not admin, redirect to home
        debug.warn('Admin route access denied: Not admin', {
          user: authStore.user,
          isAdmin: authStore.isAdmin
        })
        next({ name: 'home' })
      } else {
        // Is admin, proceed
        debug.info('Admin route access granted')
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
