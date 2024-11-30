<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50">
    <!-- Hero section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-r from-primary-200 to-accent-100"></div>
      <div class="max-w-7xl mx-auto">
        <div class="relative sm:overflow-hidden">
          <div class="relative px-4 pb-4 pt-8 sm:px-6 sm:pb-6 sm:pt-12">
            <h1 class="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span class="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">About Derivative Genius</span>
            </h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="relative overflow-hidden">
      <div class="relative px-4 sm:px-6 lg:px-8">
        <div class="prose prose-lg max-w-prose mx-auto bg-white rounded-xl shadow-xl p-8 border-2 border-primary-400 hover:border-primary-500 transition-colors">
          <p class="text-xl text-primary-900 leading-8 mb-6 font-semibold">
            We are all standing on the shoulders of giants. Living in a time when we, each of us, can utilize all the intellectual tools ever conceived by humankind.
          </p>
          <p class="text-lg text-primary-800 leading-relaxed">
            All of us are revolutionizing our businesses and industries with cutting-edge AI tools and techniques and Derivative Genius is here to help.
          </p>
        </div>

        <!-- Visual elements -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div class="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-lg font-semibold text-white mb-3">Innovation</h3>
            <p class="text-primary-50">Leveraging cutting-edge AI tools to transform businesses</p>
          </div>
          <div class="bg-gradient-to-br from-accent-500 to-accent-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-lg font-semibold text-white mb-3">Expertise</h3>
            <p class="text-accent-50">Building on the foundations of proven technologies</p>
          </div>
          <div class="bg-gradient-to-br from-secondary-500 to-secondary-600 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 class="text-lg font-semibold text-white mb-3">Partnership</h3>
            <p class="text-secondary-50">Working together to achieve revolutionary results</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="AboutPage">
import { ref } from 'vue'
</script>
