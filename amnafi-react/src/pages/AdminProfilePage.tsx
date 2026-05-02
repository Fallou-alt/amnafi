import { useState, useEffect } from 'react';
import { Save, Shield } from 'lucide-react';
import api from '../lib/api';

export default function AdminProfilePage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', current_password: '', new_password: '', new_password_confirmation: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    api.get('/admin/profile').then((r) => {
      const d = r.data.data;
      setForm(f => ({ ...f, name: d.name, email: d.email, phone: d.phone || '' }));
    }).finally(() => setLoading(false));
  }, []);

  const notify = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/profile', form);
      notify('success', 'Profil mis à jour');
      setForm(f => ({ ...f, current_password: '', new_password: '', new_password_confirmation: '' }));
      setShowPwd(false);
    } catch (e: any) {
      notify('error', e.response?.data?.message || 'Erreur');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-lg space-y-4">
      {msg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg ${
          msg.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {msg.text}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-xs text-gray-400">Administrateur AMNAFI</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'name', label: 'Nom complet', type: 'text' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'phone', label: 'Téléphone', type: 'tel' },
            ].map(({ name, label, type }) => (
              <div key={name} className={name === 'email' ? 'col-span-2' : ''}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  value={(form as any)[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  required={name !== 'phone'}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="text-sm text-orange-600 hover:underline"
            >
              {showPwd ? 'Annuler le changement de mot de passe' : 'Changer le mot de passe'}
            </button>

            {showPwd && (
              <div className="mt-3 space-y-3">
                {[
                  { name: 'current_password', label: 'Mot de passe actuel' },
                  { name: 'new_password', label: 'Nouveau mot de passe' },
                  { name: 'new_password_confirmation', label: 'Confirmer' },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input
                      type="password"
                      value={(form as any)[name]}
                      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
}
