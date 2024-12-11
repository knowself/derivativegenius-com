<template>
  <nav class="bg-gray-100 dark:bg-gray-800 py-3">
    <div class="max-w-7xl mx-auto px-4">
      <ol class="flex items-center justify-center space-x-2 text-sm">
        <li>
          <router-link to="/" class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors">
            Home
          </router-link>
        </li>
        <li class="text-gray-400 dark:text-gray-600">/</li>
        <li>
          <router-link to="/chatbots" class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors">
            Chatbots
          </router-link>
        </li>
        <li v-if="currentPage" class="text-gray-400 dark:text-gray-600">/</li>
        <li v-if="currentPage">
          <span class="text-indigo-600 dark:text-indigo-400 font-medium">{{ currentPage }}</span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'ChatbotBreadcrumb',
  props: {
    currentPage: {
      type: String,
      required: true
    }
  }
}
</script>
