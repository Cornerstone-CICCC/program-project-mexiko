import { useEffect, useState } from 'react';
import StatusBadge from '../components/ui/StatusBadge';
import { getReports } from '../services/reportService';

interface ReportItem {
  _id?: string;
  id?: string;
  reporter?: string;
  type?: string;
  status?: 'Pending' | 'Reviewing' | 'Resolved' | string;
  reason?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Could not load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-main)]">
          Reports
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-soft)]">
          Review user reports and moderation actions.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-slate-500">Loading reports...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report._id || report.id}
                  className="border-t border-[var(--color-border)]"
                >
                  <td className="px-6 py-5 font-medium text-slate-800">
                    {report.reporter || '-'}
                  </td>
                  <td className="px-6 py-5 text-slate-600">
                    {report.type || report.reason || '-'}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge
                      variant={
                        report.status === 'Pending'
                          ? 'pending'
                          : report.status === 'Reviewing'
                            ? 'reviewing'
                            : 'resolved'
                      }
                    >
                      {report.status || 'Resolved'}
                    </StatusBadge>
                  </td>
                </tr>
              ))}

              {!reports.length ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    No reports found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}