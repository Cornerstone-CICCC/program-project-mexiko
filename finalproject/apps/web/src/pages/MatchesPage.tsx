import { useEffect, useState } from 'react'
import StatusBadge from '../components/ui/StatusBadge'
import { getMatches } from '../services/matchService'

type MatchItem = {
  matchId: string
  targetUserId: string
  synergyScore: number
  isOpened: boolean
  recommendedAt: string
  expiresAt: string
  targetUser: {
    email?: string
    fullName?: {
      first?: string
      last?: string
    }
    mbtiType?: string
    bio?: string
  }
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getUserDisplayName = (match: MatchItem) => {
    const first = match.targetUser?.fullName?.first || ''
    const last = match.targetUser?.fullName?.last || ''
    return `${first} ${last}`.trim() || match.targetUser?.email || 'Unknown'
  }

  const getMbtiDisplay = (match: MatchItem) => {
    return match.targetUser?.mbtiType || 'N/A'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '-'

    return date.toLocaleDateString()
  }

  const loadMatches = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getMatches()
      setMatches(data as MatchItem[])
    } catch (err) {
      console.error(err)
      setError('Could not load matches.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMatches()
  }, [])

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-main)]">
          Matches
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-soft)]">
          Review generated matches and pair activity.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-slate-500">Loading matches...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">MBTI</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Recommended</th>
                <th className="px-6 py-4">Expires</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr
                  key={`${match.matchId}-${match.targetUserId}`}
                  className="border-t border-[var(--color-border)]"
                >
                  <td className="px-6 py-5">
                    <div className="font-medium text-slate-800">
                      {getUserDisplayName(match)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {match.targetUser?.email || 'No email'}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {getMbtiDisplay(match)}
                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {match.synergyScore}%
                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {formatDate(match.recommendedAt)}
                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {formatDate(match.expiresAt)}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge variant={match.isOpened ? 'resolved' : 'pending'}>
                      {match.isOpened ? 'Opened' : 'New'}
                    </StatusBadge>
                  </td>
                </tr>
              ))}

              {!matches.length ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    No matches found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}