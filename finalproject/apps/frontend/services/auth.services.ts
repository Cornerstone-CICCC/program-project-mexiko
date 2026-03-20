// frontend/services/auth.services.ts
import { API_ENDPOINTS } from '../config/api';
import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut 
} from 'firebase/auth';

interface SignUpData {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

class AuthService {
async signUp(userData: SignUpData) {
  try {
    console.log('Creating user...');
    
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    let userCredential;
    let isNewUser = false;
    
    try {
      // Create user in Firebase
      userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      console.log('✅ New user created in Firebase:', userCredential.user.uid);
      isNewUser = true;
      // Send email verification      await sendEmailVerification(userCredential.user);
      console.log('📧 Verification email sent');
      
    } catch (firebaseError: any) {
      // If email already exists, try to log in instead
      if (firebaseError.code === 'auth/email-already-in-use') {
        console.log('🔄 Email already exists, attempting automatic login...');
        
        userCredential = await signInWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        console.log('✅ Automatic login successful:', userCredential.user.uid);
        isNewUser = false;
      } else {
        throw firebaseError;
      }
    }
    
    const idToken = await userCredential.user.getIdToken();
    console.log('Got ID token from Firebase');

    // Send token and user info to backend
    console.log('Sending data to backend...');
    const response = await fetch(API_ENDPOINTS.SIGNUP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInfo: {
          fullName: {
            first: userData.name,
            last: userData.lastName || ''
          },
          email: userData.email
        },
        idToken: idToken,
      }),
      credentials: 'include',
    });

    const data = await response.json();
    console.log('Response from backend:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Error creating account');
    }

    return {
      ...data,
      isNewUser: data.isNewUser !== undefined ? data.isNewUser : isNewUser
    };
    
  } catch (error: any) {
    console.error('Error en signUp:', error);
    
    if (error.code === 'auth/weak-password') {
      throw new Error('Password must be at least 6 characters long');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password for this account');
    } else {
      throw error;
    }
  }
}
  // Login method 
  async login(loginData: LoginData) {
    try {
      console.log('Attempting login with Firebase...');
      
      if (!loginData.email || !loginData.password) {
        throw new Error('Please fill in all fields');
      }

      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      
      console.log('User authenticated in Firebase:', userCredential.user.uid);
      
      // Get the ID Token
      const idToken = await userCredential.user.getIdToken();
      console.log('3. Token obtained from Firebase');

      // Send token to backend
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Response from backend:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error logging in');
      }

      return data;
      
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejar errores específicos de Firebase
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Try again later');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw error;
      }
    }
  }

  // Logout method
  async logout() {
    try {
      console.log('Attempting to logout...');
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Notify the backend
      const response = await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
      
      console.log('Session closed successfully');
      return await response.json();
      
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }

  // Get current user method
  getCurrentUser() {
    return auth.currentUser;
  }
}

export default new AuthService();