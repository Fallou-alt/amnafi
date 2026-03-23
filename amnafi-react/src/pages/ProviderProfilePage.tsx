import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, ArrowLeft, User, Building, Image } from 'lucide-react';
import api from '../lib/api';

interface Provider {
  id: number;
  business_name: string;
  description: string;
  phone: string;
  city: string;
  address: string;
  profile_photo: string;
  profile_photo_url: string;
  cover_photo: string;
  cover_photo_url: string;
  category: {
    id: number;
    name: string;
  };
}

export default function ProviderProfilePage() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    phone: '',
    city: '',
    address: ''
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/provider/profile');
      const data = response.data.data;
      setProvider(data);
      setFormData({
        business_name: data.business_name || '',
        description: data.description || '',
        phone: data.phone || '',
        city: data.city || '',
        address: data.address || ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de chargement');
      if (err.response?.status === 401) {
        navigate('/provider/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPhoto(file);
      setCoverPreview(URL.createObjectURL(file));
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

  const handlePhotoUpload = async () => {
    if (!profilePhoto && !coverPhoto) return;

    setSaving(true);
    setError('');
    setSuccess('');

    const formDataUpload = new FormData();
    if (profilePhoto) formDataUpload.append('profile_photo', profilePhoto);
    if (coverPhoto) formDataUpload.append('cover_photo', coverPhoto);

    try {
      await api.post('/provider/upload-photo', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Photos mises à jour avec succès');
      setProfilePhoto(null);
      setCoverPhoto(null);
      setProfilePreview('');
      setCoverPreview('');
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur d\'upload');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/provider/dashboard')} 
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Modifier mon profil</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
            {success}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Camera className="w-5 h-5 text-orange-600" />
            Photos de profil
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Photo de profil</label>
              <div className="relative">
                <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Aperçu profil" className="w-full h-full object-cover" />
                  ) : provider?.profile_photo_url ? (
                    <img src={provider.profile_photo_url} alt="Photo profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="mt-3 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Photo de couverture</label>
              <div className="relative">
                <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Aperçu couverture" className="w-full h-full object-cover" />
                  ) : provider?.cover_photo_url ? (
                    <img src={provider.cover_photo_url} alt="Photo couverture" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPhotoChange}
                  className="mt-3 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>
            </div>
          </div>

          {(profilePhoto || coverPhoto) && (
            <button
              onClick={handlePhotoUpload}
              disabled={saving}
              className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              {saving ? 'Upload en cours...' : 'Mettre à jour les photos'}
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Building className="w-5 h-5 text-orange-600" />
            Informations professionnelles
          </h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Décrivez vos services et votre expertise..."
              />
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="w-full lg:w-auto px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}