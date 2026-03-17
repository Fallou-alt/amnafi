import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Lock, Trash2, Save, X } from 'lucide-react';
import api from '../lib/api';

interface Provider {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  photo_profil?: string;
  photo_cin_recto?: string;
  photo_cin_verso?: string;
  photo_patente?: string;
  geolocalisation_active: boolean;
  latitude?: number;
  longitude?: number;
}

export default function ProviderProfilePage() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [photoFiles, setPhotoFiles] = useState<{
    photo_profil?: File;
    photo_cin_recto?: File;
    photo_cin_verso?: File;
    photo_patente?: File;
  }>({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/provider/profile');
      setProvider(response.data);
      setFormData({
        nom: response.data.nom || '',
        prenom: response.data.prenom || '',
        telephone: response.data.telephone || '',
        email: response.data.email || '',
        adresse: response.data.adresse || '',
        ville: response.data.ville || ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFiles({ ...photoFiles, [field]: e.target.files[0] });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/provider/profile', formData);
      setSuccess('Profil mis à jour avec succès');
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (field: string) => {
    if (!photoFiles[field as keyof typeof photoFiles]) return;

    setSaving(true);
    setError('');
    setSuccess('');

    const formDataUpload = new FormData();
    formDataUpload.append(field, photoFiles[field as keyof typeof photoFiles]!);

    try {
      await api.post('/provider/upload-photo', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Photo mise à jour avec succès');
      setPhotoFiles({ ...photoFiles, [field]: undefined });
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur d\'upload');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/provider/password', passwordData);
      setSuccess('Mot de passe modifié avec succès');
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de modification');
    } finally {
      setSaving(false);
    }
  };

  const toggleGeolocation = async () => {
    if (!provider) return;

    if (!provider.geolocalisation_active) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              await api.put('/provider/geolocation', {
                geolocalisation_active: true,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
              setSuccess('Géolocalisation activée');
              fetchProfile();
            } catch (err: any) {
              setError(err.response?.data?.message || 'Erreur d\'activation');
            }
          },
          () => {
            setError('Impossible d\'obtenir votre position');
          }
        );
      } else {
        setError('Géolocalisation non supportée');
      }
    } else {
      try {
        await api.put('/provider/geolocation', {
          geolocalisation_active: false,
          latitude: null,
          longitude: null
        });
        setSuccess('Géolocalisation désactivée');
        fetchProfile();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur de désactivation');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'SUPPRIMER') {
      setError('Veuillez taper SUPPRIMER pour confirmer');
      return;
    }

    try {
      await api.delete('/provider/account');
      localStorage.removeItem('token');
      localStorage.removeItem('provider');
      navigate('/provider/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button onClick={() => navigate('/provider/dashboard')} className="text-blue-600 hover:underline">
            ← Retour au tableau de bord
          </button>
          <h1 className="text-3xl font-bold mt-2">Mon Profil</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Informations personnelles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ville</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={20} />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera size={24} />
            Photos et documents
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['photo_profil', 'photo_cin_recto', 'photo_cin_verso', 'photo_patente'].map((field) => (
              <div key={field} className="border rounded-lg p-4">
                <label className="block text-sm font-medium mb-2">
                  {field === 'photo_profil' && 'Photo de profil'}
                  {field === 'photo_cin_recto' && 'CIN Recto'}
                  {field === 'photo_cin_verso' && 'CIN Verso'}
                  {field === 'photo_patente' && 'Patente'}
                </label>
                
                {provider?.[field as keyof Provider] && (
                  <img
                    src={`https://amnafi.net/storage/${provider[field as keyof Provider]}`}
                    alt={field}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field)}
                  className="w-full text-sm mb-2"
                />
                
                {photoFiles[field as keyof typeof photoFiles] && (
                  <button
                    onClick={() => handlePhotoUpload(field)}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Uploader
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mot de passe */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lock size={24} />
            Changer le mot de passe
          </h2>
          <form onSubmit={handlePasswordUpdate}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="new_password_confirmation"
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Modification...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>

        {/* Géolocalisation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin size={24} />
            Géolocalisation
          </h2>
          <p className="text-gray-600 mb-4">
            Activez la géolocalisation pour apparaître dans les recherches à proximité
          </p>
          <button
            onClick={toggleGeolocation}
            className={`px-6 py-2 rounded-lg ${
              provider?.geolocalisation_active
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {provider?.geolocalisation_active ? 'Désactiver' : 'Activer'} la géolocalisation
          </button>
          {provider?.geolocalisation_active && (
            <p className="mt-2 text-sm text-gray-600">
              Position: {provider.latitude?.toFixed(6)}, {provider.longitude?.toFixed(6)}
            </p>
          )}
        </div>

        {/* Suppression compte */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
            <Trash2 size={24} />
            Zone dangereuse
          </h2>
          <p className="text-gray-600 mb-4">
            La suppression de votre compte est irréversible. Toutes vos données seront perdues.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Supprimer mon compte
          </button>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-600">Confirmer la suppression</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <X size={24} />
              </button>
            </div>
            <p className="mb-4 text-gray-700">
              Cette action est irréversible. Tapez <strong>SUPPRIMER</strong> pour confirmer.
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4"
              placeholder="Tapez SUPPRIMER"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'SUPPRIMER'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
