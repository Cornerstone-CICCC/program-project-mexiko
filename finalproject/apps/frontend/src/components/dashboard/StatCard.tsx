export default function StatCard({ title, value, change }: any) {
    return (
      <div className="stat-card">
        <div>{change}</div>
        <h2>{value}</h2>
        <p>{title}</p>
      </div>
    );
  }