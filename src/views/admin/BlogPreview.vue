<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center">
        <button
          @click="router.back()"
          class="mr-4 text-gray-600 hover:text-gray-900"
        >
          ← Back to Editor
        </button>
        <h1 class="text-2xl font-semibold text-gray-900">
          Article Preview
        </h1>
      </div>
    </div>

    <div v-if="article" class="space-y-6 max-w-4xl">
      <!-- Article Preview -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium mb-4">Article Preview</h2>
        <div class="prose max-w-none">
          <h1 class="text-3xl font-bold mb-4">{{ article.title }}</h1>
          <div class="flex items-center text-sm text-gray-600 mb-6">
            <span>{{ article.category }}</span>
            <span class="mx-2">•</span>
            <span>{{ formatDate(article.publishedAt) }}</span>
          </div>
          <div v-html="renderedContent" class="prose"></div>
        </div>
      </div>

      <!-- SEO Preview -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium mb-4">SEO Preview</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700">Meta Title</h3>
            <p class="mt-1 text-blue-600">{{ article.seo.metaTitle }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700">Meta Description</h3>
            <p class="mt-1 text-gray-600">{{ article.seo.metaDescription }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700">Keywords</h3>
            <div class="mt-1 flex flex-wrap gap-2">
              <span
                v-for="keyword in article.seo.keywords"
                :key="keyword"
                class="px-2 py-1 text-xs bg-gray-100 rounded"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700">Canonical URL</h3>
            <p class="mt-1 text-blue-600">{{ article.seo.canonicalUrl }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-600">
      No article selected for preview.
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { marked } from 'marked'

export default defineComponent({
  name: 'BlogPreview'
})
</script>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blog'

const router = useRouter()
const blogStore = useBlogStore()

const article = computed(() => blogStore.previewArticle)
const renderedContent = computed(() => {
  if (!article.value?.content) return ''
  return marked(article.value.content)
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
