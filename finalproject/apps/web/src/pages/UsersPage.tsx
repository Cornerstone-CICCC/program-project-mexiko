import { useEffect, useMemo, useState } from 'react'
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

const USERS_PER_PAGE = 20

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const getUserDisplayName = (user: UserItem) => {
    const fullName = [user.fullName?.first, user.fullName?.last]
      .filter(Boolean)
      .join(' ')
      .trim()

    return fullName || 'No name'
  }

  const getUserMbti = (user: UserItem) => {
    if (!user.mbtiType || user.mbtiType === 'NOT_SPECIFIED') return '-'
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

  // 🔍 FILTER
  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase()

    return users.filter((user) => {
      const name = getUserDisplayName(user).toLowerCase()
      const email = user.email?.toLowerCase() || ''

      return name.includes(query) || email.includes(query)
    })
  }, [users, search])

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE
    return filteredUsers.slice(start, start + USERS_PER_PAGE)
  }, [filteredUsers, currentPage])

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

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

      {/* 🔍 SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[var(--color-brand)]"
        />
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-slate-500">Loading users...</div>
      ) : (
        <>
          {/* TABLE */}
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
                {paginatedUsers.map((user) => (
                  <tr
                    key={user._id || user.id || user.email}
                    className="border-t border-[var(--color-border)]"
                  >
                    <td className="px-6 py-5 font-medium text-slate-800">
                      {getUserDisplayName(user)}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {user.email || '-'}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {getUserMbti(user)}
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      {user.isAdmin ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}

                {!paginatedUsers.length ? (
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

          {/* 📄 PAGINATION UI */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-3 py-1 text-sm ${
                  page === currentPage
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}