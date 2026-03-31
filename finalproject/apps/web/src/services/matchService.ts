import api from './api'

export async function getMatches() {
  const response = await api.get('/match')
  const data = response.data

  if (Array.isArray(data)) return data
  if (Array.isArray(data?.matches)) return data.matches
  if (Array.isArray(data?.data)) return data.data

  return []
}

export async function applyMatch(payload: Record<string, unknown>) {
  const response = await api.post('/match', payload)
  return response.data
}

export async function handleMatchInteraction(
  matchId: string,
  payload: Record<string, unknown>,
) {
  const response = await api.patch(`/match/${matchId}`, payload)
  return response.data
}