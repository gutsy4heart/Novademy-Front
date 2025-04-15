import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, getCurrentUser, login as apiLogin, register as apiRegister, logout as apiLogout, SectorType } from '../api/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    email: string, 
    phoneNumber: string, 
    roleId: number, 
    group: number, 
    sector: SectorType, 
    profilePicture?: File
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Проверка состояния авторизации при загрузке
    const checkAuthStatus = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    console.log("AuthContext: Login attempt with username:", username);
    
    try {
      const userData = await apiLogin({ username, password });
      console.log("AuthContext: Login successful, user data:", userData);
      setUser(userData);
    } catch (err: any) {
      console.error("AuthContext: Login failed:", err);
      setError(err.message || 'Giriş zamanı xəta baş verdi');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    email: string, 
    phoneNumber: string, 
    roleId: number, 
    group: number, 
    sector: SectorType, 
    profilePicture?: File
  ) => {
    setError(null);
    setIsLoading(true);
    console.log("AuthContext: Register attempt with data:", { 
      username, firstName, lastName, email, phoneNumber, roleId, group, sector, hasProfilePicture: !!profilePicture 
    });
    
    try {
      const userData = await apiRegister({ 
        username, 
        password, 
        firstName, 
        lastName, 
        email, 
        phoneNumber, 
        roleId, 
        group, 
        sector, 
        profilePicture 
      });
      console.log("AuthContext: Registration successful, user data:", userData);
      setUser(userData);
    } catch (err: any) {
      console.error("AuthContext: Registration failed:", err);
      setError(err.message || 'Qeydiyyat zamanı xəta baş verdi');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log("Context");
  console.log(context);
  return context;
}; 