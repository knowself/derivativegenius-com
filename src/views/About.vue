<template>
  <div class="bg-white">
    <!-- Hero section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"></div>
      <div class="max-w-7xl mx-auto">
        <div class="relative shadow-xl sm:overflow-hidden">
          <div class="absolute inset-0">
            <img class="h-full w-full object-cover" src="/images/about-hero.jpg" alt="People working on laptops">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-700 mix-blend-multiply"></div>
          </div>
          <div class="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
            <h1 class="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span class="block text-white">About Derivative Genius</span>
            </h1>
            <p class="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl">
              Empowering businesses with intelligent analytics and data-driven insights
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mission section -->
    <div class="relative py-16 bg-white overflow-hidden">
      <div class="relative px-4 sm:px-6 lg:px-8">
        <div class="text-lg max-w-prose mx-auto">
          <h2>
            <span class="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">Our Mission</span>
            <span class="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Transforming Business Intelligence
            </span>
          </h2>
          <p class="mt-8 text-xl text-gray-500 leading-8">
            At Derivative Genius, we believe that every business deserves access to powerful analytics and insights. Our mission is to democratize business intelligence by providing small and medium-sized businesses with enterprise-grade analytics tools that are both powerful and easy to use.
          </p>
        </div>
        <div class="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
          <p>
            Founded in 2024, we've been at the forefront of combining artificial intelligence with business analytics to create solutions that drive real value for our clients. Our team of experts brings together decades of experience in data science, business intelligence, and software development.
          </p>
          <p>
            We're committed to helping businesses make better decisions through data-driven insights. Our platform provides real-time analytics, predictive modeling, and automated reporting tools that help businesses understand their performance, identify opportunities, and make informed decisions.
          </p>
        </div>
      </div>
    </div>

    <!-- Team section -->
    <div class="bg-white">
      <div class="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div class="space-y-12">
          <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Meet our leadership</h2>
          <ul role="list" class="space-y-12 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 lg:gap-y-12 lg:space-y-0">
            <li v-for="person in team" :key="person.name">
              <div class="space-y-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0 lg:gap-8">
                <div class="h-0 aspect-w-3 aspect-h-2 sm:aspect-w-3 sm:aspect-h-4">
                  <img class="object-cover shadow-lg rounded-lg" :src="person.imageUrl" :alt="person.name">
                </div>
                <div class="sm:col-span-2">
                  <div class="space-y-4">
                    <div class="text-lg leading-6 font-medium space-y-1">
                      <h3>{{ person.name }}</h3>
                      <p class="text-indigo-600">{{ person.role }}</p>
                    </div>
                    <div class="text-lg">
                      <p class="text-gray-500">{{ person.bio }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'AboutPage'
})

const team = ref([
  {
    name: 'Jane Cooper',
    role: 'CEO & Founder',
    bio: 'With over 15 years of experience in business analytics and AI, Jane leads our vision of democratizing business intelligence.',
    imageUrl: '/images/team/jane-cooper.jpg'
  },
  {
    name: 'Michael Foster',
    role: 'CTO',
    bio: 'Michael brings extensive experience in building scalable AI systems and leads our technical innovation.',
    imageUrl: '/images/team/michael-foster.jpg'
  }
])
</script>
