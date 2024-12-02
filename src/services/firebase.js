import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import api from '@/api/axios';

class AuthService {
  async verifyUser(user) {
    if (!user?.getIdToken) {
      console.error('Invalid user object provided to verifyUser');
      throw new Error('Invalid user object');
    }

    try {
      // Force token refresh and catch any token-related errors early
      let idToken;
      let tokenResult;
      try {
        // Force a token refresh to ensure we have a valid token
        await user.reload();
        idToken = await user.getIdToken(true);
        console.log('Successfully refreshed Firebase token');
        
        // Get claims from Firebase
        tokenResult = await user.getIdTokenResult();
        console.log('Firebase claims:', tokenResult.claims);
        
        // Debug token info
        const tokenParts = idToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', payload);
          console.log('Token expiration:', new Date(payload.exp * 1000));
          console.log('Current time:', new Date());
        }
      } catch (error) {
        console.error('Failed to get ID token:', error);
        throw new Error('Invalid authentication token');
      }

      // Only proceed with backend verification if we have a valid token
      if (!idToken) {
        throw new Error('No valid token available');
      }

      // Backend Verification
      try {
        console.log('Sending verification request to backend...');
        console.log('Token being sent:', idToken.substring(0, 20) + '...');
        
        // First check if backend is accessible
        try {
          await api.options('/firebase/auth/signin/');
        } catch (error) {
          console.error('CORS preflight failed:', error);
          console.log('Continuing with Firebase token claims');
        }
        
        const response = await api.post('/firebase/auth/signin/', {
          idToken: idToken
        });

        if (!response.data) {
          console.error('Invalid response from server');
          console.log('Continuing with Firebase token claims');
        }

        console.log('Backend verification successful:', response.data);
      } catch (error) {
        console.error('Backend verification failed:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          requestHeaders: error.config?.headers,
          url: error.config?.url
        });
        console.log('Continuing with Firebase token claims');
      }

      // Always return user with Firebase token claims
      return {
        ...user,
        claims: tokenResult.claims
      };
    } catch (error) {
      console.error('User verification failed:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Use verifyUser to maintain consistent claims handling
      return this.verifyUser(userCredential.user);
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      await api.post('/firebase/auth/signout/');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
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
