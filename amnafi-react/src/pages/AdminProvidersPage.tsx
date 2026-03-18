import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface Provider {
  id: number;
  business_name: string;
  phone: string;
  is_active: boolean;
  is_premium: boolean;
  is_hidden: boolean;
  is_locked: boolean;
  locked_until?: string;
  status_reason?: string;
  created_at: string;
  profile_photo?: string;
  user: { name: string; email: string };
  category: { name: string };
}

export default function AdminProviders() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [lockModal, setLockModal] = useState<{ open: boolean; providerId: number | null; isLocked: boolean }>({ open: false, providerId: null, isLocked: false });
  const [lockForm, setLockForm] = useState({ duration: 7, reason: '' });

  useEffect(() => {
    const delay = setTimeout(() => fetchProviders(), 300);
    return () => clearTimeout(delay);
  }, [search, statusFilter, typeFilter]);

  const fetchProviders = async () => {
    try {
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      const response = await api.get('/admin/providers', { params });
      setProviders(response.data.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleStatus = async (id: number) => {
    try {
      await api.patch(`/admin/providers/${id}/toggle-status`);
      fetchProviders();
      showNotification('success', 'Statut modifié');
    } catch (error: any) {
      showNotification('error', error.response?.data?.message || 'Erreur');
    }
  };

  const togglePremium = async (id: number) => {
    try {
      await api.patch(`/admin/providers/${id}/toggle-premium`);
      fetchProviders();
      showNotification('success', 'Type modifié');
    } catch {
      showNotification('error', 'Erreur lors de la modification');
    }
  };

  const hideProvider = async (id: number) => {
    try {
      await api.patch(`/admin/providers/${id}/hide`);
      fetchProviders();
      showNotification('success', 'Visibilité modifiée');
    } catch {
      showNotification('error', 'Erreur lors de la modification');
    }
  };

  const lockProvider = async () => {
    if (!lockModal.providerId) return;
    try {
      const url = lockModal.isLocked
        ? `/admin/providers/${lockModal.providerId}/unlock`
        : `/admin/providers/${lockModal.providerId}/lock`;
      lockModal.isLocked ? await api.patch(url) : await api.patch(url, lockForm);
      fetchProviders();
      showNotification('success', lockModal.isLocked ? 'Prestataire déverrouillé' : 'Prestataire verrouillé');
      setLockModal({ open: false, providerId: null, isLocked: false });
    } catch {
      showNotification('error', 'Erreur lors de la modification');
    }
  };

  const deleteProvider = async (id: number) => {
    if (!confirm('Supprimer définitivement ce prestataire ?')) return;
    try {
      await api.delete(`/admin/providers/${id}`);
      setProviders(prev => prev.filter(p => p.id !== id));
      showNotification('success', 'Prestataire supprimé');
    } catch {
      showNotification('error', 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Prestataires</h1>
        <div className="bg-white rounded-lg shadow animate-pulse">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Prestataires</h1>
        <span className="text-sm text-gray-600">{providers.length} prestataire(s)</span>
      </div>

      {notification && (
        <div className={`p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Rechercher (nom, numéro)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">Tous les types</option>
            <option value="premium">Premium</option>
            <option value="free">Gratuit</option>
          </select>
          <button onClick={fetchProviders} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            🔄 Actualiser
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Prestataire', 'Téléphone', 'Statut', 'Type', 'Modération', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {provider.profile_photo ? (
                        <img
                          src={`https://amnafi.net/backend/public/storage/${provider.profile_photo}`}
                          className="w-9 h-9 rounded-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                          {provider.business_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{provider.business_name}</div>
                        <div className="text-xs text-gray-500">{provider.category?.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.phone}</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(provider.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${provider.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                    >
                      {provider.is_active ? '✅ Actif' : '❌ Inactif'}
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePremium(provider.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${provider.is_premium ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      {provider.is_premium ? '⭐ Premium' : '🆓 Gratuit'}
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {provider.is_hidden && <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">🙈 Masqué</span>}
                      {provider.is_locked && <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">🔒 Verrouillé</span>}
                      {!provider.is_hidden && !provider.is_locked && <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✅ Normal</span>}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <button onClick={() => navigate(`/admin/prestataires/${provider.id}`)} className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs" title="Voir détails">👁️</button>
                      <button onClick={() => hideProvider(provider.id)} className={`px-2 py-1 rounded text-xs ${provider.is_hidden ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`} title={provider.is_hidden ? 'Afficher' : 'Masquer'}>
                        {provider.is_hidden ? '👁️' : '🙈'}
                      </button>
                      <button onClick={() => setLockModal({ open: true, providerId: provider.id, isLocked: provider.is_locked })} className={`px-2 py-1 rounded text-xs ${provider.is_locked ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`} title={provider.is_locked ? 'Déverrouiller' : 'Verrouiller'}>
                        {provider.is_locked ? '🔓' : '🔒'}
                      </button>
                      <button onClick={() => deleteProvider(provider.id)} className="text-red-600 hover:text-red-900 px-2 py-1 rounded text-xs" title="Supprimer">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {lockModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              {lockModal.isLocked ? 'Déverrouiller le prestataire' : 'Verrouiller le prestataire'}
            </h3>
            {!lockModal.isLocked && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (jours)</label>
                  <select value={lockForm.duration} onChange={(e) => setLockForm({ ...lockForm, duration: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value={1}>1 jour</option>
                    <option value={7}>7 jours</option>
                    <option value={30}>30 jours</option>
                    <option value={90}>90 jours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raison</label>
                  <textarea value={lockForm.reason} onChange={(e) => setLockForm({ ...lockForm, reason: e.target.value })} placeholder="Motif du verrouillage..." className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2 mt-6">
              <button onClick={() => setLockModal({ open: false, providerId: null, isLocked: false })} className="px-4 py-2 text-gray-600 hover:text-gray-800">Annuler</button>
              <button onClick={lockProvider} className={`px-4 py-2 rounded-lg text-white ${lockModal.isLocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {lockModal.isLocked ? 'Déverrouiller' : 'Verrouiller'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
