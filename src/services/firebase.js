import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import api from '@/api/axios';

class AuthService {
  async verifyUser(user) {
    if (!user?.getIdToken) {
      console.error('Invalid user object provided to verifyUser')
      throw new Error('Invalid user object')
    }

    try {
      // Force token refresh and catch any token-related errors early
      let idToken
      let tokenResult
      try {
        // Force a token refresh to ensure we have a valid token
        await user.reload()
        idToken = await user.getIdToken(true)
        console.log('Successfully refreshed Firebase token')
        
        // Get claims from Firebase
        tokenResult = await user.getIdTokenResult()
        console.log('Firebase claims:', tokenResult.claims)
        
        // Debug token info
        const tokenParts = idToken.split('.')
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]))
          console.log('Token payload:', payload)
          console.log('Token expiration:', new Date(payload.exp * 1000))
          console.log('Current time:', new Date())
        }
      } catch (error) {
        console.error('Failed to get ID token:', error)
        throw new Error('Invalid authentication token')
      }

      // Only proceed with backend verification if we have a valid token
      if (!idToken) {
        throw new Error('No valid token available')
      }

      // Backend Verification
      console.log('Sending verification request to backend...')
      console.log('Token being sent:', idToken.substring(0, 20) + '...')
      
      try {
        const response = await api.post('/auth/verify', { token: idToken }, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log('Backend verification response:', response.data)
        return response.data.user
      } catch (error) {
        console.error('Backend verification failed:', error)
        // If backend verification fails but we have a valid Firebase token,
        // we'll still consider the user authenticated
        if (tokenResult?.claims?.admin) {
          console.log('Using Firebase claims as fallback')
          return {
            ...user,
            claims: tokenResult.claims
          }
        }
        throw error
      }
    } catch (error) {
      console.error('User verification failed:', error)
      throw error
    }
  }

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('Firebase sign in successful')
      
      // Verify the user with our backend
      const verifiedUser = await this.verifyUser(userCredential.user)
      console.log('User verified:', verifiedUser)
      
      return verifiedUser
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  async signOut() {
    try {
      await signOut(auth)
      // Clear any stored credentials or tokens
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  async getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  }
}

export default new AuthService();
