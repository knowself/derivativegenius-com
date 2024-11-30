import { defineStore } from 'pinia';
import AuthService from '@/services/firebase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    loading: (state) => state.loading,
    error: (state) => state.error
  },
  
  actions: {
    async signIn(email, password) {
      this.loading = true;
      this.error = null;
      
      try {
        const { user } = await AuthService.signIn(email, password);
        this.user = user;
        return user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async signOut() {
      try {
        await AuthService.signOut();
        this.user = null;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
    
    async checkAuth() {
      try {
        const user = await AuthService.getCurrentUser();
        this.user = user;
        return user;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    }
  }
});
