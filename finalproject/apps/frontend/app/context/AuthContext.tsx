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
      try {
        if (firebaseUser) {
          // Attempt to fetch session directly first
          let res = await fetch(`${API_BASE_URL}/users/session/me`, {
            credentials: "include",
          });
          let data = await res.json().catch(() => null);

          if (data && data.authenticated) {
            setUser(data.user);
          } else {
            // If backend lost session but Firebase is still logged in natively (typical in React Native apps due to cookie resets),
            // restore the backend session implicitly by logging in again.
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
              setUser(null);
            }
          }
        } else {
          // No active Firebase session
          setUser(null);
        }
      } catch (err) {
        console.log("Error checking session in AuthProvider:", err);
        setUser(null);
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