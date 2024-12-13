<template>
  <div class="min-h-screen bg-white py-16">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative">
        <div class="lg:text-center mb-12">
          <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Derivative Insights</h2>
          <p class="mt-1 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Latest Articles
          </p>
          <p class="mt-2 max-w-2xl text-lg text-gray-500 lg:mx-auto">
            Exploring the intersection of AI, automation, and software engineering through in-depth technical articles.
          </p>
        </div>

        <div class="grid gap-12 md:grid-cols-2">
          <article 
            v-for="article in articles" 
            :key="article.title" 
            class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div class="relative">
              <div class="relative h-56 w-full overflow-hidden rounded-t-lg">
                <img 
                  :src="article.imageUrl" 
                  :alt="article.title" 
                  class="h-full w-full object-cover object-center"
                >
              </div>
              <div class="p-8">
                <div class="flex items-center gap-x-4 text-sm mb-4">
                  <time :datetime="article.datetime" class="text-gray-500">{{ article.date }}</time>
                  <span class="relative z-10 rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600">
                    {{ article.category }}
                  </span>
                </div>
                <div class="group relative">
                  <h3 class="text-xl font-semibold leading-7 text-gray-900 group-hover:text-indigo-600">
                    <a :href="article.href">
                      <span class="absolute inset-0"></span>
                      {{ article.title }}
                    </a>
                  </h3>
                  <p class="mt-4 text-base text-gray-600 leading-6">{{ article.description }}</p>
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
    title: "Building an AI-Powered Development Workflow",
    description: "Explore how to integrate modern AI tools into your development pipeline. From code generation to automated testing, learn how AI can enhance your software engineering process.",
    href: "/articles/ai-powered-development-workflow",
    date: "Dec 12, 2023",
    datetime: "2023-12-12",
    category: "AI Engineering",
    imageUrl: "/images/articles/ai-automation.jpg"
  }
])
</script>

<style scoped>
</style>
