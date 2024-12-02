import { defineStore } from 'pinia';
import AuthService from '@/services/firebase';
import { auth } from '@/firebase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    errorMessage: null,
    unsubscribeAuth: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isAdmin: (state) => !!state.user?.claims?.admin
  },
  
  actions: {
    async signIn(email, password) {
      this.isLoading = true;
      this.errorMessage = null;
      
      try {
        const user = await AuthService.signIn(email, password);
        this.user = user;
        return user;
      } catch (error) {
        console.error('Sign in error:', error);
        // Handle specific error cases
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          this.errorMessage = 'Invalid email or password';
        } else if (error.code === 'auth/too-many-requests') {
          this.errorMessage = 'Too many failed attempts. Please try again later';
        } else if (error.response?.status === 401) {
          this.errorMessage = 'Unauthorized access - please check your credentials';
        } else {
          this.errorMessage = 'An error occurred during sign in. Please try again';
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async signOut() {
      try {
        await AuthService.signOut();
        this.user = null;
      } catch (error) {
        this.errorMessage = error.message;
        throw error;
      }
    },

    async initializeAuth() {
      this.isLoading = true;
      try {
        // Set up Firebase Auth state listener first
        this.unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
          try {
            if (user?.getIdToken) {
              const authenticatedUser = await AuthService.verifyUser(user);
              this.user = authenticatedUser;
            } else {
              this.user = null;
            }
          } catch (error) {
            console.error('User verification failed:', error);
            // Clear user state on any verification error
            this.user = null;
          }
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        this.errorMessage = error.message;
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
    
    cleanup() {
      if (this.unsubscribeAuth) {
        this.unsubscribeAuth();
        this.unsubscribeAuth = null;
      }
    }
  }
});
