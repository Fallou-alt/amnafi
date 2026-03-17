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
