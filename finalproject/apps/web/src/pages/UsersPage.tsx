import { useEffect, useMemo, useState } from "react";
import { getUsers } from "../services/userService";

interface FullName {
  first?: string;
  last?: string;
}

interface UserItem {
  _id?: string;
  id?: string;
  email?: string;
  isAdmin?: boolean;
  isSuspended?: boolean;
  mbtiType?: string;
  fullName?: FullName;
  bio?: string;
  Interests?: string[];
  keywords?: string[];
  reportedCount?: number;
  gender?: string;
  birthDate?: string | null;
  preferredDistance?: number;
  preferredGender?: string;
}

type SortKey = "name" | "email" | "mbti" | "suspended";
type SortDirection = "asc" | "desc";

const USERS_PER_PAGE = 20;

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const getUserDisplayName = (user: UserItem) => {
    const fullName = [user.fullName?.first, user.fullName?.last]
      .filter(Boolean)
      .join(" ")
      .trim();

    return fullName || "No name";
  };

  const getUserMbti = (user: UserItem) => {
    if (!user.mbtiType || user.mbtiType === "NOT_SPECIFIED") return "-";
    return user.mbtiType;
  };

  const getUserInterests = (user: UserItem) => {
    return user.Interests?.length ? user.Interests.join(", ") : "No interests";
  };

  const getUserKeywords = (user: UserItem) => {
    return user.keywords?.length ? user.keywords.join(", ") : "No keywords";
  };

  const getUserBirthDate = (user: UserItem) => {
    if (!user.birthDate) return "-";
    return new Date(user.birthDate).toLocaleDateString();
  };

  const getUserPreferredDistance = (user: UserItem) => {
    if (
      user.preferredDistance === undefined ||
      user.preferredDistance === null
    ) {
      return "-";
    }

    return `${user.preferredDistance} km`;
  };

  const getSuspendedLabel = (user: UserItem) => {
    return user.isSuspended ? "Suspended" : "Active";
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const sortedUsers = useMemo(() => {
    const usersCopy = [...users];

    usersCopy.sort((a, b) => {
      let valueA = "";
      let valueB = "";

      if (sortKey === "name") {
        valueA = getUserDisplayName(a).toLowerCase();
        valueB = getUserDisplayName(b).toLowerCase();
      }

      if (sortKey === "email") {
        valueA = (a.email || "").toLowerCase();
        valueB = (b.email || "").toLowerCase();
      }

      if (sortKey === "mbti") {
        valueA = getUserMbti(a).toLowerCase();
        valueB = getUserMbti(b).toLowerCase();
      }

      if (sortKey === "suspended") {
        valueA = getSuspendedLabel(a).toLowerCase();
        valueB = getSuspendedLabel(b).toLowerCase();
      }

      const comparison = valueA.localeCompare(valueB);

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return usersCopy;
  }, [users, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return sortedUsers.slice(start, start + USERS_PER_PAGE);
  }, [sortedUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortKey, sortDirection]);

  return (
    <>
      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-main)]">
            Users Management
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-soft)]">
            Review and inspect user accounts.
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
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleSort("name")}
                        className="inline-flex items-center gap-2 transition hover:text-slate-700"
                      >
                        <span>Name</span>
                        <span>{getSortIndicator("name")}</span>
                      </button>
                    </th>

                    <th className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleSort("email")}
                        className="inline-flex items-center gap-2 transition hover:text-slate-700"
                      >
                        <span>Email</span>
                        <span>{getSortIndicator("email")}</span>
                      </button>
                    </th>

                    <th className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleSort("mbti")}
                        className="inline-flex items-center gap-2 transition hover:text-slate-700"
                      >
                        <span>MBTI</span>
                        <span>{getSortIndicator("mbti")}</span>
                      </button>
                    </th>

                    <th className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleSort("suspended")}
                        className="inline-flex items-center gap-2 transition hover:text-slate-700"
                      >
                        <span>Suspended</span>
                        <span>{getSortIndicator("suspended")}</span>
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user._id || user.id || user.email}
                      onClick={() => setSelectedUser(user)}
                      className="cursor-pointer border-t border-[var(--color-border)] transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 font-medium text-slate-800">
                        {getUserDisplayName(user)}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {user.email || "-"}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {getUserMbti(user)}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {getSuspendedLabel(user)}
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

            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.max(1, Math.floor((currentPage - 1) / 10) * 10),
                  )
                }
                disabled={currentPage <= 10}
                className="rounded-lg px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const currentGroup = Math.floor((currentPage - 1) / 10);
                  const start = currentGroup * 10 + 1;
                  const end = start + 9;
                  return page >= start && page <= end;
                })
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-3 py-1 text-sm ${
                      page === currentPage
                        ? "bg-[var(--color-brand)] text-white"
                        : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(
                      totalPages,
                      Math.floor((currentPage - 1) / 10 + 1) * 10 + 1,
                    ),
                  )
                }
                disabled={
                  Math.floor((currentPage - 1) / 10) ===
                  Math.floor((totalPages - 1) / 10)
                }
                className="rounded-lg px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      {selectedUser ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  User Details
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Review the full profile information for this user.
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl px-3 py-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Full Name
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {getUserDisplayName(selectedUser)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedUser.email || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  MBTI
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {getUserMbti(selectedUser)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Gender
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedUser.gender || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Admin Status
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedUser.isAdmin ? "Yes" : "No"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Suspended Status
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedUser.isSuspended ? "Suspended" : "Active"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Reported Count
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedUser.reportedCount ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Birth Date
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {getUserBirthDate(selectedUser)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Preferred Gender
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedUser.preferredGender || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Preferred Distance
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {getUserPreferredDistance(selectedUser)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Bio
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedUser.bio || "No bio provided."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Interests
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {getUserInterests(selectedUser)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Keywords
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {getUserKeywords(selectedUser)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
