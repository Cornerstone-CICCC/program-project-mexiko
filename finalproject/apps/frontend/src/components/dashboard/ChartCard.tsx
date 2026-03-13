import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
}: ChartCardProps) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[28px] font-extrabold tracking-tight text-[var(--color-text-main)]">
            {title}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-soft)]">{subtitle}</p>
        </div>

        {action ? <div className="text-[var(--color-brand)]">{action}</div> : null}
      </div>

      <div className="h-[300px] w-full">{children}</div>
    </section>
  );
}