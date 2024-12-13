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
    component: () => import(/* webpackChunkName: "chatbots" */ '../views/Chatbots.vue')
  },
  {
    path: '/chatbot-details/:id',
    name: 'chatbot-details',
    component: () => import(/* webpackChunkName: "chatbot-details" */ '../views/ChatbotDetails.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import(/* webpackChunkName: "admin-dashboard" */ '../views/admin/Dashboard.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'analytics',
        name: 'admin-analytics',
        component: () => import(/* webpackChunkName: "admin-analytics" */ '../views/admin/Analytics.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'applications',
        name: 'admin-applications',
        component: () => import(/* webpackChunkName: "admin-applications" */ '../views/admin/Applications.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'blog',
        name: 'admin-blog',
        component: () => import(/* webpackChunkName: "admin-blog" */ '../views/admin/blog/BlogList.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'blog/new',
        name: 'admin-blog-new',
        component: () => import(/* webpackChunkName: "admin-blog-editor" */ '../views/admin/BlogEditor.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'blog/edit/:id',
        name: 'admin-blog-edit',
        component: () => import(/* webpackChunkName: "admin-blog-editor" */ '../views/admin/BlogEditor.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'blog/preview/:id',
        name: 'admin-blog-preview',
        component: () => import(/* webpackChunkName: "admin-blog-preview" */ '../views/admin/BlogPreview.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import(/* webpackChunkName: "admin-settings" */ '../views/admin/Settings.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "not-found" */ '../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  console.log('[Router] Navigation to:', to.path)
  const authStore = useAuthStore()
  
  // Keep admin users in admin section except for logout
  if (authStore.isAdmin && !to.path.startsWith('/admin') && to.path !== '/login') {
    console.log('[Router] Admin user accessing non-admin route, redirecting to admin')
    next({ path: '/admin' })
    return
  }

  // Check if route requires admin access
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    console.log('[Router] Route requires admin access')
    
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      console.log('[Router] User not authenticated, redirecting to login')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Check if user has admin role
    if (!authStore.isAdmin) {
      console.log('[Router] User not admin, redirecting to home')
      next({ path: '/' })
      return
    }
  }

  // Handle login page access when already authenticated
  if (to.path === '/login' && authStore.isAuthenticated) {
    next({ path: '/admin' })
    return
  }
  
  next()
})

export default router
