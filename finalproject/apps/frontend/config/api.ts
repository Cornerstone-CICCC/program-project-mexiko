const API_BASE_URL = 'http://localhost:3500'; 

export const API_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/users/signup`,
  LOGIN: `${API_BASE_URL}/users/login`,
  LOGOUT: `${API_BASE_URL}/users/logout`,
  USERS: `${API_BASE_URL}/users`,
  USER: (id: string) => `${API_BASE_URL}/users/${id}`,
};

export default API_BASE_URL;