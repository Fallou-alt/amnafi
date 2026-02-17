import api from '@/lib/api';

export const apiService = {
  async testConnection() {
    const response = await api.get('/test');
    return response.data;
  },

  async getHealth() {
    const response = await api.get('/health');
    return response.data;
  },

  async getAppInfo() {
    const response = await api.get('/public/app-info');
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/public/categories');
    return response.data;
  },

  async getServices() {
    const response = await api.get('/public/services');
    return response.data;
  },

  async getProviders() {
    const response = await api.get('/public/providers');
    return response.data;
  }
};