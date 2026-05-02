import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Camera, User, Lock, MapPin } from 'lucide-react';
import api from '../lib/api';

export default function ProviderProfilePage() {
  const navigate = useNavigate();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    business_name: '',
    description: '',
    phone: '',
    city: '',
    address: '',
  });

  const [photos, setPhotos] = useState<{ profile_url?: string; cover_url?: string }>({});
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  const [pwd, setPwd] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [geo, setGeo] = useState<{ active: boolean; lat?: number; lng?: number }>({ active: false });

  useEffect(() => {
    api.get('/provider/profile')
      .then((r) => {
        const d = r.data.data;
        setForm({
          business_name: d.business_name || '',
          description: d.description || '',
          phone: d.phone || '',
          city: d.city || '',
          address: d.address || '',
        });
        setPhotos({ profile_url: d.profile_photo_url, cover_url: d.cover_photo_url });
        setGeo({ active: !!d.geolocalisation_active, lat: d.latitude, lng: d.longitude });
      })
      .catch(() => navigate('/connexion'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const notify = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'profile') { setProfileFile(file); setProfilePreview(url); }
    else { setCoverFile(file); setCoverPreview(url); }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/provider/profile', form);
      notify('success', 'Profil mis à jour');
    } catch (err: any) {
      notify('error', err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePhotos = async () => {
    if (!profileFile && !coverFile) return;
    setSaving(true);
    const fd = new FormData();
    if (profileFile) fd.append('profile_photo', profileFile);
    if (coverFile) fd.append('cover_photo', coverFile);
    try {
      await api.post('/provider/upload-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      notify('success', 'Photos mises à jour');
      setProfileFile(null); setCoverFile(null);
      setProfilePreview(''); setCoverPreview('');
    } catch (err: any) {
      notify('error', err.response?.data?.message || 'Erreur upload');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.new_password !== pwd.new_password_confirmation) {
      notify('error', 'Les mots de passe ne correspondent pas');
      return;
    }
    setSaving(true);
    try {
      await api.put('/provider/password', pwd);
      notify('success', 'Mot de passe modifié');
      setPwd({ current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err: any) {
      notify('error', err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleGeo = async () => {
    if (!geo.active) {
      navigator.geolocation?.getCurrentPosition(
        async (pos) => {
          try {
            await api.put('/provider/geolocation', {
              geolocalisation_active: true,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            setGeo({ active: true, lat: pos.coords.latitude, lng: pos.coords.longitude });
            notify('success', 'Géolocalisation activée');
          } catch { notify('error', 'Erreur géolocalisation'); }
        },
        () => notify('error', 'Impossible d\'obtenir votre position')
      );
    } else {
      try {
        await api.put('/provider/geolocation', { geolocalisation_active: false, latitude: null, longitude: null });
        setGeo({ active: false });
        notify('success', 'Géolocalisation désactivée');
      } catch { notify('error', 'Erreur'); }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/provider/dashboard" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-gray-900">Mon profil</h1>
      </header>

      {/* Toast */}
      {msg && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg ${
          msg.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {msg.text}
        </div>
      )}

      <div className="max-w-xl mx-auto px-4 py-6 space-y-4">

        {/* Photos */}
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4 text-orange-500" /> Photos
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Photo profil */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Photo de profil</p>
              <div
                className="w-full aspect-square rounded-xl bg-gray-100 overflow-hidden border-2 border-dashed border-gray-200 cursor-pointer hover:border-orange-400 transition flex items-center justify-center"
                onClick={() => profileInputRef.current?.click()}
              >
                {profilePreview || photos.profile_url ? (
                  <img src={profilePreview || photos.profile_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(e, 'profile')} />
            </div>
            {/* Photo couverture */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Photo de couverture</p>
              <div
                className="w-full aspect-square rounded-xl bg-gray-100 overflow-hidden border-2 border-dashed border-gray-200 cursor-pointer hover:border-orange-400 transition flex items-center justify-center"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverPreview || photos.cover_url ? (
                  <img src={coverPreview || photos.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(e, 'cover')} />
            </div>
          </div>
          {(profileFile || coverFile) && (
            <button
              onClick={handleSavePhotos}
              disabled={saving}
              className="mt-4 w-full py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition"
            >
              {saving ? 'Envoi...' : 'Enregistrer les photos'}
            </button>
          )}
        </div>

        {/* Infos */}
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Informations</h2>
          <form onSubmit={handleSaveInfo} className="space-y-3">
            {[
              { name: 'business_name', label: 'Nom / Entreprise', type: 'text' },
              { name: 'phone', label: 'Téléphone', type: 'tel' },
              { name: 'city', label: 'Ville', type: 'text' },
              { name: 'address', label: 'Adresse', type: 'text' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  value={(form as any)[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Décrivez vos services..."
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </div>

        {/* Mot de passe */}
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-orange-500" /> Mot de passe
          </h2>
          <form onSubmit={handleSavePwd} className="space-y-3">
            {[
              { name: 'current_password', label: 'Mot de passe actuel' },
              { name: 'new_password', label: 'Nouveau mot de passe' },
              { name: 'new_password_confirmation', label: 'Confirmer le nouveau' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type="password"
                  value={(pwd as any)[name]}
                  onChange={(e) => setPwd({ ...pwd, [name]: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition"
            >
              {saving ? 'Modification...' : 'Changer le mot de passe'}
            </button>
          </form>
        </div>

        {/* Géolocalisation */}
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" /> Géolocalisation
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {geo.active && geo.lat
                  ? `Actif · ${geo.lat.toFixed(4)}, ${geo.lng?.toFixed(4)}`
                  : 'Apparaître dans les recherches à proximité'}
              </p>
            </div>
            <button
              onClick={handleToggleGeo}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                geo.active
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              {geo.active ? 'Désactiver' : 'Activer'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
