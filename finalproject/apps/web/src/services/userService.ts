import api from './api'

export async function getUsers() {
  const response = await api.get('/users')
  const data = response.data

  if (Array.isArray(data)) return data
  if (Array.isArray(data?.users)) return data.users
  if (Array.isArray(data?.data)) return data.data

  return []
}

export async function getUserById(id: string) {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export async function updateUser(id: string, payload: Record<string, unknown>) {
  const response = await api.put(`/users/${id}`, payload)
  return response.data
}

export async function toggleAdmin(id: string) {
  const response = await api.patch(`/users/${id}/admin`)
  return response.data
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/users/${id}`)
  return response.data
}