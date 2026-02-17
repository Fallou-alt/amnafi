'use client';

import { useState, useEffect } from 'react';

interface DashboardStats {
  total_providers: number;
  active_providers: number;
  inactive_providers: number;
  premium_providers: number;
  today_registrations: number;
  estimated_revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Prestataires',
      value: stats?.total_providers || 0,
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'Prestataires Actifs',
      value: stats?.active_providers || 0,
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Prestataires Inactifs',
      value: stats?.inactive_providers || 0,
      icon: '❌',
      color: 'bg-red-500'
    },
    {
      title: 'Comptes Premium',
      value: stats?.premium_providers || 0,
      icon: '⭐',
      color: 'bg-yellow-500'
    },
    {
      title: 'Inscriptions Aujourd\'hui',
      value: stats?.today_registrations || 0,
      icon: '📅',
      color: 'bg-purple-500'
    },
    {
      title: 'Revenus Estimés',
      value: `${stats?.estimated_revenue?.toFixed(2) || 0}€`,
      icon: '💰',
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.color} text-white text-2xl`}>
                  {card.icon}
                </div>
              </div>
            </div>
            <div className={`h-2 ${card.color}`}></div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/prestataires"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">👥</span>
            <div>
              <p className="font-medium text-gray-900">Gérer les Prestataires</p>
              <p className="text-sm text-gray-600">Activer, désactiver, modifier</p>
            </div>
          </a>
          
          <a
            href="/admin/statistiques"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mr-3">📈</span>
            <div>
              <p className="font-medium text-gray-900">Voir les Statistiques</p>
              <p className="text-sm text-gray-600">Graphiques et analyses</p>
            </div>
          </a>
          
          <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
            <span className="text-2xl mr-3">⚙️</span>
            <div>
              <p className="font-medium text-gray-500">Paramètres</p>
              <p className="text-sm text-gray-400">Bientôt disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}