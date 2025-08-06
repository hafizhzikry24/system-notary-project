import api from './api';
import { environment } from '../environment/environment';

export interface LoginCredentials {
  username: string;
  password: string;
  token_identifier?: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  data?: any;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Include token identifier if provided
    const payload = {
      ...credentials,
      token_identifier: environment.token_identifier,
    };

    const response = await api.post('/login', payload);
    const { access_token } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('access_token', access_token);
    
    return response.data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/register', userData);
    const { access_token } = response.data;
    
    // Store token in localStorage
    localStorage.setItem('access_token', access_token);
    
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  async getUser(): Promise<any> {
    const response = await api.get('/user');
    return response.data;
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  clearAuth(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}; 