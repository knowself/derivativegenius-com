<template>
  <div class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Articles</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Latest Insights
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Stay updated with our latest insights, trends, and expert analysis.
        </p>
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
        <article v-for="article in articles" :key="article.title" class="group">
          <div class="relative">
            <div class="relative h-48 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
              <img :src="article.imageUrl" :alt="article.title" class="h-full w-full object-cover object-center">
            </div>
            <div class="mt-4 flex items-center gap-x-4 text-xs">
              <time :datetime="article.datetime" class="text-gray-500">{{ article.date }}</time>
              <span class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                {{ article.category }}
              </span>
            </div>
            <div class="group relative">
              <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                <a :href="article.href">
                  <span class="absolute inset-0"></span>
                  {{ article.title }}
                </a>
              </h3>
              <p class="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">{{ article.description }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'ArticlesPage'
})

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
