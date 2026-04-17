import { useEffect, useState } from 'react'
import StatusBadge from '../components/ui/StatusBadge'
import { getReports } from '../services/reportService'
import type { ReportItem, ReportUser } from '../types/dashboard'

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)

  const normalizeStatus = (status?: string) => {
    if (!status) return 'resolved'

    const normalized = status.toLowerCase()

    if (normalized.includes('pending')) return 'pending'
    if (normalized.includes('dismiss')) return 'reviewing'
    if (normalized.includes('review')) return 'reviewing'

    return 'resolved'
  }

  const getStatusLabel = (status?: string) => {
    if (!status) return 'Resolved'

    const normalized = status.toLowerCase()

    if (normalized.includes('pending')) return 'Pending'
    if (normalized.includes('dismiss')) return 'Dismissed'
    if (normalized.includes('review')) return 'Reviewing'

    return 'Resolved'
  }

  const formatUserName = (user?: string | ReportUser) => {
    if (!user) return 'Unknown'

    if (typeof user === 'string') return user

    const first = user.fullName?.first ?? ''
    const last = user.fullName?.last ?? ''
    const fullName = `${first} ${last}`.trim()

    return fullName || user.email || user._id || 'Unknown'
  }

  const getReporterDisplay = (report: ReportItem) => {
    return formatUserName(report.reporterId)
  }

  const getTypeDisplay = (report: ReportItem) => {
    return report.category || 'No category'
  }

  const loadReports = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getReports()
      setReports(Array.isArray(data.reports) ? data.reports : [])
    } catch (err) {
      console.error(err)
      setError('Could not load reports.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  return (
    <>
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
                  <th className="px-6 py-4">Reported User</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report._id}
                    onClick={() => setSelectedReport(report)}
                    className="cursor-pointer border-t border-[var(--color-border)] transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5 font-medium text-slate-800">
                      {getReporterDisplay(report)}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {formatUserName(report.targetId)}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {getTypeDisplay(report)}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge variant={normalizeStatus(report.status)}>
                        {getStatusLabel(report.status)}
                      </StatusBadge>
                    </td>

                    <td className="px-6 py-5 text-slate-500">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}

                {!reports.length ? (
                  <tr>
                    <td
                      colSpan={5}
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

      {selectedReport ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Report Details
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Review the full moderation context for this report.
                </p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-xl px-3 py-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reporter
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {getReporterDisplay(selectedReport)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reported User
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {formatUserName(selectedReport.targetId)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedReport.category || 'No category'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </p>
                <div className="mt-2">
                  <StatusBadge variant={normalizeStatus(selectedReport.status)}>
                    {getStatusLabel(selectedReport.status)}
                  </StatusBadge>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedReport.description || 'No description provided.'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {selectedReport.createdAt
                    ? new Date(selectedReport.createdAt).toLocaleString()
                    : '—'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}