import { useEffect, useState } from 'react'
import { getUsers } from '../services/userService'

interface FullName {
  first?: string
  last?: string
}

interface UserItem {
  _id?: string
  id?: string
  email?: string
  isAdmin?: boolean
  mbtiType?: string
  fullName?: FullName
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getUserDisplayName = (user: UserItem) => {
    const fullName = [user.fullName?.first, user.fullName?.last]
      .filter(Boolean)
      .join(' ')
      .trim()

    if (fullName) return fullName

    return 'No name'
  }

  const getUserMbti = (user: UserItem) => {
    if (!user.mbtiType || user.mbtiType === 'NOT_SPECIFIED') {
      return '-'
    }

    return user.mbtiType
  }

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error(err)
      setError('Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-main)]">
          Users Management
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-soft)]">
          Search, review, and manage user accounts.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-slate-500">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">MBTI</th>
                <th className="px-6 py-4">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id || user.id || user.email}
                  className="border-t border-[var(--color-border)]"
                >
                  <td className="px-6 py-5 font-medium text-slate-800">
                    {getUserDisplayName(user)}
                  </td>
                  <td className="px-6 py-5 text-slate-600">{user.email || '-'}</td>
                  <td className="px-6 py-5 text-slate-600">{getUserMbti(user)}</td>
                  <td className="px-6 py-5 text-slate-600">
                    {user.isAdmin ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}

              {!users.length ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    No users found.
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