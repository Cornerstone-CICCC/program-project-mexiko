import type { PropsWithChildren } from 'react'
import Sidebar from './Sidebar'
import Topbar from './TopBar'

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--color-page)]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[230px_1fr]">
        <Sidebar />

        <div className="min-w-0 overflow-y-auto">
          <Topbar />
          <main className="px-4 pb-6 pt-2 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}