import { AlertTriangle, MessageSquare, Heart, Users } from 'lucide-react';
import type { StatItem } from '../../types/dashboard';

const iconMap = {
  users: Users,
  matches: Heart,
  messages: MessageSquare,
  reports: AlertTriangle,
};

interface StatCardProps {
  item: StatItem;
}

export default function StatCard({ item }: StatCardProps) {
  const Icon = iconMap[item.icon];

  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--color-brand)]">
          <Icon className="h-7 w-7" />
        </div>

        <span
          className={[
            'text-sm font-semibold',
            item.trend === 'up' ? 'text-green-600' : 'text-red-500',
          ].join(' ')}
        >
          {item.change}
        </span>
      </div>

      <div className="text-4xl font-extrabold tracking-tight text-[var(--color-text-main)]">
        {item.value}
      </div>

      <p className="mt-2 text-base text-[var(--color-text-soft)]">{item.title}</p>
    </article>
  );
}