import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
    const checkSession = async () => {
      try {

        await new Promise((resolve) => setTimeout(resolve, 100));

        const res = await fetch("http://localhost:3500/users/session/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (err) {
        console.log("Error checking session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
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
