import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { inject as injectAnalytics } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

// Initialize Vercel Analytics and Speed Insights
injectAnalytics()
injectSpeedInsights()

// Initialize app
const app = createApp(App)

// Initialize Pinia store
const pinia = createPinia()
app.use(pinia)

// Initialize router
app.use(router)

// Mount app
app.mount('#app')
