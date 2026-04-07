import {
  BarChart3,
  Heart,
  LogOut,
  Settings,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/matches', label: 'Matches', icon: Heart },
  { to: '/reports', label: 'Reports', icon: ShieldAlert },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const displayName = [user?.fullName?.first, user?.fullName?.last]
    .filter(Boolean)
    .join(' ')
    .trim()

  const avatarLetter = (displayName || user?.email || 'A')
    .charAt(0)
    .toUpperCase()

  return (
    <aside className="hidden h-full border-r border-[var(--color-border)] bg-white lg:flex lg:flex-col">
      <div className="flex h-full flex-col">
        <div className="p-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-brand)] text-white">
              <Heart className="h-5 w-5 fill-white" />
            </div>

            <div>
              <h1 className="text-[30px] font-bold leading-none text-[var(--color-text-main)]">
                MindMatch
              </h1>
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition',
                    isActive
                      ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)]'
                      : 'text-slate-700 hover:bg-slate-50',
                  ].join(' ')
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto space-y-3 p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] font-semibold text-[var(--color-brand)]">
                {avatarLetter}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight text-slate-900">
                  {displayName || 'Admin'}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email || '-'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}