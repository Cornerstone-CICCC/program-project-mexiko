import type { ReactNode } from 'react';

interface DataTableCardProps {
  title: string;
  children: ReactNode;
}

export default function DataTableCard({ title, children }: DataTableCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
      <div className="border-b border-[var(--color-border)] px-6 py-5">
        <h3 className="text-[28px] font-extrabold tracking-tight text-[var(--color-text-main)]">
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}