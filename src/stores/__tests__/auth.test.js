import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/store/auth'
import AuthService from '@/services/firebase'

// Mock AuthService
vi.mock('@/services/firebase', () => ({
  default: {
    signIn: vi.fn(),
    signOut: vi.fn(),
    getCurrentUser: vi.fn()
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('starts with null user', () => {
      const store = useAuthStore()
      expect(store.user).toBeNull()
    })

    it('starts with loading true', () => {
      const store = useAuthStore()
      expect(store.loading).toBe(true)
    })

    it('starts not authenticated', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('Authentication', () => {
    it('handles successful sign in', async () => {
      const store = useAuthStore()
      const mockUser = { 
        email: 'test@example.com',
        isAdmin: false
      }
      
      // Mock successful sign in
      AuthService.default.signIn.mockResolvedValueOnce({ token: 'mock-token' })
      AuthService.default.getCurrentUser.mockResolvedValueOnce(mockUser)

      const success = await store.signIn({ 
        email: 'test@example.com', 
        password: 'password' 
      })

      expect(success).toBe(true)
      expect(store.user).toEqual(mockUser)
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
    })

    it('handles failed sign in', async () => {
      const store = useAuthStore()
      
      // Mock failed sign in
      AuthService.default.signIn.mockRejectedValueOnce(new Error('Invalid credentials'))

      const success = await store.signIn({ 
        email: 'test@example.com', 
        password: 'wrong-password' 
      })

      expect(success).toBe(false)
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBe('Authentication failed')
    })

    it('handles successful sign out', async () => {
      const store = useAuthStore()
      
      // Set initial authenticated state
      store.setUser({ email: 'test@example.com' })
      localStorage.setItem('idToken', 'mock-token')

      // Mock successful sign out
      AuthService.default.signOut.mockResolvedValueOnce()

      const success = await store.signOut()

      expect(success).toBe(true)
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.getItem('idToken')).toBeNull()
    })

    it('handles failed sign out', async () => {
      const store = useAuthStore()
      
      // Set initial authenticated state
      store.setUser({ email: 'test@example.com' })
      localStorage.setItem('idToken', 'mock-token')

      // Mock failed sign out
      AuthService.default.signOut.mockRejectedValueOnce(new Error('Network error'))

      const success = await store.signOut()

      expect(success).toBe(false)
      expect(store.error).toBe('Sign out failed')
    })
  })

  describe('User Management', () => {
    it('initializes auth state', async () => {
      const store = useAuthStore()
      const mockUser = { 
        email: 'test@example.com',
        isAdmin: false
      }

      AuthService.default.getCurrentUser.mockResolvedValueOnce(mockUser)

      await store.initializeAuth()

      expect(store.user).toEqual(mockUser)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('handles initialization error', async () => {
      const store = useAuthStore()

      AuthService.default.getCurrentUser.mockRejectedValueOnce(new Error('Network error'))

      await store.initializeAuth()

      expect(store.user).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeTruthy()
    })
  })
})
