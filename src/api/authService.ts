import apiClient from './apiClient';

export enum SectorType {
  Azerbaijani = 'Azerbaijani',
  Russian = 'Russian',
  English = 'English'
}

export enum UserRole {
  Teacher = 2,
  Student = 3
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
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

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log("Login credentials:", credentials);

      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      // Создаем отдельный запрос с правильными заголовками для формы
      const response = await apiClient.post<{ accessToken: string, refreshToken: string }>(
        '/auth/login', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      console.log("Auth response:", response.data);
      localStorage.setItem('auth_token', response.data.accessToken);
      
      // Временное решение для тестирования - сделаем mock ответа
      // Когда бэкенд будет возвращать данные пользователя, уберите это
      const mockUser: User = {
        id: '1',
        fullName: credentials.username,
        email: `${credentials.username}@example.com`,
        role: 'user'
      };
      
      return mockUser;
      
      // Раскомментируйте когда бэкенд будет поддерживать /auth/me
      // const userResponse = await apiClient.get<User>('/auth/me');
      // return userResponse.data;
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Giriş zamanı xəta baş verdi');
    }
  },
  
  async register(data: RegisterData): Promise<User> {
    try {
      console.log("Register data:", data);
      
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
      
      // Если есть файл изображения профиля, добавляем его
      if (data.profilePicture) {
        formData.append('profilePicture', data.profilePicture);
      }
      
      // Для отладки выведем содержимое FormData через ключи
      console.log("FormData keys:");
      console.log('username', formData.get('username'));
      console.log('password', '***');
      console.log('firstName', formData.get('firstName'));
      console.log('lastName', formData.get('lastName'));
      console.log('email', formData.get('email'));
      console.log('phoneNumber', formData.get('phoneNumber'));
      console.log('roleId', formData.get('roleId'));
      console.log('group', formData.get('group'));
      console.log('sector', formData.get('sector'));
      console.log('profilePicture', formData.has('profilePicture'));
      
      const response = await apiClient.post<{ accessToken: string, refreshToken: string }>(
        '/auth/register', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      console.log("Register response:", response.data);
      localStorage.setItem('auth_token', response.data.accessToken);
      
      // Временное решение для тестирования - сделаем mock ответа
      const mockUser: User = {
        id: '1',
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        role: 'user'
      };
      
      return mockUser;
    } catch (error: any) {
      console.error("Register error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        if (error.response.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error('Qeydiyyat zamanı xəta baş verdi');
    }
  },
  
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      // Если запрос не удался, скорее всего токен недействителен
      this.logout();
      return null;
    }
  },
  
  logout(): void {
    localStorage.removeItem('auth_token');
    // Перезагрузка страницы или редирект на главную
    window.location.href = '/';
  },
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

export const { login, register, getCurrentUser, logout, getToken, isAuthenticated } = authService; 