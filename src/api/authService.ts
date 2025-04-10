import apiClient from './apiClient';

interface LoginCredentials {
  username: string;
  password: string;
}

export enum SectorType {
  Azerbaijani = 'Azerbaijani',
  Russian = 'Russian',
  English = 'English'
}

interface RegisterData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  group: number;
  sector: SectorType;
  profilePicture?: File;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  group: number;
  sector: SectorType;
  profilePictureUrl?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await apiClient.post<AuthResponse>('/auth/login', formData);
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  },

  async register(data: RegisterData): Promise<void> {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('roleId', data.roleId.toString());
    formData.append('group', data.group.toString());
    formData.append('sector', data.sector);
    if (data.profilePicture) {
      formData.append('profilePicture', data.profilePicture);
    }

    await apiClient.post('/auth/register', formData);
  },

  async logout(userId: string): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    await apiClient.post(`/auth/logout/${userId}`);
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await apiClient.post<AuthResponse>('/auth/refresh', { token: refreshToken });
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  }
}; 