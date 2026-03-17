import api from './api';

export interface OfficialProvider {
  id: number;
  full_name: string;
  photo: string;
  specialty: string;
  description: string;
  certifications: string[];
  years_experience: number;
  intervention_zone: string;
  availability: 'available' | 'busy' | 'unavailable';
  languages: string[];
  is_bilingual: boolean;
  badge_number: string;
  is_active: boolean;
}

export interface JojMission {
  id: number;
  tourist_id: number;
  official_provider_id?: number;
  title: string;
  description: string;
  location: string;
  preferred_date: string;
  status: 'pending' | 'validated' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes?: string;
  validated_at?: string;
  assigned_at?: string;
  official_provider?: OfficialProvider;
  created_at: string;
  updated_at: string;
}

export interface CreateMissionData {
  title: string;
  description: string;
  location: string;
  preferred_date: string;
}

export const jojApi = {
  getOfficialProviders: async (params?: { specialty?: string; zone?: string; language?: string }) => {
    const { data } = await api.get<{ data: OfficialProvider[] }>('/joj/official-providers', { params });
    return data.data;
  },

  getOfficialProvider: async (id: number) => {
    const { data } = await api.get<{ data: OfficialProvider }>(`/joj/official-providers/${id}`);
    return data.data;
  },

  createMission: async (missionData: CreateMissionData) => {
    const { data } = await api.post<{ data: JojMission }>('/joj/missions', missionData);
    return data.data;
  },

  getMyMissions: async () => {
    const { data } = await api.get<{ data: JojMission[] }>('/joj/missions');
    return data.data;
  },

  getAllMissions: async (status?: string) => {
    const { data } = await api.get<{ data: JojMission[] }>('/joj/admin/missions', { params: { status } });
    return data.data;
  },

  validateMission: async (id: number, notes?: string) => {
    const { data } = await api.post<{ data: JojMission }>(`/joj/admin/missions/${id}/validate`, { admin_notes: notes });
    return data.data;
  },

  assignMission: async (id: number, providerId: number, notes?: string) => {
    const { data } = await api.post<{ data: JojMission }>(`/joj/admin/missions/${id}/assign`, { 
      official_provider_id: providerId,
      admin_notes: notes 
    });
    return data.data;
  },

  cancelMission: async (id: number, reason: string) => {
    const { data } = await api.post<{ data: JojMission }>(`/joj/admin/missions/${id}/cancel`, { reason });
    return data.data;
  },

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
