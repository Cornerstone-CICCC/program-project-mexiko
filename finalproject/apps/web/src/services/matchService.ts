import api from './api';

export async function getMatches() {
  const response = await api.get('/match');
  return response.data;
}

export async function applyMatch(payload: Record<string, unknown>) {
  const response = await api.post('/match', payload);
  return response.data;
}

export async function handleMatchInteraction(
  matchId: string,
  payload: Record<string, unknown>,
) {
  const response = await api.patch(`/match/${matchId}`, payload);
  return response.data;
}