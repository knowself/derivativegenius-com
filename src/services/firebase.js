import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import api from '@/api/axios';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
};

class AuthService {
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Send token to backend for verification
      const response = await api.post('/api/auth/verify-token/', { id_token: idToken });
      
      return {
        user: userCredential.user,
        backendData: response.data
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      await api.post('/api/auth/logout/');
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
