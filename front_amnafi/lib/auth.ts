import api from '@/lib/api';
import { AuthResponse, LoginData, RegisterData, User } from '@/types';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    return { user, token };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    return { user, token };
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async getUser(): Promise<User> {
    const response = await api.get('/user');
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};