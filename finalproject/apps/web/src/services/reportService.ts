import api from './api';

export async function getReports() {
  const response = await api.get('/reports');
  return response.data;
}

export async function getReportById(id: string) {
  const response = await api.get(`/reports/${id}`);
  return response.data;
}

export async function createReport(payload: Record<string, unknown>) {
  const response = await api.post('/reports', payload);
  return response.data;
}

export async function updateReport(id: string, payload: Record<string, unknown>) {
  const response = await api.put(`/reports/${id}`, payload);
  return response.data;
}

export async function deleteReport(id: string) {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
}