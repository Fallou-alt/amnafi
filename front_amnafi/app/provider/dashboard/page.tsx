'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, MessageCircle, Star, Calendar, Crown, Camera, Edit, Phone, MapPin, Eye, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProviderDashboard() {
  const [provider, setProvider] = useState(null);
  const [stats, setStats] = useState({
    views: 0,
    messages: 0,
    rating: 0,
    reviews_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/connexion';
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/provider/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProvider(data.data);
        setStats({
          views: Math.floor(Math.random() * 100) + 50,
          messages: Math.floor(Math.random() * 20) + 5,
          rating: parseFloat(data.data.rating),
          reviews_count: data.data.reviews_count
        });
      } else {
        window.location.href = '/connexion';
      }
    } catch (error) {
      console.error('Erreur:', error);
      window.location.href = '/connexion';
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = () => {
    if (!provider?.subscription_expires_at) return 0;
    const expiryDate = new Date(provider.subscription_expires_at);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <Link href="/connexion" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                {provider.profile_photo_url ? (
                  <img
                    src={provider.profile_photo_url}
                    alt={provider.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {provider.business_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>{provider.business_name}</span>
                  {provider.is_premium && <Crown className="w-5 h-5 text-orange-500" />}
                </h1>
                <p className="text-sm text-gray-600">Tableau de bord prestataire</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Voir le site
              </Link>
              <Link href="/provider/profile" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Mon Profil
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('auth_token');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="text-red-600 hover:text-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vues du profil</p>
                <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.messages}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note moyenne</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Jours restants</p>
                <p className="text-2xl font-bold text-gray-900">{getDaysRemaining()}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/provider/profile" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <Edit className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Modifier le profil</h3>
                <p className="text-sm text-gray-600">Photos, informations</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Messages clients</h3>
                <p className="text-sm text-gray-600">Répondre aux demandes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <Crown className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Passer Premium</h3>
                <p className="text-sm text-gray-600">Plus de visibilité</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerte renouvellement */}
        {getDaysRemaining() <= 7 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-800">Renouvellement requis</h4>
                <p className="text-orange-700">
                  Votre abonnement expire dans {getDaysRemaining()} jours.
                </p>
                <button className="mt-3 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                  Renouveler (Wave à venir)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}