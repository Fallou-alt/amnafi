import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Users, Crown, BarChart2 } from 'lucide-react';
import api from '../lib/api';

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/admin/stats');
      setStats(r.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const daily = stats?.daily_stats || [];
  const last14 = daily.slice(-14);
  const totalReg = daily.reduce((s: number, d: any) => s + d.registrations, 0);
  const totalPrem = daily.reduce((s: number, d: any) => s + d.premium_upgrades, 0);
  const thisWeek = daily.slice(-7).reduce((s: number, d: any) => s + d.registrations, 0);
  const lastWeek = daily.slice(-14, -7).reduce((s: number, d: any) => s + d.registrations, 0);
  const maxReg = Math.max(...last14.map((d: any) => d.registrations), 1);
  const maxPrem = Math.max(...last14.map((d: any) => d.premium_upgrades), 1);

  const kpis = [
    { label: 'Inscriptions 30j', value: totalReg, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Premium 30j', value: totalPrem, icon: Crown, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Cette semaine', value: thisWeek, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Croissance', value: `${stats?.growth_rate || 0}%`, icon: BarChart2, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const Bar = ({ value, max, color }: { value: number; max: number; color: string }) => (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="w-full flex items-end justify-center" style={{ height: 80 }}>
        <div
          className={`w-full rounded-t ${color} transition-all`}
          style={{ height: `${Math.max((value / max) * 80, value > 0 ? 4 : 0)}px` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Statistiques</h1>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {loading
          ? [...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl border h-20 animate-pulse" />)
          : kpis.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border p-4">
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))
        }
      </div>

      {!loading && last14.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Inscriptions */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Inscriptions — 14 derniers jours</h2>
            <div className="flex items-end gap-1">
              {last14.map((d: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{d.registrations > 0 ? d.registrations : ''}</span>
                  <Bar value={d.registrations} max={maxReg} color="bg-blue-400" />
                  <span className="text-xs text-gray-300 rotate-45 origin-left whitespace-nowrap">
                    {new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Passages Premium — 14 derniers jours</h2>
            <div className="flex items-end gap-1">
              {last14.map((d: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{d.premium_upgrades > 0 ? d.premium_upgrades : ''}</span>
                  <Bar value={d.premium_upgrades} max={maxPrem} color="bg-yellow-400" />
                  <span className="text-xs text-gray-300 rotate-45 origin-left whitespace-nowrap">
                    {new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Résumé */}
      {!loading && (
        <div className="bg-white rounded-xl border p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Résumé</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400">Cette semaine</p>
              <p className="font-bold text-gray-900 text-lg">{thisWeek}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Semaine précédente</p>
              <p className="font-bold text-gray-900 text-lg">{lastWeek}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Taux conversion premium</p>
              <p className="font-bold text-gray-900 text-lg">
                {totalReg > 0 ? `${Math.round((totalPrem / totalReg) * 100)}%` : '0%'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Meilleur jour</p>
              <p className="font-bold text-gray-900 text-lg">
                {daily.reduce((best: any, d: any) => d.registrations > (best?.registrations || 0) ? d : best, null)?.registrations || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
