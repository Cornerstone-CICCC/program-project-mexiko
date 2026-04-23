import { Platform } from "react-native";

// On Android, 'localhost' refers to the device itself, not the dev machine.
// Use your machine's LAN IP for Android so the app can reach the backend.
// For web, localhost works fine.
const LAN_IP = "10.0.2.2";

const API_BASE_URL =
  Platform.OS === "android"
    ? `http://${LAN_IP}:3500`
    : "http://localhost:3500";

export const API_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/users/signup`,
  LOGIN: `${API_BASE_URL}/users/login`,
  LOGOUT: `${API_BASE_URL}/users/logout`,
  USERS: `${API_BASE_URL}/users`,
  USER: (id: string) => `${API_BASE_URL}/users/${id}`,
  MATCHES: `${API_BASE_URL}/match`,
  MATCHES_WITH_FILTERS: (params: URLSearchParams) =>
    `${API_BASE_URL}/match?${params.toString()}`,
  REPORTS: `${API_BASE_URL}/reports`,
  MY_REPORTS: `${API_BASE_URL}/reports/me`,
};

export default API_BASE_URL;