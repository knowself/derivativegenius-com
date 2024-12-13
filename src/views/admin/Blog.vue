<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">Blog Management</h1>
      <router-link 
        to="/admin/blog/new"
        class="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
      >
        New Article
      </router-link>
    </div>
    
    <pre v-if="import.meta.env.DEV" class="bg-gray-100 p-4 rounded mb-4">
      Debug Info:
      {{ debugInfo }}
    </pre>

    <div v-if="blogStore.isLoading" class="text-gray-500">
      <span class="animate-pulse">Loading articles...</span>
    </div>
    
    <div v-else-if="blogStore.errorMessage" class="text-red-600 p-4 bg-red-50 rounded">
      {{ blogStore.errorMessage }}
    </div>
    
    <div v-else>
      <div v-if="!blogStore.articles?.length" class="text-gray-500 p-4 bg-gray-50 rounded">
        No articles yet. Click "New Article" to create one.
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="article in blogStore.articles" 
          :key="article.id" 
          class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-primary-300 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ article.title }}</h2>
              <p class="text-sm text-gray-600 mt-1">{{ article.category }} • {{ formatDate(article.publishedAt) }}</p>
              <div class="mt-2 flex items-center space-x-2">
                <span 
                  v-if="article.featured" 
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                  Featured
                </span>
              </div>
            </div>
            <div class="flex space-x-2">
              <router-link
                :to="`/admin/blog/edit/${article.id}`"
                class="text-gray-600 hover:text-primary-600 transition-colors"
                title="Edit Article"
              >
                <i class="fas fa-edit"></i>
              </router-link>
              <button
                @click="previewArticle(article)"
                class="text-gray-600 hover:text-primary-600 transition-colors"
                title="Preview Article"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                @click="confirmDelete(article)"
                class="text-gray-600 hover:text-red-600 transition-colors"
                title="Delete Article"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete "{{ articleToDelete?.title }}"? This action cannot be undone.
      </p>
      <div class="flex justify-end space-x-4">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="deleteArticle"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Blog',
  components: {},
  props: {},
  emits: {},
  setup() {
    return {}
  }
})
</script>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'

const router = useRouter()
const blogStore = useBlogStore()
const showDeleteModal = ref(false)
const articleToDelete = ref(null)

const debugInfo = computed(() => ({
  timestamp: new Date().toISOString(),
  articlesCount: blogStore.articles?.length || 0
}))

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function previewArticle(article) {
  blogStore.setPreviewArticle(article)
  router.push('/admin/blog/preview')
}

function confirmDelete(article) {
  articleToDelete.value = article
  showDeleteModal.value = true
}

async function deleteArticle() {
  if (!articleToDelete.value) return
  
  try {
    await blogStore.deleteArticle(articleToDelete.value.id)
    showDeleteModal.value = false
    articleToDelete.value = null
  } catch (error) {
    console.error('[Blog] Delete error:', error)
  }
}

onMounted(async () => {
  console.log('[Blog] Component mounted')
  try {
    await blogStore.loadArticles()
    console.log('[Blog] Articles loaded:', blogStore.articles)
  } catch (error) {
    console.error('[Blog] Error:', error)
  }
})
</script>