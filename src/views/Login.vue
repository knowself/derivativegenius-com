<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = computed(() => auth.isLoading)

async function handleSubmit() {
  if (loading.value) return;
  error.value = '';
  loading.value = true;
  
  try {
    console.log('Attempting sign in...');
    const user = await auth.signIn(email.value, password.value);
    console.log('Sign in successful:', user);
    router.push(user.claims.admin ? '/admin' : '/');
  } catch (err) {
    console.error('Sign in error:', err);
    
    // Handle Firebase auth errors
    if (err.code?.startsWith('auth/')) {
      switch(err.code) {
        case 'auth/user-not-found':
          error.value = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          error.value = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          error.value = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          error.value = 'Too many failed attempts. Please try again later';
          break;
        default:
          error.value = 'Authentication failed';
      }
    } else if (err.response?.status === 401) {
      error.value = auth.errorMessage || 'Unauthorized access - please check your credentials';
    } else {
      error.value = auth.errorMessage || err.message || 'Failed to sign in';
    }
  } finally {
    loading.value = false;
  }
}
</script>
