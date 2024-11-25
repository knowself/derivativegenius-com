import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

// Initialize app
const app = createApp(App)

// Initialize Pinia store
const pinia = createPinia()
app.use(pinia)

// Initialize router
app.use(router)

// Mount app
app.mount('#app')

// Initialize Firebase lazily
if (process.env.NODE_ENV === 'production') {
  import('./firebase').then(module => {
    module.initializeApp()
  })
} else {
  import('./firebase').then(module => {
    module.initializeApp()
    console.log('Firebase initialized in development mode')
  })
}
