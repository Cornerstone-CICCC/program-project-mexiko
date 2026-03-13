import api from "./api";

export async function getDashboardSummary() {
  const response = await api.get("/dashboard/summary");
  return response.data;
}

export async function getRecentUsersPreview() {
  const response = await api.get("/dashboard/recent-users");
  return response.data;
}

export async function getRecentReportsPreview() {
  const response = await api.get("/dashboard/recent-reports");
  return response.data;
}