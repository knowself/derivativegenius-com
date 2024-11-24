<template>
  <!-- Hero Section -->
  <div class="relative bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
        <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div class="sm:text-center lg:text-left">
            <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span class="block">Automate & Transform</span>
              <span class="block text-indigo-600">Your Business with AI</span>
            </h1>
            <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Derivative Genius is an AI Automation Agency (AAA) that transforms businesses through intelligent automation. We harness cutting-edge AI tools to automate workflows, streamline operations, and create scalable solutions.
            </p>
            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div class="rounded-md shadow">
                <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Get Started
                </a>
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-3">
                <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                  View Solutions
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>

  <!-- Services Section -->
  <div class="pt-32 pb-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 id="services" class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Services</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Intelligent Automation Solutions
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Transform your business with cutting-edge AI automation tools and expert implementation.
        </p>
      </div>

      <div class="mt-10 feature-grid">
        <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
          <div v-for="service in services" :key="service.title" class="relative">
            <dt>
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.icon" />
                </svg>
              </div>
              <p class="ml-16 text-lg leading-6 font-medium text-gray-900">{{ service.title }}</p>
            </dt>
            <dd class="mt-2 ml-16 text-base text-gray-500">{{ service.description }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>

  <!-- Articles Section -->
  <div id="articles" class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Resources</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Automation Insights
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Discover how AI automation is transforming businesses across industries.
        </p>
      </div>
      <!-- Article grid would go here -->
    </div>
  </div>

  <!-- Contact Section -->
  <div id="contact" class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Contact Us</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Start Your Automation Journey
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Let's discuss how we can transform your business with intelligent automation solutions.
        </p>
      </div>
      <!-- Contact form would go here -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'HomePage'
})

const services = ref([
  {
    title: 'Custom AI Automation',
    description: 'Tailored automation solutions designed specifically for your business needs and workflows.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    title: 'Workflow Optimization',
    description: 'Streamline your operations with intelligent process automation and workflow integration.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    title: 'AI Implementation',
    description: 'Expert implementation of cutting-edge AI tools with comprehensive training and support.',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
  },
  {
    title: 'Process Consulting',
    description: 'Strategic guidance for your automation journey with proven methodologies and best practices.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  }
])
</script>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
</style>
