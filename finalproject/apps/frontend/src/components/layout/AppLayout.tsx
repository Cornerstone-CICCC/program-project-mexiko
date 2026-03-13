import type { PropsWithChildren } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[var(--color-page)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[250px_1fr]">
        <Sidebar />

        <div className="min-w-0">
          <Topbar />
          <main className="px-4 pb-6 pt-2 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}