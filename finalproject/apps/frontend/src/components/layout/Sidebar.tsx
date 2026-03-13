import {
    BarChart3,
    Heart,
    House,
    Settings,
    ShieldAlert,
    Users,
  } from 'lucide-react';
  import { NavLink } from 'react-router-dom';
  
  const navItems = [
    { to: '/', label: 'Dashboard', icon: BarChart3 },
    { to: '/users', label: 'Users', icon: Users },
    { to: '/matches', label: 'Matches', icon: Heart },
    { to: '/reports', label: 'Reports', icon: ShieldAlert },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];
  
  export default function Sidebar() {
    return (
      <aside className="hidden min-h-screen border-r border-[var(--color-border)] bg-white lg:flex lg:flex-col lg:justify-between">
        <div className="p-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-brand)] text-white">
              <Heart className="h-5 w-5 fill-white" />
            </div>
  
            <div>
              <h1 className="text-[30px] font-bold leading-none text-[var(--color-text-main)]">
                MindMatch
              </h1>
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">Admin Panel</p>
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
  
        <div className="p-6">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <House className="h-4 w-4" />
            <span>Back to App</span>
          </button>
        </div>
      </aside>
    );
  }