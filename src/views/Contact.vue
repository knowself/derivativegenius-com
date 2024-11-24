<template>
  <div class="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center">
        <h2 class="text-base font-semibold text-indigo-600 tracking-wide uppercase">Contact Us</h2>
        <p class="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">Get in Touch</p>
        <p class="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Have questions about our platform? Want to learn more about how we can help your business? We'd love to hear from you.
        </p>
      </div>

      <div class="mt-12">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <!-- Contact Form -->
          <div class="relative bg-white shadow-xl rounded-lg">
            <h2 class="sr-only">Contact us</h2>

            <div class="grid grid-cols-1">
              <!-- Contact information -->
              <div class="relative overflow-hidden py-10 px-6 bg-indigo-700 sm:px-10 xl:p-12">
                <div class="absolute inset-0 pointer-events-none sm:hidden" aria-hidden="true">
                  <svg class="absolute inset-0 w-full h-full" width="343" height="388" viewBox="0 0 343 388" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z" fill="url(#linear1)" fill-opacity=".1" />
                    <defs>
                      <linearGradient id="linear1" x1="254.553" y1="107.554" x2="961.66" y2="814.66" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#fff"></stop>
                        <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div class="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none sm:block lg:hidden" aria-hidden="true">
                  <svg class="absolute inset-0 w-full h-full" width="359" height="339" viewBox="0 0 359 339" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z" fill="url(#linear2)" fill-opacity=".1" />
                    <defs>
                      <linearGradient id="linear2" x1="192.553" y1="28.553" x2="899.66" y2="735.66" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#fff"></stop>
                        <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <h3 class="text-lg font-medium text-white">Contact information</h3>
                <p class="mt-6 text-base text-indigo-50 max-w-3xl">
                  Our team is here to help. Fill out the form and we'll get back to you within 24 hours.
                </p>
                <dl class="mt-8 space-y-6">
                  <dt><span class="sr-only">Phone number</span></dt>
                  <dd class="flex text-base text-indigo-50">
                    <svg class="flex-shrink-0 w-6 h-6 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span class="ml-3">+1 (555) 123-4567</span>
                  </dd>
                  <dt><span class="sr-only">Email</span></dt>
                  <dd class="flex text-base text-indigo-50">
                    <svg class="flex-shrink-0 w-6 h-6 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="ml-3">contact@derivativegenius.com</span>
                  </dd>
                </dl>
              </div>

              <!-- Contact form -->
              <div class="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12">
                <form @submit.prevent="handleSubmit" class="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <div class="sm:col-span-2">
                    <label for="name" class="block text-sm font-medium text-gray-900">Name</label>
                    <div class="mt-1">
                      <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        v-model="form.name"
                        autocomplete="name" 
                        class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                      >
                    </div>
                  </div>
                  <div class="sm:col-span-2">
                    <label for="email" class="block text-sm font-medium text-gray-900">Email</label>
                    <div class="mt-1">
                      <input 
                        id="email" 
                        name="email" 
                        type="email" 
                        v-model="form.email"
                        autocomplete="email" 
                        class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                      >
                    </div>
                  </div>
                  <div class="sm:col-span-2">
                    <label for="message" class="block text-sm font-medium text-gray-900">Message</label>
                    <div class="mt-1">
                      <textarea 
                        id="message" 
                        name="message" 
                        rows="4" 
                        v-model="form.message"
                        class="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                      ></textarea>
                    </div>
                  </div>
                  <div class="sm:col-span-2">
                    <button 
                      type="submit" 
                      class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Company Information -->
          <div class="bg-white shadow-xl rounded-lg overflow-hidden">
            <div class="relative h-[400px]">
              <img class="absolute inset-0 h-full w-full object-cover" src="/images/office.jpg" alt="Our office">
              <div class="absolute inset-0 bg-indigo-700 mix-blend-multiply"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-indigo-600 via-indigo-600 opacity-90"></div>
              <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Visit Us</h1>
                <p class="mt-6 text-xl text-indigo-100 max-w-3xl">
                  We're located in the heart of Silicon Valley, where innovation meets business intelligence.
                </p>
              </div>
            </div>
            <div class="px-6 py-8">
              <h3 class="text-lg font-medium text-gray-900">Office Location</h3>
              <address class="mt-4 not-italic">
                <p class="text-gray-500">123 Innovation Drive</p>
                <p class="text-gray-500">Suite 200</p>
                <p class="text-gray-500">San Francisco, CA 94107</p>
              </address>
              <div class="mt-8">
                <h3 class="text-lg font-medium text-gray-900">Business Hours</h3>
                <div class="mt-4 space-y-2">
                  <p class="text-gray-500">Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  <p class="text-gray-500">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'ContactPage'
})

const form = ref({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = async () => {
  // Here you would typically send the form data to your backend
  console.log('Form submitted:', form.value)
  // Reset form after submission
  form.value = {
    name: '',
    email: '',
    message: ''
  }
}
</script>
