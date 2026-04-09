import { useEffect, useState } from 'react'
import StatusBadge from '../components/ui/StatusBadge'
import { getMatches } from '../services/matchService'

interface MatchUser {
  _id?: string
  id?: string
  email?: string
  fullName?: {
    first?: string
    last?: string
  }
}

interface MatchItem {
  _id?: string
  id?: string
  users?: MatchUser[]
  userA?: MatchUser
  userB?: MatchUser
  status?: string
  synergyScore?: number
  compatibilityScore?: number
  createdAt?: string
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getUserDisplayName = (user?: MatchUser) => {
    if (!user) return 'Unknown User'

    const fullName = [user.fullName?.first, user.fullName?.last]
      .filter(Boolean)
      .join(' ')
      .trim()

    if (fullName) return fullName
    if (user.email) return user.email

    return 'Unknown User'
  }

  const getPairDisplay = (match: MatchItem) => {
    if (Array.isArray(match.users) && match.users.length >= 2) {
      return `${getUserDisplayName(match.users[0])} & ${getUserDisplayName(match.users[1])}`
    }

    if (match.userA || match.userB) {
      return `${getUserDisplayName(match.userA)} & ${getUserDisplayName(match.userB)}`
    }

    return 'Unknown Pair'
  }

  const getScoreDisplay = (match: MatchItem) => {
    if (typeof match.synergyScore === 'number') return `${match.synergyScore}%`
    if (typeof match.compatibilityScore === 'number') return `${match.compatibilityScore}%`
    return '-'
  }

  const normalizeStatus = (status?: string) => {
    if (!status) return 'pending'

    const normalized = status.toLowerCase()

    if (normalized.includes('accept')) return 'resolved'
    if (normalized.includes('match')) return 'reviewing'
    if (normalized.includes('pending')) return 'pending'
    if (normalized.includes('active')) return 'reviewing'
    if (normalized.includes('success')) return 'resolved'
    if (normalized.includes('reject')) return 'pending'

    return 'reviewing'
  }

  const getStatusLabel = (status?: string) => {
    if (!status) return 'Pending'
    return status
  }

  const loadMatches = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getMatches()

      const normalizedMatches = Array.isArray(data)
        ? data
        : Array.isArray(data?.matches)
          ? data.matches
          : Array.isArray(data?.data)
            ? data.data
            : []

      setMatches(normalizedMatches)
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
                <th className="px-6 py-4">Pair</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr
                  key={match._id || match.id}
                  className="border-t border-[var(--color-border)]"
                >
                  <td className="px-6 py-5 font-medium text-slate-800">
                    {getPairDisplay(match)}
                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {getScoreDisplay(match)}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge variant={normalizeStatus(match.status)}>
                      {getStatusLabel(match.status)}
                    </StatusBadge>
                  </td>
                </tr>
              ))}

              {!matches.length ? (
                <tr>
                  <td
                    colSpan={3}
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