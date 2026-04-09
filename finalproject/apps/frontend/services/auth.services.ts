// frontend/services/auth.services.ts
import { API_ENDPOINTS } from "../config/api";
import API_BASE_URL from "../config/api";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  deleteUser,
} from "firebase/auth";

// Interfaces for type safety
interface SignUpData {
  // Information basic for account creation
  name: string;
  lastName: string;
  email: string;
  password: string;
  
  // Information for profile
  gender: 'Male' | 'Female' | 'Other';
  birthDate: string;
  bio: string;
  interests: string[];
  profileImage?: string | null;
  subImages?: string[];
  
  // Information for preferences
  location: {
    type: string;
    coordinates: [number, number];
  };
  preferredDistance: number;
  preferredAgeRange: {
    min: number;
    max: number;
  };
  preferredGender: 'Male' | 'Female' | 'Other' | 'All';
  showLocationOnProfile: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  async signUp(userData: SignUpData) {
    try {
      console.log("🚀 Starting signup process with all data...");
      console.log("User data received:", {
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        gender: userData.gender,
        birthDate: userData.birthDate,
        bioLength: userData.bio?.length,
        interestsCount: userData.interests?.length,
        preferredDistance: userData.preferredDistance,
        preferredGender: userData.preferredGender,
        hasProfileImage: !!userData.profileImage,
        subImagesCount: userData.subImages?.length || 0,
      });

      // Validations with detailed logging
      if (userData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Validations with detailed logging
      if (!userData.gender) {
        throw new Error("Please select your gender");
      }
      if (!userData.birthDate) {
        throw new Error("Please enter your birth date");
      }
      if (!userData.bio || userData.bio.length < 20) {
        throw new Error("Bio must be at least 20 characters long");
      }
      if (!userData.interests || userData.interests.length === 0) {
        throw new Error("Please add at least one interest");
      }
      if (!userData.location || userData.location.coordinates[0] === 0) {
        throw new Error("Please enable location to find connections near you");
      }

      let userCredential;
      let isNewUser = false;

      try {
        // Create user in Firebase
        userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password,
        );
        console.log("✅ New user created in Firebase:", userCredential.user.uid);
        isNewUser = true;
        
        // Send email verification
        await sendEmailVerification(userCredential.user);
        console.log("📧 Verification email sent to:", userData.email);
        
      } catch (firebaseError: any) {
        // If email already exists, try to log in instead
        if (firebaseError.code === "auth/email-already-in-use") {
          console.log("🔄 Email already exists, attempting automatic login...");

          userCredential = await signInWithEmailAndPassword(
            auth,
            userData.email,
            userData.password,
          );
          console.log("✅ Automatic login successful:", userCredential.user.uid);
          isNewUser = false;
        } else {
          throw firebaseError;
        }
      }

      const idToken = await userCredential.user.getIdToken();
      console.log("🔑 Got ID token from Firebase");

      // Preparar todos los datos del usuario para el backend
      const userInfoForBackend = {
        fullName: {
          first: userData.name,
          last: userData.lastName || "",
        },
        email: userData.email,
        // Datos de perfil (página 2)
        gender: userData.gender,
        birthDate: userData.birthDate,
        bio: userData.bio,
        interests: userData.interests || [],
        profileImage: userData.profileImage || null,
        subImages: userData.subImages || [],
        // Datos de preferencias (página 3)
        location: {
          type: userData.location.type || "Point",
          coordinates: userData.location.coordinates || [0, 0],
        },
        preferredDistance: userData.preferredDistance || 10,
        preferredAgeRange: {
          min: userData.preferredAgeRange?.min || 18,
          max: userData.preferredAgeRange?.max || 30,
        },
        preferredGender: userData.preferredGender || "All",
        showLocationOnProfile: userData.showLocationOnProfile || false,
      };

      console.log("📤 Sending complete user data to backend...");
      
      // Send token and complete user info to backend
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInfo: userInfoForBackend,
          idToken: idToken,
        }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("📥 Response from backend:", data);

      if (!response.ok) {
        // Si el backend falla, eliminar el usuario de Firebase para mantener consistencia
        if (isNewUser && userCredential?.user) {
          try {
            await deleteUser(userCredential.user);
            console.log("🗑️ Firebase user deleted due to backend error");
          } catch (deleteError) {
            console.error("Failed to delete Firebase user:", deleteError);
          }
        }
        throw new Error(data.error || "Error creating account");
      }

      return {
        ...data,
        isNewUser: data.isNewUser !== undefined ? data.isNewUser : isNewUser,
      };
      
    } catch (error: any) {
      console.error("❌ Error en signUp:", error);

      // Manejo específico de errores de Firebase
      if (error.code === "auth/weak-password") {
        throw new Error("Password must be at least 6 characters long");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Please enter a valid email address");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password for this account");
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Too many attempts. Please try again later");
      } else if (error.code === "auth/network-request-failed") {
        throw new Error("Network error. Please check your connection.");
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  }

  // Login method
  async login(loginData: LoginData) {
    try {
      console.log("Attempting login with Firebase...");

      if (!loginData.email || !loginData.password) {
        throw new Error("Please fill in all fields");
      }

      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password,
      );

      console.log("User authenticated in Firebase:", userCredential.user.uid);

      // Get the ID Token
      const idToken = await userCredential.user.getIdToken();
      console.log("Token obtained from Firebase");

      // Send token to backend
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (!response.ok) {
        throw new Error(data.error || "Error logging in");
      }

      return data;
    } catch (error: any) {
      console.error("Error en login:", error, error.code, error.message);

      // Manejar errores específicos de Firebase
      if (error.code === "auth/user-not-found") {
        throw new Error("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Please enter a valid email address");
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Too many failed attempts. Try again later");
      } else if (error.code === "auth/network-request-failed") {
        throw new Error("Network error. Please check your connection.");
      } else {
        throw error;
      }
    }
  }

  // Logout method
  async logout() {
    try {
      console.log("Attempting to logout...");

      // Sign out from Firebase
      await signOut(auth);
      console.log("✅ Firebase sign out successful");

      // Notify the backend to clear cookies/session
      const response = await fetch(`${API_ENDPOINTS.LOGOUT}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Backend logout failed");
      }

      const data = await response.json();
      console.log("✅ Backend logout successful:", data);

      return { success: true, data };
    } catch (error) {
      console.error("❌ Error in logout:", error);
      throw error;
    }
  }

  // Get current user method
  getCurrentUser() {
    return auth.currentUser;
  }

  async deleteAccount() {
    try {
      console.log("Attempting to delete account...");

      // Delete account from backend first
      const response = await fetch(`${API_BASE_URL}/users/me/delete`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to delete account: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("✅ Account deleted from backend:", data);

      // Delete account from Firebase
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
        console.log("✅ Firebase user deleted successfully");
      }

      return { success: true, message: "Account deleted successfully" };
    } catch (error) {
      console.error("❌ Error deleting account:", error);
      throw error;
    }
  }
}

export default new AuthService();