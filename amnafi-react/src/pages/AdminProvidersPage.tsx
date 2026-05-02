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
  is_verified: boolean;
  locked_until?: string;
  subscription_type?: string;
  subscription_expires_at?: string;
  created_at: string;
  profile_photo?: string;
  user: { name: string; email: string; phone?: string };
  category?: { name: string };
}

type Toast = { type: 'success' | 'error'; text: string };

export default function AdminProvidersPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
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

  const loadProviders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { per_page: 200 };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      const r = await api.get('/admin/providers', { params });
      const raw = r.data.data;
      const list: Provider[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      setProviders(list);
      setTotal(raw?.total ?? list.length);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'Erreur de chargement');
    }
    setLoading(false);
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    const t = setTimeout(loadProviders, 300);
    return () => clearTimeout(t);
  }, [loadProviders]);

  const action = async (id: number, endpoint: string, body?: any) => {
    try {
      await api.patch(`/admin/providers/${id}/${endpoint}`, body);
      notify('success', 'Modification effectuée');
      loadProviders();
    } catch (e: any) {
      notify('error', e.response?.data?.message || 'Erreur');
    }
  };

  const del = async (id: number) => {
    if (!confirm('Supprimer définitivement ce prestataire ?')) return;
    try {
      await api.delete(`/admin/providers/${id}`);
      setProviders(p => p.filter(x => x.id !== id));
      setTotal(t => t - 1);
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

  return (
    <div className="space-y-4 max-w-6xl">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Prestataires</h1>
        <span className="text-sm text-gray-400">{total} prestataire{total > 1 ? 's' : ''}</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={loadProviders} className="text-red-600 underline text-xs ml-4">Réessayer</button>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Nom, téléphone, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[{ v: 'all', l: 'Tous' }, { v: 'active', l: 'Actifs' }, { v: 'inactive', l: 'Inactifs' }].map(f => (
            <button key={f.v} onClick={() => setStatusFilter(f.v)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${statusFilter === f.v ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {f.l}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[{ v: 'all', l: 'Tous types' }, { v: 'premium', l: 'Premium' }, { v: 'free', l: 'Gratuit' }].map(f => (
            <button key={f.v} onClick={() => setTypeFilter(f.v)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${typeFilter === f.v ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {f.l}
            </button>
          ))}
        </div>
        <button onClick={loadProviders} className="p-2 text-gray-400 hover:text-gray-600">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Chargement des prestataires...</p>
          </div>
        ) : providers.length === 0 && !error ? (
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Inscrit le</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-orange-50 overflow-hidden shrink-0 flex items-center justify-center">
                          {p.profile_photo ? (
                            <img src={`https://amnafi.net/backend/public/storage/${p.profile_photo}`}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <span className="text-orange-600 font-bold text-sm">{p.business_name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{p.business_name}</p>
                          <p className="text-xs text-gray-400">{p.category?.name}{p.city ? ` · ${p.city}` : ''}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-gray-700">{p.phone}</p>
                      <p className="text-xs text-gray-400">{p.user?.name}</p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {p.is_active ? 'Actif' : 'Inactif'}
                        </span>
                        {p.is_verified && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">Vérifié</span>}
                        {p.is_hidden && <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-50 text-yellow-700">Masqué</span>}
                        {p.is_locked && <span className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-700">Verrouillé</span>}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${p.is_premium ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-600'}`}>
                        {p.is_premium && <Crown className="w-3 h-3" />}
                        {p.subscription_type || 'free'}
                      </span>
                      {p.subscription_expires_at && (
                        <p className="text-xs text-gray-400 mt-0.5">exp. {new Date(p.subscription_expires_at).toLocaleDateString('fr-FR')}</p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(p.created_at).toLocaleDateString('fr-FR')}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/admin/prestataires/${p.id}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Voir / Modifier">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => action(p.id, 'toggle-status')}
                          className={`p-1.5 rounded-lg transition ${p.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={p.is_active ? 'Désactiver' : 'Activer'}>
                          {p.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button onClick={() => action(p.id, 'toggle-premium')}
                          className={`p-1.5 rounded-lg transition ${p.is_premium ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={p.is_premium ? 'Retirer premium' : 'Passer premium'}>
                          <Crown className="w-4 h-4" />
                        </button>
                        <button onClick={() => action(p.id, 'toggle-verified')}
                          className={`p-1.5 rounded-lg transition ${p.is_verified ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={p.is_verified ? 'Retirer vérification' : 'Vérifier'}>
                          <span className="text-xs font-bold">{p.is_verified ? '✓' : '?'}</span>
                        </button>
                        <button onClick={() => action(p.id, 'hide')}
                          className={`p-1.5 rounded-lg transition ${p.is_hidden ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={p.is_hidden ? 'Afficher' : 'Masquer'}>
                          {p.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setLockModal({ id: p.id, isLocked: p.is_locked })}
                          className={`p-1.5 rounded-lg transition ${p.is_locked ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}
                          title={p.is_locked ? 'Déverrouiller' : 'Verrouiller'}>
                          {p.is_locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                        <button onClick={() => del(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Supprimer">
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
                  <select value={lockForm.duration} onChange={(e) => setLockForm({ ...lockForm, duration: +e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value={1}>1 jour</option>
                    <option value={7}>7 jours</option>
                    <option value={30}>30 jours</option>
                    <option value={90}>90 jours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Raison (obligatoire)</label>
                  <textarea value={lockForm.reason} onChange={(e) => setLockForm({ ...lockForm, reason: e.target.value })}
                    rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="Motif..." />
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setLockModal(null)} className="px-4 py-2 text-sm text-gray-600">Annuler</button>
              <button onClick={doLock}
                className={`px-4 py-2 text-sm text-white rounded-lg ${lockModal.isLocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {lockModal.isLocked ? 'Déverrouiller' : 'Verrouiller'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
