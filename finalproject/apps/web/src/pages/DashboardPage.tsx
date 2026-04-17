import { useEffect, useState } from 'react'
import DataTableCard from '../components/dashboard/DataTableCard'
import StatCard from '../components/dashboard/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import { getReports } from '../services/reportService'
import type { ReportItem as FullReportItem, ReportUser } from '../types/dashboard'
import {
  getDashboardSummary,
  getRecentUsersPreview,
  type DashboardRecentUser,
  type DashboardStatItem,
} from '../services/dashboardService'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatItem[]>([])
  const [recentUsers, setRecentUsers] = useState<DashboardRecentUser[]>([])
  const [reportManagement, setReportManagement] = useState<FullReportItem[]>([])

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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

  const getReportedUserStatus = (user?: string | ReportUser) => {
    if (!user || typeof user === 'string') return 'Active'
    return user.isSuspended ? 'Suspended' : 'Active'
  }

  const getSummaryValue = (
    summaryStats: DashboardStatItem[],
    matcher: (title: string) => boolean,
  ) => {
    const match = summaryStats.find((item) => matcher(item.title.toLowerCase()))
    return match?.value ?? '0'
  }

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        setError(null)

        const [summary, recentUsersResult, reportsResult] = await Promise.all([
          getDashboardSummary(),
          getRecentUsersPreview(),
          getReports(),
        ])

        const allReports: FullReportItem[] = Array.isArray(reportsResult.reports)
          ? reportsResult.reports
          : []

        const pendingReports = allReports.filter(
          (report) => report.status === 'Pending',
        ).length

        const resolvedReports = allReports.filter(
          (report) => report.status === 'Resolved',
        ).length

        const suspendedUsersCount = new Set(
          allReports
            .map((report) => {
              if (!report.targetId || typeof report.targetId === 'string') return null
              return report.targetId.isSuspended ? report.targetId._id : null
            })
            .filter((id): id is string => Boolean(id)),
        ).size

        const totalUsers = getSummaryValue(
          summary.stats,
          (title) => title.includes('total user') || title === 'users' || title.includes('users'),
        )

        setStats([
          {
            title: 'Total Users',
            value: totalUsers,
            change: 'Live data',
            trend: 'up',
            icon: 'users',
          },
          {
            title: 'Suspended Users',
            value: suspendedUsersCount.toString(),
            change: 'From reports',
            trend: suspendedUsersCount > 0 ? 'down' : 'up',
            icon: 'users',
          },
          {
            title: 'Pending Reports',
            value: pendingReports.toString(),
            change: 'Needs review',
            trend: pendingReports > 0 ? 'down' : 'up',
            icon: 'reports',
          },
          {
            title: 'Resolved Reports',
            value: resolvedReports.toString(),
            change: 'Handled cases',
            trend: 'up',
            icon: 'reports',
          },
        ])

        setRecentUsers(Array.isArray(recentUsersResult) ? recentUsersResult : [])
        setReportManagement(allReports.slice(0, 5))
      } catch (err) {
        console.error(err)
        setError('Could not load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    void loadDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} item={item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DataTableCard title="Recent Users">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">MBTI</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-t border-[var(--color-border)]">
                  <td className="px-6 py-5 font-medium text-slate-800">{user.name}</td>
                  <td className="px-6 py-5">
                    <StatusBadge variant="mbti">{user.mbti}</StatusBadge>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge variant={user.status === 'Active' ? 'success' : 'inactive'}>
                      {user.status}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-5 text-slate-600">{user.joined}</td>
                </tr>
              ))}

              {!recentUsers.length && !loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                    No recent users found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </DataTableCard>

        <DataTableCard title="Report Management">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Reported User</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">User Status</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {reportManagement.map((report) => {
                const reportedUserStatus = getReportedUserStatus(report.targetId)

                return (
                  <tr key={report._id} className="border-t border-[var(--color-border)]">
                    <td className="px-6 py-5 font-medium text-slate-800">
                      {formatUserName(report.reporterId)}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {formatUserName(report.targetId)}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {report.category || 'No category'}
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge
                        variant={reportedUserStatus === 'Suspended' ? 'inactive' : 'success'}
                      >
                        {reportedUserStatus}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge variant={normalizeStatus(report.status)}>
                        {getStatusLabel(report.status)}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                )
              })}

              {!reportManagement.length && !loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                    No reports found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </DataTableCard>
      </section>
    </div>
  )
}