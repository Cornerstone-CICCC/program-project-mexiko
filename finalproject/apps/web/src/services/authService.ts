import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const response = await api.post('/users/login', payload);
  return response.data;
}

export async function signup(payload: SignupPayload) {
  const response = await api.post('/users/signup', payload);
  return response.data;
}

export async function logout() {
  const response = await api.post('/users/logout');
  return response.data;
}