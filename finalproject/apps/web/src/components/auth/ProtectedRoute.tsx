import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute() {
  const { loading, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-page)]">
        <div className="text-sm text-slate-500">Checking session...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-page)] px-6">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Access denied</h1>
          <p className="mt-3 text-sm text-slate-600">
            Your account is authenticated, but it does not have admin access.
          </p>
        </div>
      </div>
    )
  }

  return <Outlet />
}