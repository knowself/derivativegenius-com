import { defineStore } from 'pinia'
import AuthService from '@/services/firebase'
import { auth } from '@/firebase'
import { setPersistence, browserLocalPersistence } from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    errorMessage: null,
    unsubscribeAuth: null,
    initialized: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isAdmin: (state) => !!state.user?.claims?.admin
  },
  
  actions: {
    async signIn(email, password) {
      this.isLoading = true
      this.errorMessage = null
      
      try {
        // Set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence)
        
        const user = await AuthService.signIn(email, password)
        this.user = user
        return user
      } catch (error) {
        console.error('Sign in error:', error)
        // Handle specific error cases
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          this.errorMessage = 'Invalid email or password'
        } else if (error.code === 'auth/too-many-requests') {
          this.errorMessage = 'Too many failed attempts. Please try again later'
        } else if (error.response?.status === 401) {
          this.errorMessage = 'Unauthorized access - please check your credentials'
        } else if (error.message === 'Backend verification failed') {
          // Still allow login if Firebase auth succeeded but backend verification failed
          if (error.user?.claims?.admin) {
            this.user = error.user
            return error.user
          }
          this.errorMessage = 'Unable to verify credentials with backend'
        } else {
          this.errorMessage = 'An error occurred during sign in. Please try again'
        }
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async signOut() {
      try {
        await AuthService.signOut()
        this.user = null
        this.initialized = false
        window.location.href = '/' // Force a full page reload and redirect to home
      } catch (error) {
        console.error('Sign out error:', error)
        this.errorMessage = error.message
      }
    },

    async initializeAuth() {
      if (this.initialized) return

      return new Promise((resolve) => {
        // Unsubscribe from any existing auth listener
        if (this.unsubscribeAuth) {
          this.unsubscribeAuth()
        }

        this.unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
          if (user) {
            try {
              // Force token refresh on initialization
              await user.getIdToken(true)
              const verifiedUser = await AuthService.verifyUser(user)
              this.user = verifiedUser
            } catch (error) {
              console.error('Error verifying user:', error)
              // If backend verification fails but we have Firebase admin claims,
              // still consider the user authenticated
              if (error.user?.claims?.admin) {
                this.user = error.user
              } else {
                this.user = null
                // If verification fails, sign out
                await this.signOut()
              }
            }
          } else {
            this.user = null
          }
          this.initialized = true
          resolve()
        })

        // Set up token refresh
        setInterval(async () => {
          const currentUser = auth.currentUser
          if (currentUser) {
            try {
              await currentUser.getIdToken(true)
              console.log('Token refreshed successfully')
            } catch (error) {
              console.error('Token refresh failed:', error)
            }
          }
        }, 10 * 60 * 1000) // Refresh token every 10 minutes
      })
    },

    cleanup() {
      if (this.unsubscribeAuth) {
        this.unsubscribeAuth()
        this.unsubscribeAuth = null
      }
      this.initialized = false
    }
  }
})
