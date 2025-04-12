import apiClient from '../api/apiClient';

export interface RegisterData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  group: number;
  sector: number;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    role: string;
  };
}

export const register = async (data: RegisterData): Promise<void> => {
  await apiClient.post('/auth/register', data);
};

export const login = async (username: string, password: string): Promise<string> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', { username, password });
  const { token, user } = response.data as AuthResponse;
  localStorage.setItem('token', token);
  localStorage.setItem('userRole', user.role);
  localStorage.setItem('userId', user.id);
  return token;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const isAdmin = (): boolean => {
  return localStorage.getItem('userRole') === 'admin';
}; 