import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { initializeApp } from '@firebase/app'
import { 
  getAuth, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from '@firebase/auth'

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)
  let unsubscribe = null

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => {
    if (!user.value) return false
    // Check for admin role in custom claims
    return user.value.isAdmin || user.value.email?.endsWith('@derivativegenius.com')
  })

  // Actions
  function setUser(newUser) {
    if (newUser) {
      user.value = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        // Get custom claims if available
        isAdmin: newUser.email?.endsWith('@derivativegenius.com') || false
      }
    } else {
      user.value = null
    }
    loading.value = false
  }

  function setError(err) {
    error.value = err
    loading.value = false
  }

  async function signIn(email, password) {
    try {
      loading.value = true
      error.value = null
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Get the ID token result to check custom claims
      const idTokenResult = await userCredential.user.getIdTokenResult()
      const isAdmin = idTokenResult.claims.admin || email.endsWith('@derivativegenius.com')
      
      setUser({
        ...userCredential.user,
        isAdmin
      })
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  function initializeAuth() {
    // Clean up any existing listener
    if (unsubscribe) {
      unsubscribe()
    }

    // Set up new listener
    unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Get the ID token result to check custom claims
            const idTokenResult = await firebaseUser.getIdTokenResult()
            const isAdmin = idTokenResult.claims.admin || firebaseUser.email?.endsWith('@derivativegenius.com')
            
            setUser({
              ...firebaseUser,
              isAdmin
            })
          } catch (err) {
            console.error('Error getting token claims:', err)
            setUser(null)
          }
        } else {
          setUser(null)
        }
      },
      (err) => {
        console.error('Auth state change error:', err)
        setError(err.message)
      }
    )
  }

  function cleanup() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    signIn,
    signOut,
    initializeAuth,
    cleanup
  }
})
