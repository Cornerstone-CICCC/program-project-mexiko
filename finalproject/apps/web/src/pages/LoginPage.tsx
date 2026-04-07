import { FormEvent, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isAdmin, loading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'

  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin) {
      navigate(from, { replace: true })
    }
  }, [loading, isAuthenticated, isAdmin, navigate, from])

  if (!loading && isAuthenticated && isAdmin) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err: any) {
      console.error(err)

      const backendMessage = err?.response?.data?.error
      const firebaseMessage = err?.message

      setError(
        backendMessage ||
          firebaseMessage ||
          'Login failed.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-page)] px-6">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text-main)]">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-soft)]">
            Sign in to access the MindMatch dashboard.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[var(--color-brand)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}