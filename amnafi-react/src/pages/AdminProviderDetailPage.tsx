import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface Provider {
  id: number;
  business_name: string;
  phone: string;
  description?: string;
  address?: string;
  city?: string;
  is_active: boolean;
  is_premium: boolean;
  is_hidden: boolean;
  is_locked: boolean;
  locked_until?: string;
  status_reason?: string;
  admin_notes?: string;
  profile_photo?: string;
  created_at: string;
  user: { name: string; email: string; phone?: string };
  category: { name: string };
}

export default function AdminProviderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { fetchProvider(); }, [id]);

  const fetchProvider = async () => {
    try {
      const res = await api.get(`/admin/providers/${id}`);
      setProvider(res.data.data);
      setNote(res.data.data.admin_notes || '');
    } catch {
      navigate('/admin/prestataires');
    } finally {
      setLoading(false);
    }
  };

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const doAction = async (action: string, body?: any) => {
    setSaving(true);
    try {
      await api.patch(`/admin/providers/${id}/${action}`, body);
      showNotif('success', 'Action effectuée avec succès');
      fetchProvider();
    } catch (e: any) {
      showNotif('error', e.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const saveNote = async () => {
    setSaving(true);
    try {
      await api.post(`/admin/providers/${id}/note`, { note });
      showNotif('success', 'Note enregistrée');
      fetchProvider();
    } catch {
      showNotif('error', 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const deleteProvider = async () => {
    if (!confirm('Supprimer définitivement ce prestataire ?')) return;
    try {
      await api.delete(`/admin/providers/${id}`);
      navigate('/admin/prestataires');
    } catch {
      showNotif('error', 'Erreur lors de la suppression');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  if (!provider) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/admin/prestataires')} className="text-blue-600 hover:underline text-sm">
          ← Retour aux prestataires
        </button>
        <button onClick={deleteProvider} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
          🗑️ Supprimer
        </button>
      </div>

      {notification && (
        <div className={`p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {notification.message}
        </div>
      )}

      {/* Infos principales */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start space-x-4">
          {provider.profile_photo ? (
            <img
              src={`https://amnafi.net/backend/public/storage/${provider.profile_photo}`}
              alt={provider.business_name}
              className="w-20 h-20 rounded-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
            />
          ) : (
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
              {provider.business_name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{provider.business_name}</h1>
            <p className="text-gray-500">{provider.category?.name}</p>
            <p className="text-gray-600 mt-1">📞 {provider.phone}</p>
            {provider.address && <p className="text-gray-600">📍 {provider.address}, {provider.city}</p>}
            <p className="text-gray-500 text-sm mt-1">Inscrit le {new Date(provider.created_at).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        {provider.description && (
          <p className="mt-4 text-gray-700 bg-gray-50 p-3 rounded-lg">{provider.description}</p>
        )}
      </div>

      {/* Compte utilisateur */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-3">Compte utilisateur</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Nom :</span> <span className="font-medium">{provider.user?.name}</span></div>
          <div><span className="text-gray-500">Email :</span> <span className="font-medium">{provider.user?.email}</span></div>
          <div><span className="text-gray-500">Téléphone :</span> <span className="font-medium">{provider.user?.phone || provider.phone}</span></div>
        </div>
      </div>

      {/* Statuts & Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Statuts & Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Compte</p>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${provider.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {provider.is_active ? '✅ Actif' : '❌ Inactif'}
            </span>
            <button
              onClick={() => doAction('toggle-status')}
              disabled={saving}
              className="mt-2 w-full text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Basculer
            </button>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Type</p>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${provider.is_premium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
              {provider.is_premium ? '⭐ Premium' : '🆓 Gratuit'}
            </span>
            <button
              onClick={() => doAction('toggle-premium')}
              disabled={saving}
              className="mt-2 w-full text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Basculer
            </button>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Visibilité</p>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${provider.is_hidden ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {provider.is_hidden ? '🙈 Masqué' : '👁️ Visible'}
            </span>
            <button
              onClick={() => doAction('hide')}
              disabled={saving}
              className="mt-2 w-full text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Basculer
            </button>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Accès</p>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${provider.is_locked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {provider.is_locked ? '🔒 Verrouillé' : '🔓 Libre'}
            </span>
            <button
              onClick={() => provider.is_locked ? doAction('unlock') : doAction('lock', { duration: 7, reason: 'Verrouillage admin' })}
              disabled={saving}
              className="mt-2 w-full text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              {provider.is_locked ? 'Déverrouiller' : 'Verrouiller'}
            </button>
          </div>
        </div>

        {provider.status_reason && (
          <p className="mt-4 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
            <strong>Raison :</strong> {provider.status_reason}
          </p>
        )}
        {provider.locked_until && (
          <p className="mt-2 text-sm text-red-600">
            Verrouillé jusqu'au : {new Date(provider.locked_until).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>

      {/* Notes admin */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-3">Notes administrateur</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Ajouter une note interne sur ce prestataire..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={saveNote}
          disabled={saving}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          💾 Enregistrer la note
        </button>
      </div>
    </div>
  );
}
