'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginCredentials, RegisterData } from '../services/authService';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getUser();
          setUser(userData.data);
        }
      } catch (error) {
        console.error('Failed to get user data:', error);
        authService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Check if we have access_token in response
      if (response.access_token) {
        try {
          // Get user data after successful login
          const userData = await authService.getUser();
          console.log('User data response:', userData);
          setUser(userData.data);
        } catch (userError) {
          console.error('Failed to get user data after login:', userError);
          // If we can't get user data, we can still consider user logged in
          // since we have the token
          setUser({
            id: 0,
            name: 'User',
            username: credentials.username,
            email: ''
          });
        }
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authService.register(userData);
      // Check if we have access_token in response
      if (response.access_token) {
        // For register, user data is included in the response
        if (response.data) {
          setUser(response.data);
        } else {
          // Fallback: get user data from API
          const userResponse = await authService.getUser();
          setUser(userResponse.data);
        }
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 