export default function ChartCard({ title, children }: any) {
    return (
      <div className="chart-card">
        <h3>{title}</h3>
        {children}
      </div>
    );
  }