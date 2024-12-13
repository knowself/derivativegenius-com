<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center">
        <button
          @click="router.push('/admin/blog')"
          class="mr-4 text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ isEditing ? 'Edit Article' : 'New Article' }}
        </h1>
      </div>
      <div class="flex space-x-3">
        <button
          @click="previewArticle"
          class="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
        >
          Preview
        </button>
        <button
          @click="saveArticle"
          class="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          {{ isEditing ? 'Update' : 'Publish' }}
        </button>
      </div>
    </div>

    <div class="space-y-6 max-w-4xl">
      <!-- Basic Info -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium mb-4">Basic Information</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="article.title"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter article title"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <input
              v-model="article.category"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="e.g., AI Engineering"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Publication Date</label>
            <input
              v-model="article.publishedAt"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div class="flex items-center">
            <input
              v-model="article.featured"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label class="ml-2 block text-sm text-gray-900">Featured Article</label>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium mb-4">Content</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700">Article Content (Markdown)</label>
          <textarea
            v-model="article.content"
            rows="15"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono"
            placeholder="Write your article content in Markdown..."
          ></textarea>
        </div>
      </div>

      <!-- SEO -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium mb-4">SEO Settings</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Meta Title</label>
            <input
              v-model="article.seo.metaTitle"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="SEO-optimized title"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Meta Description</label>
            <textarea
              v-model="article.seo.metaDescription"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Brief description for search engines..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Keywords</label>
            <input
              v-model="keywordsString"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="ai, automation, development (comma-separated)"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Canonical URL</label>
            <input
              v-model="article.seo.canonicalUrl"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="https://derivativegenius.com/articles/your-article"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BlogEditor'
})
</script>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBlogStore } from '@/store/blog'

const router = useRouter()
const route = useRoute()
const blogStore = useBlogStore()

const isEditing = computed(() => !!route.params.id)
const article = ref({
  title: '',
  slug: '',
  category: 'AI Engineering',
  content: '',
  publishedAt: new Date().toISOString().split('T')[0],
  featured: false,
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    canonicalUrl: ''
  }
})

// Computed properties for form handling
const keywordsString = computed({
  get: () => article.value.seo.keywords.join(', '),
  set: (value) => {
    article.value.seo.keywords = value.split(',').map(k => k.trim()).filter(k => k)
  }
})

const slugFromTitle = computed(() => {
  return article.value.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
})

// Watch title changes to update slug
watch(() => article.value.title, (newTitle) => {
  if (!isEditing.value) {
    article.value.slug = slugFromTitle.value
  }
})

onMounted(async () => {
  if (isEditing.value) {
    const existingArticle = blogStore.getArticleById(route.params.id)
    if (existingArticle) {
      article.value = { ...existingArticle }
      const content = await blogStore.loadArticleContent(existingArticle)
      article.value.content = content
    }
  }
})

async function saveArticle() {
  try {
    if (!article.value.title) {
      throw new Error('Title is required')
    }
    
    if (!article.value.content) {
      throw new Error('Content is required')
    }

    // Ensure we have a slug
    if (!article.value.slug) {
      article.value.slug = slugFromTitle.value
    }

    if (isEditing.value) {
      await blogStore.updateArticle(article.value)
    } else {
      await blogStore.createArticle(article.value)
    }
    router.push('/admin/blog')
  } catch (error) {
    console.error('[BlogEditor] Save error:', error)
    // TODO: Show error to user
  }
}

function previewArticle() {
  blogStore.setPreviewArticle(article.value)
  router.push('/admin/blog/preview')
}
</script>
