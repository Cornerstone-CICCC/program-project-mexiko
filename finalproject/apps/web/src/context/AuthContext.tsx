import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
  } from 'react'
  import {
    getSessionMe,
    login as loginService,
    logout as logoutService,
    type LoginPayload,
    type SessionUser,
  } from '../services/authService'
  
  interface AuthContextValue {
    user: SessionUser | null
    loading: boolean
    isAuthenticated: boolean
    isAdmin: boolean
    refreshSession: () => Promise<void>
    login: (payload: LoginPayload) => Promise<void>
    logout: () => Promise<void>
  }
  
  const AuthContext = createContext<AuthContextValue | undefined>(undefined)
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SessionUser | null>(null)
    const [loading, setLoading] = useState(true)
  
    const refreshSession = useCallback(async () => {
      try {
        const sessionUser = await getSessionMe()
        setUser(sessionUser)
      } finally {
        setLoading(false)
      }
    }, [])
  
    useEffect(() => {
      void refreshSession()
    }, [refreshSession])
  
    const login = useCallback(async (payload: LoginPayload) => {
      await loginService(payload)
      const sessionUser = await getSessionMe()
      setUser(sessionUser)
    }, [])
  
    const logout = useCallback(async () => {
      await logoutService()
      setUser(null)
    }, [])
  
    const value = useMemo(
      () => ({
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        refreshSession,
        login,
        logout,
      }),
      [user, loading, refreshSession, login, logout],
    )
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  }
  
  export function useAuth() {
    const context = useContext(AuthContext)
  
    if (!context) {
      throw new Error('useAuth must be used inside AuthProvider')
    }
  
    return context
  }