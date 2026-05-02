import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, EyeOff, Lock, Unlock, Trash2, Crown, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import api from '../lib/api';

interface Provider {
  id: number;
  business_name: string;
  phone: string;
  city?: string;
  is_active: boolean;
  is_premium: boolean;
  is_hidden: boolean;
  is_locked: boolean;
  locked_until?: string;
  subscription_type?: string;
  subscription_expires_at?: string;
  created_at: string;
  profile_photo?: string;
  admin_notes?: string;
  user: { name: string; email: string; phone?: string };
  category?: { name: string };
}

type Toast = { type: 'success' | 'error'; text: string };

export default function AdminProvidersPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [toast, setToast] = useState<Toast | null>(null);
  const [lockModal, setLockModal] = useState<{ id: number; isLocked: boolean } | null>(null);
  const [lockForm, setLockForm] = useState({ duration: 7, reason: '' });

  const notify = (type: Toast['type'], text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      const r = await api.get('/admin/providers', { params });
      const raw = r.data.data;
      // Laravel paginate: { data: [...], total, ... } ou tableau direct
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      setProviders(list);
    } catch {}
    setLoading(false);
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    const t = setTimeout(fetch, 300);
    return () => clearTimeout(t);
  }, [fetch]);

  const action = async (id: number, endpoint: string, body?: any) => {
    try {
      await api.patch(`/admin/providers/${id}/${endpoint}`, body);
      notify('success', 'Modification effectuée');
      fetch();
    } catch (e: any) {
      notify('error', e.response?.data?.message || 'Erreur');
    }
  };

  const del = async (id: number) => {
    if (!confirm('Supprimer définitivement ce prestataire ?')) return;
    try {
      await api.delete(`/admin/providers/${id}`);
      setProviders(p => p.filter(x => x.id !== id));
      notify('success', 'Prestataire supprimé');
    } catch {
      notify('error', 'Erreur lors de la suppression');
    }
  };

  const doLock = async () => {
    if (!lockModal) return;
    await action(lockModal.id, lockModal.isLocked ? 'unlock' : 'lock', lockModal.isLocked ? undefined : lockForm);
    setLockModal(null);
    setLockForm({ duration: 7, reason: '' });
  };

  const filters = [
    { value: 'all', label: 'Tous' },
    { value: 'active', label: 'Actifs' },
    { value: 'inactive', label: 'Inactifs' },
  ];

  const typeFilters = [
    { value: 'all', label: 'Tous types' },
    { value: 'premium', label: 'Premium' },
    { value: 'free', label: 'Gratuit' },
  ];

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Prestataires</h1>
        <span className="text-sm text-gray-400">{providers.length} résultat{providers.length > 1 ? 's' : ''}</span>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Nom, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                statusFilter === f.value ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {typeFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                typeFilter === f.value ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={fetch} className="p-2 text-gray-400 hover:text-gray-600">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : providers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Aucun prestataire trouvé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prestataire</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Abonnement</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Inscription</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Prestataire */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-orange-50 overflow-hidden shrink-0 flex items-center justify-center">
                          {p.profile_photo ? (
                            <img
                              src={`https://amnafi.net/backend/public/storage/${p.profile_photo}`}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <span className="text-orange-600 font-bold text-sm">{p.business_name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{p.business_name}</p>
                          <p className="text-xs text-gray-400">{p.category?.name} {p.city ? `· ${p.city}` : ''}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{p.phone}</p>
                      <p className="text-xs text-gray-400">{p.user?.email}</p>
                    </td>

                    {/* Statut */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {p.is_active ? 'Actif' : 'Inactif'}
                        </span>
                        {p.is_hidden && <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-50 text-yellow-700">Masqué</span>}
                        {p.is_locked && <span className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-700">Verrouillé</span>}
                      </div>
                    </td>

                    {/* Abonnement */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.is_premium ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {p.is_premium && <Crown className="w-3 h-3" />}
                        {p.subscription_type || 'Gratuit'}
                      </span>
                      {p.subscription_expires_at && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          exp. {new Date(p.subscription_expires_at).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(p.created_at).toLocaleDateString('fr-FR')}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Voir détail */}
                        <button
                          onClick={() => navigate(`/admin/prestataires/${p.id}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Activer/Désactiver */}
                        <button
                          onClick={() => action(p.id, 'toggle-status')}
                          className={`p-1.5 rounded-lg transition ${
                            p.is_active
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={p.is_active ? 'Désactiver' : 'Activer'}
                        >
                          {p.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>

                        {/* Premium */}
                        <button
                          onClick={() => action(p.id, 'toggle-premium')}
                          className={`p-1.5 rounded-lg transition ${
                            p.is_premium
                              ? 'text-yellow-500 hover:bg-yellow-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={p.is_premium ? 'Retirer premium' : 'Passer premium'}
                        >
                          <Crown className="w-4 h-4" />
                        </button>

                        {/* Masquer */}
                        <button
                          onClick={() => action(p.id, 'hide')}
                          className={`p-1.5 rounded-lg transition ${
                            p.is_hidden
                              ? 'text-yellow-500 hover:bg-yellow-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={p.is_hidden ? 'Afficher' : 'Masquer'}
                        >
                          {p.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Verrouiller */}
                        <button
                          onClick={() => setLockModal({ id: p.id, isLocked: p.is_locked })}
                          className={`p-1.5 rounded-lg transition ${
                            p.is_locked
                              ? 'text-red-500 hover:bg-red-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={p.is_locked ? 'Déverrouiller' : 'Verrouiller'}
                        >
                          {p.is_locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => del(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal verrouillage */}
      {lockModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              {lockModal.isLocked ? 'Déverrouiller ce prestataire ?' : 'Verrouiller ce prestataire'}
            </h3>
            {!lockModal.isLocked && (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Durée</label>
                  <select
                    value={lockForm.duration}
                    onChange={(e) => setLockForm({ ...lockForm, duration: +e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value={1}>1 jour</option>
                    <option value={7}>7 jours</option>
                    <option value={30}>30 jours</option>
                    <option value={90}>90 jours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Raison</label>
                  <textarea
                    value={lockForm.reason}
                    onChange={(e) => setLockForm({ ...lockForm, reason: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                    placeholder="Motif..."
                  />
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setLockModal(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={doLock}
                className={`px-4 py-2 text-sm text-white rounded-lg ${
                  lockModal.isLocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {lockModal.isLocked ? 'Déverrouiller' : 'Verrouiller'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
