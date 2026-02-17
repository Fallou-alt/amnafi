'use client';

import { useState, useEffect } from 'react';

interface DailyStats {
  date: string;
  registrations: number;
  premium_upgrades: number;
}

interface StatsData {
  daily_stats: DailyStats[];
  growth_rate: number;
}

export default function AdminStatistics() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/api/admin/stats', {
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
        <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalRegistrations = stats?.daily_stats.reduce((sum, day) => sum + day.registrations, 0) || 0;
  const totalPremiumUpgrades = stats?.daily_stats.reduce((sum, day) => sum + day.premium_upgrades, 0) || 0;
  const avgDailyRegistrations = Math.round(totalRegistrations / 30);

  const maxRegistrations = Math.max(...(stats?.daily_stats.map(d => d.registrations) || [1]));
  const maxPremium = Math.max(...(stats?.daily_stats.map(d => d.premium_upgrades) || [1]));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Croissance</p>
              <p className={`text-2xl font-bold ${
                (stats?.growth_rate || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats?.growth_rate || 0}%
              </p>
            </div>
            <span className="text-3xl">📈</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total 30j</p>
              <p className="text-2xl font-bold text-gray-900">{totalRegistrations}</p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Premium 30j</p>
              <p className="text-2xl font-bold text-yellow-600">{totalPremiumUpgrades}</p>
            </div>
            <span className="text-3xl">⭐</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Moy/jour</p>
              <p className="text-2xl font-bold text-blue-600">{avgDailyRegistrations}</p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrations Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Inscriptions (30 derniers jours)
          </h2>
          <div className="h-64 flex items-end justify-between space-x-1">
            {stats?.daily_stats.slice(-14).map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all hover:bg-blue-600"
                  style={{
                    height: `${Math.max((day.registrations / maxRegistrations) * 200, 4)}px`
                  }}
                  title={`${day.registrations} inscriptions le ${new Date(day.date).toLocaleDateString('fr-FR')}`}
                ></div>
                <span className="text-xs text-gray-500 mt-2 transform rotate-45 origin-left">
                  {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Upgrades Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Passages Premium (30 derniers jours)
          </h2>
          <div className="h-64 flex items-end justify-between space-x-1">
            {stats?.daily_stats.slice(-14).map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-yellow-500 rounded-t w-full min-h-[4px] transition-all hover:bg-yellow-600"
                  style={{
                    height: `${Math.max((day.premium_upgrades / Math.max(maxPremium, 1)) * 200, 4)}px`
                  }}
                  title={`${day.premium_upgrades} passages premium le ${new Date(day.date).toLocaleDateString('fr-FR')}`}
                ></div>
                <span className="text-xs text-gray-500 mt-2 transform rotate-45 origin-left">
                  {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Résumé Hebdomadaire</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Cette semaine</span>
              <span className="text-lg font-bold text-blue-600">
                {stats?.daily_stats.slice(-7).reduce((sum, day) => sum + day.registrations, 0) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Semaine précédente</span>
              <span className="text-lg font-bold text-gray-600">
                {stats?.daily_stats.slice(-14, -7).reduce((sum, day) => sum + day.registrations, 0) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Premium cette semaine</span>
              <span className="text-lg font-bold text-yellow-600">
                {stats?.daily_stats.slice(-7).reduce((sum, day) => sum + day.premium_upgrades, 0) || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Indicateurs</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taux de conversion Premium</span>
              <span className="font-semibold text-gray-900">
                {totalRegistrations > 0 
                  ? `${Math.round((totalPremiumUpgrades / totalRegistrations) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Meilleur jour</span>
              <span className="font-semibold text-gray-900">
                {stats?.daily_stats.reduce((best, day) => 
                  day.registrations > best.registrations ? day : best
                )?.registrations || 0} inscriptions
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenus estimés (30j)</span>
              <span className="font-semibold text-green-600">
                {(totalPremiumUpgrades * 29.99).toFixed(2)}€
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}