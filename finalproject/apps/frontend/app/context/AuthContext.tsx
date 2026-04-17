import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import API_BASE_URL, { API_ENDPOINTS } from "../../config/api";

type AuthContextType = {
  user: any;
  setUser: (user: any) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // No active Firebase session — user is definitely logged out
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Attempt to fetch session from backend cookie first
        let sessionUser: any = null;

        try {
          const res = await fetch(`${API_BASE_URL}/users/session/me`, {
            credentials: "include",
          });
          const data = await res.json().catch(() => null);

          if (data && data.authenticated) {
            sessionUser = data.user;
          }
        } catch (sessionErr) {
          // Backend unreachable (e.g. localhost on Android) — will try token refresh below
          console.log("Session check failed, attempting token refresh...", sessionErr);
        }

        if (sessionUser) {
          setUser(sessionUser);
        } else {
          // Backend session missing or unreachable — re-authenticate using Firebase token.
          // This is the main path on Android where cookies don't persist across app restarts.
          try {
            const idToken = await firebaseUser.getIdToken();
            const loginRes = await fetch(API_ENDPOINTS.LOGIN, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
              credentials: "include",
            });
            const loginData = await loginRes.json().catch(() => null);

            if (loginRes.ok && loginData && loginData.user) {
              setUser(loginData.user);
            } else {
              // Backend rejected the token — keep user logged in with Firebase data as fallback
              // so the app doesn't incorrectly show the login screen
              console.log("Backend token refresh failed, using Firebase user as fallback");
              setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
            }
          } catch (refreshErr) {
            // Network completely unreachable — don't log the user out, use Firebase identity as fallback
            console.log("Token refresh failed (network error), using Firebase user as fallback:", refreshErr);
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
          }
        }
      } catch (err) {
        console.log("Error checking session in AuthProvider:", err);
        // Firebase says user is authenticated but something else failed.
        // Use Firebase identity as fallback rather than logging out.
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      } finally {
        setLoading(false);
      }
    });

    return () => unsub(); // cleanup subscription on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}