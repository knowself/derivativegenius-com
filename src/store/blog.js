import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { writeFile, deleteDirectory, ensureDirectoryExists } from '@/utils/fileSystem'
import { debug } from '@/utils/debug'

export const useBlogStore = defineStore('blog', {
  state: () => {
    console.log('[Blog Store] Initializing state')
    return {
      articles: [],
      isLoading: false,
      errorMessage: null,
      currentArticle: null,
      previewArticle: null
    }
  },

  getters: {
    sortedArticles: (state) => {
      console.log('[Blog Store] Getting sorted articles:', state.articles)
      return [...(state.articles || [])].sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      )
    },
    getArticleById: (state) => (id) => {
      console.log('[Blog Store] Getting article by id:', id)
      return state.articles.find(article => article.id === id)
    }
  },

  actions: {
    async loadArticles() {
      console.log('[Blog Store] Starting to load articles...')
      this.isLoading = true
      this.errorMessage = null
      
      try {
        console.log('[Blog Store] Fetching articles.json...')
        const response = await fetch('/content/blog/articles.json')
        
        if (!response.ok) {
          console.error('[Blog Store] Failed to load articles:', response.statusText)
          throw new Error(`Failed to load articles: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('[Blog Store] Raw data loaded:', data)
        
        if (!data || !data.articles) {
          console.error('[Blog Store] Invalid data format:', data)
          throw new Error('Invalid data format in articles.json')
        }
        
        this.articles = data.articles
        console.log('[Blog Store] Articles loaded:', this.articles)
      } catch (error) {
        console.error('[Blog Store] Error:', error)
        this.errorMessage = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createArticle(articleData) {
      console.log('[Blog Store] Creating article:', articleData)
      try {
        const id = uuidv4()
        const folder = `${articleData.slug}-${new Date().toISOString().split('T')[0]}`
        const article = {
          ...articleData,
          id,
          folder,
          publishedAt: articleData.publishedAt || new Date().toISOString().split('T')[0]
        }

        // Ensure the articles directory exists
        await ensureDirectoryExists('/content/blog/articles')
        
        // Create article directory
        const articlePath = `/content/blog/articles/${folder}`
        await ensureDirectoryExists(articlePath)
        
        // Write content file
        await writeFile(`${articlePath}/content.md`, article.content)
        
        // Update articles.json
        const updatedArticles = [...this.articles, article]
        await writeFile('/content/blog/articles.json', JSON.stringify({ articles: updatedArticles }, null, 2))
        
        this.articles = updatedArticles
        console.log('[Blog Store] Article created:', article)
      } catch (error) {
        console.error('[Blog Store] Error creating article:', error)
        this.errorMessage = error.message
        throw error
      }
    },

    async updateArticle(articleData) {
      console.log('[Blog Store] Updating article:', articleData)
      try {
        const article = this.getArticleById(articleData.id)
        if (!article) {
          throw new Error('Article not found')
        }

        const updatedArticle = {
          ...article,
          ...articleData,
          folder: article.folder // Keep the original folder
        }

        // Write content file
        const articlePath = `/content/blog/articles/${article.folder}`
        await writeFile(`${articlePath}/content.md`, updatedArticle.content)
        
        // Update articles.json
        const updatedArticles = this.articles.map(a => 
          a.id === article.id ? updatedArticle : a
        )
        await writeFile('/content/blog/articles.json', JSON.stringify({ articles: updatedArticles }, null, 2))
        
        this.articles = updatedArticles
        console.log('[Blog Store] Article updated:', updatedArticle)
      } catch (error) {
        console.error('[Blog Store] Error updating article:', error)
        this.errorMessage = error.message
        throw error
      }
    },

    async deleteArticle(articleId) {
      console.log('[Blog Store] Deleting article:', articleId)
      try {
        const article = this.getArticleById(articleId)
        if (!article) {
          throw new Error('Article not found')
        }

        // Delete article directory
        await deleteDirectory(`/content/blog/articles/${article.folder}`)
        
        // Update articles.json
        const updatedArticles = this.articles.filter(a => a.id !== articleId)
        await writeFile('/content/blog/articles.json', JSON.stringify({ articles: updatedArticles }, null, 2))
        
        this.articles = updatedArticles
        console.log('[Blog Store] Article deleted:', articleId)
      } catch (error) {
        console.error('[Blog Store] Error deleting article:', error)
        this.errorMessage = error.message
        throw error
      }
    },

    async loadArticleContent(article) {
      console.log('[Blog Store] Loading content for article:', article.id)
      try {
        const response = await fetch(`/content/blog/articles/${article.folder}/content.md`)
        if (!response.ok) {
          throw new Error(`Failed to load article content: ${response.statusText}`)
        }
        const content = await response.text()
        return content
      } catch (error) {
        console.error('[Blog Store] Error loading article content:', error)
        throw error
      }
    },

    setPreviewArticle(article) {
      console.log('[Blog Store] Setting preview article:', article)
      this.previewArticle = article
    }
  }
})
