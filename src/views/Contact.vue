<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-base font-semibold text-yellow-400 tracking-wide uppercase animate-fade-in-up">Contact Us</h2>
        <p class="mt-1 text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl animate-fade-in-up-delay">
          Get in Touch
        </p>
        <p class="max-w-xl mt-5 mx-auto text-xl text-gray-300 animate-fade-in-up-delay-2">
          Have questions about our platform? Want to learn more about how we can help your business? We'd love to hear from you.
        </p>
      </div>

      <div class="relative max-w-4xl mx-auto">
        <!-- Background decorative elements -->
        <div class="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-purple-400/10 rounded-2xl transform -rotate-6 scale-105"></div>
        <div class="absolute inset-0 bg-gradient-to-l from-yellow-400/10 to-purple-400/10 rounded-2xl transform rotate-3 scale-105"></div>
        
        <!-- Main content container -->
        <div class="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-5">
            <!-- Contact information -->
            <div class="relative lg:col-span-2 px-6 py-10 sm:px-10 bg-gradient-to-br from-indigo-600/90 to-purple-600/90 backdrop-blur">
              <div class="h-full flex flex-col justify-between">
                <div>
                  <h3 class="text-lg font-medium text-white mb-8">Contact information</h3>
                  <p class="text-base text-gray-300 max-w-3xl mb-12">
                    Our team is here to help. Fill out the form and we'll get back to you within 24 hours.
                  </p>
                  
                  <dl class="space-y-8">
                    <div class="flex items-center space-x-4 text-gray-200 hover:text-white transition-colors">
                      <svg class="flex-shrink-0 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>(310) 379-9822</span>
                    </div>
                    
                    <div class="flex items-center space-x-4 text-gray-200 hover:text-white transition-colors">
                      <svg class="flex-shrink-0 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Joe@DerivativeGenius.com</span>
                    </div>
                    
                    <div class="flex items-start space-x-4 text-gray-200 hover:text-white transition-colors">
                      <svg class="flex-shrink-0 w-6 h-6 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p>2629 Manhattan Avenue</p>
                        <p>Suite 199</p>
                        <p>Hermosa Beach, CA 90254</p>
                      </div>
                    </div>
                  </dl>
                </div>
                
                <!-- Social links could go here -->
              </div>
            </div>

            <!-- Contact form -->
            <div class="lg:col-span-3 px-6 py-10 sm:px-10 bg-white/5 backdrop-blur">
              <form @submit.prevent="submitForm" class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-200">Name</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      name="name" 
                      id="name" 
                      v-model="form.name"
                      autocomplete="name" 
                      :class="[
                        'block w-full bg-white/10 border-0 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-400 py-3 px-4 shadow-sm backdrop-blur-sm transition-all',
                        errors.name ? 'ring-2 ring-red-400' : ''
                      ]"
                    >
                    <p v-if="errors.name" class="mt-2 text-sm text-red-400">{{ errors.name }}</p>
                  </div>
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-200">Email</label>
                  <div class="mt-1">
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      v-model="form.email"
                      autocomplete="email" 
                      :class="[
                        'block w-full bg-white/10 border-0 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-400 py-3 px-4 shadow-sm backdrop-blur-sm transition-all',
                        errors.email ? 'ring-2 ring-red-400' : ''
                      ]"
                    >
                    <p v-if="errors.email" class="mt-2 text-sm text-red-400">{{ errors.email }}</p>
                  </div>
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-200">
                    Phone Number <span class="text-gray-400">(optional)</span>
                  </label>
                  <div class="mt-1">
                    <input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      v-model="form.phone"
                      @input="handlePhoneInput"
                      autocomplete="tel" 
                      placeholder="(555) 555-5555"
                      :class="[
                        'block w-full bg-white/10 border-0 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-400 py-3 px-4 shadow-sm backdrop-blur-sm transition-all',
                        errors.phone ? 'ring-2 ring-red-400' : ''
                      ]"
                    >
                    <p v-if="errors.phone" class="mt-2 text-sm text-red-400">{{ errors.phone }}</p>
                  </div>
                </div>

                <div>
                  <label for="message" class="block text-sm font-medium text-gray-200">Message</label>
                  <div class="mt-1">
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="4" 
                      v-model="form.message"
                      :class="[
                        'block w-full bg-white/10 border-0 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-400 py-3 px-4 shadow-sm backdrop-blur-sm transition-all',
                        errors.message ? 'ring-2 ring-red-400' : ''
                      ]"
                    ></textarea>
                    <p v-if="errors.message" class="mt-2 text-sm text-red-400">{{ errors.message }}</p>
                  </div>
                </div>

                <!-- Status Message -->
                <div v-if="submitStatus" class="rounded-lg p-4" :class="[
                  submitStatus.type === 'success' ? 'bg-green-400/20 text-green-200' : 'bg-red-400/20 text-red-200'
                ]">
                  <p class="text-sm">{{ submitStatus.message }}</p>
                </div>

                <div>
                  <button 
                    type="submit" 
                    :disabled="loading"
                    class="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                  >
                    <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="ContactPageView">
import { ref } from 'vue'
import DynamicBackground from '@/components/DynamicBackground.vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})
const loading = ref(false)
const error = ref(null)
const success = ref(false)
const errors = ref({})
const submitStatus = ref(null)

// Phone number formatting
const formatPhoneNumber = (value) => {
  if (!value) return value
  const phoneNumber = value.replace(/[^\d]/g, '')
  if (phoneNumber.length < 4) return phoneNumber
  if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

const handlePhoneInput = (event) => {
  let value = event.target.value.replace(/[^\d]/g, '')
  if (value.length > 10) value = value.slice(0, 10)
  form.value.phone = formatPhoneNumber(value)
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
  }
  
  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email'
  }
  
  if (form.value.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(form.value.phone)) {
    errors.value.phone = 'Please enter a valid phone number'
  }
  
  if (!form.value.message.trim()) {
    errors.value.message = 'Message is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return
  
  loading.value = true
  submitStatus.value = null
  
  try {
    const response = await fetch('https://us-west1-derivative-genius-website.cloudfunctions.net/sendContactEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        phone: form.value.phone.trim(),
        message: form.value.message.trim()
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message')
    }
    
    submitStatus.value = {
      type: 'success',
      message: data.message || 'Thank you for your message! We will get back to you soon.'
    }
    
    // Clear form
    form.value.name = ''
    form.value.email = ''
    form.value.phone = ''
    form.value.message = ''
    
  } catch (err) {
    console.error('Error submitting form:', err)
    submitStatus.value = {
      type: 'error',
      message: err.message === 'Failed to fetch' 
        ? 'Unable to connect to the server. Please check your internet connection and try again.'
        : err.message || 'Sorry, there was an error sending your message. Please try again later.'
    }
  } finally {
    loading.value = false
  }
}
</script>
