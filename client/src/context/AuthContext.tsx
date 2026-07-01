import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export type Role = 'STUDENT' | 'MENTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Attempt to fetch current user profile
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error("Auth init failed, session might be expired", error);
          // Token refresh is handled by the api interceptor, 
          // but if it completely fails, we clear state.
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      // Tell backend to invalidate refresh token
      await api.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/login'; // Or use React Router navigation where appropriate
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
