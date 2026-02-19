'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { User, Settings, LogOut, Crown, Calendar, CheckCircle, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

export default function ProviderDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/provider/login');
        return;
      }

      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response?.status === 401) {
        router.push('/provider/login');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('provider');
    router.push('/provider/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">AMNAFI - Espace Prestataire</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            {profile?.provider?.profile_photo ? (
              <img 
                src={profile.provider.profile_photo} 
                alt="Profil" 
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-10 h-10" />
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold">Bienvenue, {profile?.user?.name}</h2>
              <p className="text-blue-100 mt-1">{profile?.provider?.business_name}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Statut</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {profile?.provider?.is_verified ? 'Vérifié' : 'En attente'}
                </p>
              </div>
              <CheckCircle className={`w-12 h-12 ${profile?.provider?.is_verified ? 'text-green-500' : 'text-gray-300'}`} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Abonnement</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">
                  {profile?.provider?.subscription_type || 'Gratuit'}
                </p>
              </div>
              <Crown className={`w-12 h-12 ${profile?.provider?.is_premium ? 'text-yellow-500' : 'text-gray-300'}`} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Note moyenne</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {profile?.provider?.rating || '0.0'} ⭐
                </p>
              </div>
              <div className="text-gray-400 text-sm">
                {profile?.provider?.reviews_count || 0} avis
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        {profile?.provider?.subscription_expires_at && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800">
                Votre abonnement expire le{' '}
                <strong>{new Date(profile.provider.subscription_expires_at).toLocaleDateString('fr-FR')}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/provider/profile"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Modifier mon profil</h3>
                <p className="text-gray-600 text-sm">Gérer vos informations personnelles et professionnelles</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mes services</h3>
                <p className="text-gray-600 text-sm">Bientôt disponible</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Informations du profil</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{profile?.user?.email || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-gray-600">Téléphone</p>
              <p className="font-medium">{profile?.user?.phone || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-gray-600">Ville</p>
              <p className="font-medium">{profile?.provider?.city || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-gray-600">Catégorie</p>
              <p className="font-medium">{profile?.provider?.category?.name || 'Non renseigné'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
