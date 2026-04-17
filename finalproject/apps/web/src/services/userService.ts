import api from './api'

export interface FullName {
  first?: string
  last?: string
}

export interface UserItem {
  _id?: string
  id?: string
  email?: string
  isAdmin?: boolean
  isSuspended?: boolean
  mbtiType?: string
  fullName?: FullName
  bio?: string
  hobbies?: string[]
  Interests?: string[]
  profileImage?: string
  reportedCount?: number
}

export async function getUsers() {
  const response = await api.get('/users')
  return response.data as UserItem[]
}

export async function getUserById(id: string) {
  const response = await api.get(`/users/${id}`)
  return response.data as UserItem
}

export async function updateUser(
  id: string,
  payload: Record<string, unknown>
) {
  const response = await api.patch(`/users/${id}`, payload)
  return response.data as UserItem
}

export async function toggleAdmin(id: string, isAdmin: boolean) {
  const response = await api.patch(`/users/${id}/admin`, { isAdmin })
  return response.data as UserItem
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/users/${id}`)
  return response.data as { message: string }
}