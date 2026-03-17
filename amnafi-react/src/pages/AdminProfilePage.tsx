import { useState, useEffect } from 'react';
import api from '../lib/api';

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function AdminProfilePage() {
  const [, setProfile] = useState<AdminProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/admin/profile');
      setProfile(response.data.data);
      setFormData({
        name: response.data.data.name,
        email: response.data.data.email,
        phone: response.data.data.phone || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.put('/admin/profile', formData);

      if (response.status === 200) {
        alert('Profil mis à jour avec succès !');
        setProfile(response.data.data);
        setFormData({
          ...formData,
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        });
        setShowPasswordFields(false);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <div className="px-3 py-2 bg-blue-50 text-blue-800 rounded-lg font-medium">
                👑 Administrateur
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Changer le mot de passe</h3>
              <button
                type="button"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showPasswordFields ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            {showPasswordFields && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    value={formData.current_password}
                    onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={formData.new_password}
                    onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={formData.new_password_confirmation}
                    onChange={(e) => setFormData({...formData, new_password_confirmation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 rounded-lg font-medium ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
