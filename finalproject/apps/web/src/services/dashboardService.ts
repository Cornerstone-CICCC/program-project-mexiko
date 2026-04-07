import { getUsers } from './userService'
import { getReports } from './reportService'
import { getMatches } from './matchService'

type Trend = 'up' | 'down'
type StatIcon = 'users' | 'matches' | 'messages' | 'reports'

export interface DashboardStatItem {
  title: string
  value: string
  change: string
  trend: Trend
  icon: StatIcon
}

export interface DashboardMatchSuccessItem {
  month: string
  matches: number
  reveals: number
}

export interface DashboardUserGrowthItem {
  month: string
  users: number
}

export interface DashboardRecentUser {
  id: string
  name: string
  mbti: string
  status: 'Active' | 'Inactive'
  joined: string
}

export interface DashboardReportItem {
  id: string
  reporter: string
  type: string
  status: 'Pending' | 'Reviewing' | 'Resolved'
}

interface FullName {
  first?: string
  last?: string
}

interface RawUser {
  _id?: string
  id?: string
  firebaseUid?: string
  email?: string
  fullName?: FullName
  mbtiType?: string
  isDeleted?: boolean
  isSuspended?: boolean
  createdAt?: string
}

interface RawReport {
  _id?: string
  id?: string
  reporterId?: string
  reportedUserId?: string
  reason?: string
  type?: string
  status?: string
  createdAt?: string
}

interface RawMatch {
  _id?: string
  id?: string
  createdAt?: string
  status?: string
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

function getMonthLabel(dateString?: string) {
  if (!dateString) return 'Unknown'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Unknown'

  return date.toLocaleString('en-US', { month: 'short' })
}

function sortMonthLabels(labels: string[]) {
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return [...labels].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
}

function getUserDisplayName(user: RawUser) {
  const fullName = [user.fullName?.first, user.fullName?.last]
    .filter(Boolean)
    .join(' ')
    .trim()

  if (fullName) return fullName
  return user.email || 'Unknown User'
}

function getUserMbti(user: RawUser) {
  if (!user.mbtiType || user.mbtiType === 'NOT_SPECIFIED') return '-'
  return user.mbtiType
}

function getUserStatus(user: RawUser): 'Active' | 'Inactive' {
  if (user.isDeleted || user.isSuspended) return 'Inactive'
  return 'Active'
}

function getRelativeJoined(dateString?: string) {
  if (!dateString) return '-'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '-'

  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
}

function normalizeReportStatus(status?: string): 'Pending' | 'Reviewing' | 'Resolved' {
  const normalized = (status || '').toLowerCase()

  if (normalized.includes('pending')) return 'Pending'
  if (normalized.includes('review')) return 'Reviewing'
  return 'Resolved'
}

function getReportType(report: RawReport) {
  return report.type || report.reason || 'No reason'
}

function buildUserLookup(users: RawUser[]) {
  const lookup = new Map<string, string>()

  for (const user of users) {
    const name = getUserDisplayName(user)

    if (user._id) lookup.set(user._id, name)
    if (user.id) lookup.set(user.id, name)
    if (user.firebaseUid) lookup.set(user.firebaseUid, name)
    if (user.email) lookup.set(user.email, name)
  }

  return lookup
}

function getReporterDisplay(report: RawReport, userLookup: Map<string, string>) {
  const rawReporterId = report.reporterId

  if (!rawReporterId) return 'Unknown'

  return userLookup.get(rawReporterId) || rawReporterId
}

export async function getDashboardSummary() {
  const [usersRaw, reportsRaw, matchesRaw] = await Promise.all([
    getUsers(),
    getReports().catch(() => []),
    getMatches().catch(() => []),
  ])

  const users = Array.isArray(usersRaw) ? (usersRaw as RawUser[]) : []
  const reports = Array.isArray(reportsRaw) ? (reportsRaw as RawReport[]) : []
  const matches = Array.isArray(matchesRaw) ? (matchesRaw as RawMatch[]) : []

  const pendingReports = reports.filter(
    (report) => normalizeReportStatus(report.status) === 'Pending',
  ).length

  const stats: DashboardStatItem[] = [
    {
      title: 'Total Users',
      value: formatNumber(users.length),
      change: '+0.0%',
      trend: 'up',
      icon: 'users',
    },
    {
      title: 'Active Matches',
      value: formatNumber(matches.length),
      change: '+0.0%',
      trend: 'up',
      icon: 'matches',
    },
    {
      title: 'Messages Today',
      value: formatNumber(0),
      change: '+0.0%',
      trend: 'up',
      icon: 'messages',
    },
    {
      title: 'Reports Pending',
      value: formatNumber(pendingReports),
      change: '+0.0%',
      trend: pendingReports > 0 ? 'down' : 'up',
      icon: 'reports',
    },
  ]

  const userMonthMap = new Map<string, number>()
  users.forEach((user) => {
    const label = getMonthLabel(user.createdAt)
    if (label === 'Unknown') return
    userMonthMap.set(label, (userMonthMap.get(label) || 0) + 1)
  })

  const userGrowthData: DashboardUserGrowthItem[] = sortMonthLabels([...userMonthMap.keys()]).map(
    (month) => ({
      month,
      users: userMonthMap.get(month) || 0,
    }),
  )

  const matchMonthMap = new Map<string, number>()
  matches.forEach((match) => {
    const label = getMonthLabel(match.createdAt)
    if (label === 'Unknown') return
    matchMonthMap.set(label, (matchMonthMap.get(label) || 0) + 1)
  })

  const allChartMonths = sortMonthLabels([
    ...new Set([...userMonthMap.keys(), ...matchMonthMap.keys()]),
  ])

  const matchSuccessData: DashboardMatchSuccessItem[] = allChartMonths.map((month) => ({
    month,
    matches: matchMonthMap.get(month) || 0,
    reveals: Math.max(Math.round((matchMonthMap.get(month) || 0) * 0.8), 0),
  }))

  return {
    stats,
    matchSuccessData,
    userGrowthData,
  }
}

export async function getRecentUsersPreview() {
  const usersRaw = await getUsers()
  const users = Array.isArray(usersRaw) ? (usersRaw as RawUser[]) : []

  return users
    .slice()
    .sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime()
      const bTime = new Date(b.createdAt || 0).getTime()
      return bTime - aTime
    })
    .slice(0, 5)
    .map<DashboardRecentUser>((user) => ({
      id: user._id || user.id || user.email || crypto.randomUUID(),
      name: getUserDisplayName(user),
      mbti: getUserMbti(user),
      status: getUserStatus(user),
      joined: getRelativeJoined(user.createdAt),
    }))
}

export async function getRecentReportsPreview() {
  const [reportsRaw, usersRaw] = await Promise.all([
    getReports(),
    getUsers(),
  ])

  const reports = Array.isArray(reportsRaw) ? (reportsRaw as RawReport[]) : []
  const users = Array.isArray(usersRaw) ? (usersRaw as RawUser[]) : []
  const userLookup = buildUserLookup(users)

  return reports
    .slice()
    .sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime()
      const bTime = new Date(b.createdAt || 0).getTime()
      return bTime - aTime
    })
    .slice(0, 5)
    .map<DashboardReportItem>((report) => ({
      id: report._id || report.id || crypto.randomUUID(),
      reporter: getReporterDisplay(report, userLookup),
      type: getReportType(report),
      status: normalizeReportStatus(report.status),
    }))
}