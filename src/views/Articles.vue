<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-16">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Background decorative elements -->
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div class="relative">
        <div class="lg:text-center mb-12">
          <h2 class="text-base text-yellow-400 font-semibold tracking-wide uppercase animate-fade-in-up">Articles</h2>
          <p class="mt-1 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl animate-fade-in-up-delay">
            Latest Insights
          </p>
          <p class="mt-2 max-w-2xl text-lg text-gray-300 lg:mx-auto animate-fade-in-up-delay-2">
            Stay updated with our latest insights, trends, and expert analysis.
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <article 
            v-for="article in articles" 
            :key="article.title" 
            class="group bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-yellow-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div class="relative">
              <div class="relative h-48 w-full overflow-hidden rounded-t-lg group-hover:opacity-90 transition-opacity duration-300">
                <img 
                  :src="article.imageUrl" 
                  :alt="article.title" 
                  class="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              </div>
              <div class="p-6">
                <div class="flex items-center gap-x-4 text-sm mb-3">
                  <time :datetime="article.datetime" class="text-gray-400">{{ article.date }}</time>
                  <span class="relative z-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 font-medium text-yellow-400 hover:bg-yellow-400/20 transition-colors">
                    {{ article.category }}
                  </span>
                </div>
                <div class="group relative">
                  <h3 class="text-lg font-semibold leading-6 text-white group-hover:text-yellow-400 transition-colors">
                    <a :href="article.href">
                      <span class="absolute inset-0"></span>
                      {{ article.title }}
                    </a>
                  </h3>
                  <p class="mt-3 text-gray-300 leading-6">{{ article.description }}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="ArticlesPage">
import { ref } from 'vue'

const articles = ref([
  {
    title: 'Leveraging AI for Business Growth',
    href: '#',
    category: 'AI & Analytics',
    description: 'Learn how small businesses are using AI to drive growth and make better decisions.',
    date: 'Mar 16, 2024',
    datetime: '2024-03-16',
    imageUrl: '/images/articles/ai-business.jpg'
  },
  {
    title: 'Data-Driven Decision Making',
    href: '#',
    category: 'Business Intelligence',
    description: 'A comprehensive guide to making informed business decisions using data analytics.',
    date: 'Mar 10, 2024',
    datetime: '2024-03-10',
    imageUrl: '/images/articles/data-analytics.jpg'
  },
  {
    title: 'The Future of SMB Analytics',
    href: '#',
    category: 'Industry Trends',
    description: 'Exploring upcoming trends in business analytics for small and medium businesses.',
    date: 'Mar 5, 2024',
    datetime: '2024-03-05',
    imageUrl: '/images/articles/future-trends.jpg'
  }
])
</script>

<style scoped>
.bg-grid-pattern {
  background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in-up-delay {
  animation: fadeInUp 0.6s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-fade-in-up-delay-2 {
  animation: fadeInUp 0.6s ease-out 0.4s forwards;
  opacity: 0;
}
</style>
