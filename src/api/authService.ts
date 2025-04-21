import apiClient from './apiClient';

export enum SectorType {
  Azerbaijani = 0,
  Russian = 1,
  English = 2
}

// Role IDs from backend
export enum UserRole {
  Admin = 1,
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
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  group: number;
  sector: SectorType;
  profilePictureUrl?: string;
  roleId: number;
  role?: string;
}

// Helper function to get full name from user object
export const getFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log("Login credentials:", credentials);

      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      // Create request with proper headers for form data
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
      
      // Temporary solution for testing - mock response
      // Will be removed when backend returns user data
      const mockUser: User = {
        id: '1',
        username: credentials.username,
        firstName: 'Test',
        lastName: 'User',
        email: `${credentials.username}@example.com`,
        phoneNumber: '+994501234567',
        group: 1,
        sector: SectorType.Azerbaijani,
        roleId: UserRole.Student
      };
      
      return mockUser;
      
      // Uncomment when backend supports /auth/me
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
      formData.append('sector', data.sector.toString());
      
      // Add profile picture if provided
      if (data.profilePicture) {
        formData.append('profilePicture', data.profilePicture);
      }
      
      // For debugging, output FormData keys
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
      
      // Temporary solution for testing
      const mockUser: User = {
        id: '1',
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        group: data.group,
        sector: data.sector,
        roleId: data.roleId
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
      // If request fails, token is likely invalid
      this.logout();
      return null;
    }
  },
  
  logout(): void {
    localStorage.removeItem('auth_token');
    // Reload page or redirect to home
    window.location.href = '/';
  },
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
  
  isAdmin(user: User | null): boolean {
    return user?.roleId === UserRole.Admin;
  },
  
  isTeacher(user: User | null): boolean {
    return user?.roleId === UserRole.Teacher;
  }
};

export const { login, register, getCurrentUser, logout, getToken, isAuthenticated } = authService; 