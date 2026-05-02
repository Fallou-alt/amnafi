import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Crown, UserCheck, UserX, TrendingUp, RefreshCw } from 'lucide-react';
import api from '../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/admin/dashboard');
      setStats(r.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const cards = stats ? [
    { label: 'Total prestataires', value: stats.total_providers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Actifs', value: stats.active_providers, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Inactifs', value: stats.inactive_providers, icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Premium', value: stats.premium_providers, icon: Crown, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: "Aujourd'hui", value: stats.today_registrations, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ] : [];

  const quickLinks = [
    { to: '/admin/prestataires', label: 'Gérer les prestataires', sub: 'Activer, modifier, supprimer' },
    { to: '/admin/statistiques', label: 'Statistiques', sub: 'Inscriptions et croissance' },
    { to: '/joj/admin/providers', label: 'Prestataires officiels', sub: 'Gérer les profils JOJ' },
    { to: '/joj/admin/missions', label: 'Missions', sub: 'Valider et assigner' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {loading
          ? [...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl border h-20 animate-pulse" />)
          : cards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border p-4">
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))
        }
      </div>

      {/* Accès rapides */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Accès rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map(({ to, label, sub }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-xl border p-4 hover:border-orange-300 hover:shadow-sm transition group"
            >
              <p className="font-medium text-gray-900 group-hover:text-orange-600 transition text-sm">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
