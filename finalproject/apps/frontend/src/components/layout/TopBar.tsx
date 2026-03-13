export default function Topbar() {
    return (
      <header className="px-4 pb-2 pt-6 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-main)] sm:text-4xl">
          Dashboard Overview
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-soft)] sm:text-base">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </header>
    );
  }