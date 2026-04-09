import { useEffect, useState } from 'react'
import { TrendingUp, Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartCard from '../components/dashboard/ChartCard'
import DataTableCard from '../components/dashboard/DataTableCard'
import StatCard from '../components/dashboard/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import {
  getDashboardSummary,
  getRecentReportsPreview,
  getRecentUsersPreview,
  type DashboardMatchSuccessItem,
  type DashboardRecentUser,
  type DashboardReportItem,
  type DashboardStatItem,
  type DashboardUserGrowthItem,
} from '../services/dashboardService'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatItem[]>([])
  const [recentUsers, setRecentUsers] = useState<DashboardRecentUser[]>([])
  const [reportManagement, setReportManagement] = useState<DashboardReportItem[]>([])
  const [matchSuccessChartData, setMatchSuccessChartData] = useState<DashboardMatchSuccessItem[]>([])
  const [userGrowthChartData, setUserGrowthChartData] = useState<DashboardUserGrowthItem[]>([])

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        setError(null)

        const [summary, recentUsersResult, recentReportsResult] = await Promise.all([
          getDashboardSummary(),
          getRecentUsersPreview(),
          getRecentReportsPreview(),
        ])

        setStats(summary.stats)
        setMatchSuccessChartData(summary.matchSuccessData)
        setUserGrowthChartData(summary.userGrowthData)
        setRecentUsers(recentUsersResult)
        setReportManagement(recentReportsResult)
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
        <ChartCard
          title="Match Success Rate"
          subtitle="Matches vs. Profile Reveals"
          action={<TrendingUp className="h-5 w-5" />}
        >
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Loading chart...
            </div>
          ) : !matchSuccessChartData.length ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No match data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchSuccessChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ecf3" />
                <XAxis dataKey="month" tick={{ fill: '#8a94a6', fontSize: 12 }} />
                <YAxis tick={{ fill: '#8a94a6', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="matches" fill="#5b5ce2" radius={[8, 8, 0, 0]} />
                <Bar dataKey="reveals" fill="#9d8cff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="User Growth"
          subtitle="New registrations over time"
          action={<Users className="h-5 w-5" />}
        >
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Loading chart...
            </div>
          ) : !userGrowthChartData.length ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No user growth data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ecf3" />
                <XAxis dataKey="month" tick={{ fill: '#8a94a6', fontSize: 12 }} />
                <YAxis tick={{ fill: '#8a94a6', fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#5b5ce2"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#5b5ce2' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
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
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {reportManagement.map((report) => (
                <tr key={report.id} className="border-t border-[var(--color-border)]">
                  <td className="px-6 py-5 font-medium text-slate-800">{report.reporter}</td>
                  <td className="px-6 py-5 text-slate-600">{report.type}</td>
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
                      {report.status}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-5">
                    <button className="font-semibold text-[var(--color-brand)] transition hover:opacity-80">
                      Review
                    </button>
                  </td>
                </tr>
              ))}

              {!reportManagement.length && !loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
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