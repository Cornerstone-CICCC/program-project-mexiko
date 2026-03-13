import api from "./api";

export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard/stats");
  return res.data;
};

export const getRecentUsers = async () => {
  const res = await api.get("/admin/users/recent");
  return res.data;
};

export const getReports = async () => {
  const res = await api.get("/admin/reports");
  return res.data;
};