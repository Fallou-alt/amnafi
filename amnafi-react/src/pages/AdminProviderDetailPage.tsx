import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ToggleLeft, ToggleRight, Crown, EyeOff, Eye,
  Lock, Unlock, Trash2, Save, Phone, MapPin, Calendar, User
} from 'lucide-react';
import api from '../lib/api';

type Toast = { type: 'success' | 'error'; text: string };

export default function AdminProviderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [note, setNote] = useState('');
  const [editForm, setEditForm] = useState<any>({});
  const [editMode, setEditMode] = useState(false);
  const [lockForm, setLockForm] = useState({ duration: 7, reason: '' });
  const [showLock, setShowLock] = useState(false);

  const notify = (type: Toast['type'], text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    try {
      const r = await api.get(`/admin/providers/${id}`);
      const d = r.data.data;
      setProvider(d);
      // admin_notes peut être un JSON array ou une string
      try {
        const parsed = typeof d.admin_notes === 'string' ? JSON.parse(d.admin_notes) : d.admin_notes;
        setNote(Array.isArray(parsed) ? parsed.map((n: any) => n.note).join('\n') : (d.admin_notes || ''));
      } catch { setNote(d.admin_notes || ''); }
      setEditForm({
        business_name: d.business_name || '',
        phone: d.phone || '',
        city: d.city || '',
        address: d.address || '',
        description: d.description || '',
      });
    } catch { navigate('/admin/prestataires'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const doAction = async (endpoint: string, body?: any) => {
    setSaving(true);
    try {
      await api.patch(`/admin/providers/${id}/${endpoint}`, body);
      notify('success', 'Modification effectuée');
      load();
    } catch (e: any) {
      notify('error', e.response?.data?.message || 'Erreur');
    }
    setSaving(false);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/providers/${id}`, editForm);
      notify('success', 'Profil mis à jour');
      setEditMode(false);
      load();
    } catch (e: any) {
      notify('error', e.response?.data?.message || 'Erreur');
    }
    setSaving(false);
  };

  const saveNote = async () => {
    setSaving(true);
    try {
      await api.post(`/admin/providers/${id}/note`, { note });
      notify('success', 'Note enregistrée');
    } catch { notify('error', 'Erreur'); }
    setSaving(false);
  };

  const del = async () => {
    if (!confirm('Supprimer définitivement ce prestataire ?')) return;
    try {
      await api.delete(`/admin/providers/${id}`);
      navigate('/admin/prestataires');
    } catch { notify('error', 'Erreur lors de la suppression'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!provider) return null;

  const statusBtns = [
    {
      label: provider.is_active ? 'Actif' : 'Inactif',
      action: () => doAction('toggle-status'),
      icon: provider.is_active ? ToggleRight : ToggleLeft,
      color: provider.is_active ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-500 bg-red-50 border-red-200',
    },
    {
      label: provider.is_premium ? 'Premium' : 'Gratuit',
      action: () => doAction('toggle-premium'),
      icon: Crown,
      color: provider.is_premium ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 'text-gray-500 bg-gray-50 border-gray-200',
    },
    {
      label: provider.is_hidden ? 'Masqué' : 'Visible',
      action: () => doAction('hide'),
      icon: provider.is_hidden ? EyeOff : Eye,
      color: provider.is_hidden ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      label: provider.is_locked ? 'Verrouillé' : 'Libre',
      action: () => provider.is_locked ? doAction('unlock') : setShowLock(true),
      icon: provider.is_locked ? Lock : Unlock,
      color: provider.is_locked ? 'text-red-600 bg-red-50 border-red-200' : 'text-gray-500 bg-gray-50 border-gray-200',
    },
    {
      label: provider.is_verified ? 'Vérifié' : 'Non vérifié',
      action: () => doAction('toggle-verified'),
      icon: provider.is_verified ? Eye : EyeOff,
      color: provider.is_verified ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-400 bg-gray-50 border-gray-200',
    },
  ];

  return (
    <div className="max-w-3xl space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/admin/prestataires')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <button onClick={del} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700">
          <Trash2 className="w-4 h-4" /> Supprimer
        </button>
      </div>

      {/* Profil */}
      <div className="bg-white rounded-xl border p-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-orange-50 overflow-hidden shrink-0 flex items-center justify-center">
            {provider.profile_photo ? (
              <img
                src={`https://amnafi.net/backend/public/storage/${provider.profile_photo}`}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <span className="text-orange-600 font-bold text-2xl">{provider.business_name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900">{provider.business_name}</h1>
            <p className="text-sm text-gray-500">{provider.category?.name}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{provider.phone}</span>
              {provider.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{provider.city}</span>}
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Inscrit le {new Date(provider.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:border-orange-400 hover:text-orange-600 transition"
          >
            {editMode ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {/* Compte utilisateur */}
        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400">Nom complet</p>
            <p className="font-medium text-gray-800 flex items-center gap-1"><User className="w-3.5 h-3.5 text-gray-400" />{provider.user?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="font-medium text-gray-800 truncate">{provider.user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Téléphone utilisateur</p>
            <p className="font-medium text-gray-800">{provider.user?.phone || provider.phone}</p>
          </div>
          {provider.subscription_expires_at && (
            <div>
              <p className="text-xs text-gray-400">Abonnement expire</p>
              <p className="font-medium text-gray-800">{new Date(provider.subscription_expires_at).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Édition */}
      {editMode && (
        <div className="bg-white rounded-xl border p-5 space-y-3">
          <h2 className="font-semibold text-gray-900 text-sm">Modifier les informations</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'business_name', label: 'Nom / Entreprise' },
              { name: 'phone', label: 'Téléphone' },
              { name: 'city', label: 'Ville' },
              { name: 'address', label: 'Adresse' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                <input
                  type="text"
                  value={editForm[name]}
                  onChange={(e) => setEditForm({ ...editForm, [name]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>
          <button
            onClick={saveEdit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Enregistrer
          </button>
        </div>
      )}

      {/* Statuts & Actions */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold text-gray-900 text-sm mb-3">Statuts & Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {statusBtns.map(({ label, action, icon: Icon, color }) => (
            <button
              key={label}
              onClick={action}
              disabled={saving}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition hover:opacity-80 disabled:opacity-50 ${color}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
        {provider.locked_until && (
          <p className="text-xs text-red-500 mt-2">
            Verrouillé jusqu'au {new Date(provider.locked_until).toLocaleDateString('fr-FR')}
          </p>
        )}
        {provider.status_reason && (
          <p className="text-xs text-gray-500 mt-1">Raison : {provider.status_reason}</p>
        )}
      </div>

      {/* Description */}
      {provider.description && !editMode && (
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-gray-900 text-sm mb-2">Description</h2>
          <p className="text-sm text-gray-600">{provider.description}</p>
        </div>
      )}

      {/* Notes admin */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold text-gray-900 text-sm mb-3">Notes internes</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Notes visibles uniquement par les admins..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
        />
        <button
          onClick={saveNote}
          disabled={saving}
          className="mt-2 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> Enregistrer la note
        </button>
      </div>

      {/* Modal verrouillage */}
      {showLock && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Verrouiller ce prestataire</h3>
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
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowLock(false)} className="px-4 py-2 text-sm text-gray-600">Annuler</button>
              <button
                onClick={() => { doAction('lock', lockForm); setShowLock(false); }}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Verrouiller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
