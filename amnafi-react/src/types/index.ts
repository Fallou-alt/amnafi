export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ProviderData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  metier: string;
  ville: string;
  photo?: File | null;
  statut: 'gratuit' | 'premium';
}