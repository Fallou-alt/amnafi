import api from '../api';
import { OfficialProvider, JojMission, CreateMissionData } from '@/types/joj';

export const jojApi = {
  // Public - Liste des prestataires officiels
  getOfficialProviders: async (params?: { specialty?: string; zone?: string; language?: string }) => {
    const { data } = await api.get<{ data: OfficialProvider[] }>('/joj/official-providers', { params });
    return data.data;
  },

  // Public - Détail d'un prestataire officiel
  getOfficialProvider: async (id: number) => {
    const { data } = await api.get<{ data: OfficialProvider }>(`/joj/official-providers/${id}`);
    return data.data;
  },

  // Touriste - Créer une mission
  createMission: async (missionData: CreateMissionData) => {
    const { data } = await api.post<{ data: JojMission }>('/joj/missions', missionData);
    return data.data;
  },

  // Touriste - Mes missions
  getMyMissions: async () => {
    const { data } = await api.get<{ data: JojMission[] }>('/joj/missions');
    return data.data;
  },

  // Admin - Toutes les missions
  getAllMissions: async (status?: string) => {
    const { data } = await api.get<{ data: JojMission[] }>('/joj/admin/missions', { params: { status } });
    return data.data;
  },

  // Admin - Valider une mission
  validateMission: async (id: number, notes?: string) => {
    const { data } = await api.post<{ data: JojMission }>(`/joj/admin/missions/${id}/validate`, { admin_notes: notes });
    return data.data;
  },

  // Admin - Assigner une mission
  assignMission: async (id: number, providerId: number, notes?: string) => {
    const { data } = await api.post<{ data: JojMission }>(`/joj/admin/missions/${id}/assign`, { 
      official_provider_id: providerId,
      admin_notes: notes 
    });
    return data.data;
  },

  // Admin - Annuler une mission
  cancelMission: async (id: number, reason: string) => {
    const { data } = await api.post<{ data: JojMission }>(`/joj/admin/missions/${id}/cancel`, { reason });
    return data.data;
  },

  // Admin - CRUD Prestataires
  createProvider: async (providerData: FormData) => {
    const { data } = await api.post<{ data: OfficialProvider }>('/joj/admin/official-providers', providerData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data;
  },

  updateProvider: async (id: number, providerData: FormData) => {
    const { data } = await api.post<{ data: OfficialProvider }>(`/joj/admin/official-providers/${id}`, providerData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data;
  },

  deleteProvider: async (id: number) => {
    await api.delete(`/joj/admin/official-providers/${id}`);
  },

  toggleProviderStatus: async (id: number) => {
    const { data } = await api.post<{ data: OfficialProvider }>(`/joj/admin/official-providers/${id}/toggle-status`);
    return data.data;
  }
};
