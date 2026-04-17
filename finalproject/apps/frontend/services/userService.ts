import { API_ENDPOINTS } from '@/config/api'

export async function getUsers() {
  const response = await fetch(API_ENDPOINTS.USERS)
  if (!response.ok) throw new Error('Failed to fetch users')
  return await response.json()
}

export async function getUserById(id: string) {
  const response = await fetch(API_ENDPOINTS.USER(id))
  if (!response.ok) throw new Error('Failed to fetch user')
  return await response.json()
}

export async function updateUser(
  id: string,
  payload: Record<string, unknown>
) {
  const response = await fetch(API_ENDPOINTS.USER(id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include', // 🔥 importante para sesiones
  })

  if (!response.ok) throw new Error('Failed to update user')

  return await response.json()
}

export async function toggleAdmin(id: string, isAdmin: boolean) {
  const response = await fetch(`${API_ENDPOINTS.USER(id)}/admin`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isAdmin }),
    credentials: 'include',
  })

  if (!response.ok) throw new Error('Failed to toggle admin')

  return await response.json()
}

export async function deleteUser(id: string) {
  const response = await fetch(API_ENDPOINTS.USER(id), {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) throw new Error('Failed to delete user')

  return await response.json()
}