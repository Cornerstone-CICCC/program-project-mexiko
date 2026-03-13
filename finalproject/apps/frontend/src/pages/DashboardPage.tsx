import StatCard from '../components/dashboard/StatCard';
import { stats } from '../data/dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} item={item} />
        ))}
      </section>
    </div>
  );
}