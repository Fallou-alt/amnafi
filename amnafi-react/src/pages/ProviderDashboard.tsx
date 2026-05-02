import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Settings, Star, Crown, CheckCircle, Clock, User } from 'lucide-react';
import api from '../lib/api';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/connexion');
      return;
    }
    api.get('/provider/profile')
      .then((r) => setProfile(r.data.data))
      .catch(() => navigate('/connexion'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/connexion');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const expiresAt = profile?.subscription_expires_at
    ? new Date(profile.subscription_expires_at).toLocaleDateString('fr-FR')
    : null;

  const daysLeft = profile?.subscription_expires_at
    ? Math.max(0, Math.ceil((new Date(profile.subscription_expires_at).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/1logoamnafi.png" alt="AMNAFI" className="w-8 h-8" />
          <span className="font-bold text-orange-600">AMNAFI</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* Profil card */}
        <div className="bg-white rounded-2xl border p-5 flex items-center gap-4">
          {profile?.profile_photo_url ? (
            <img
              src={profile.profile_photo_url}
              alt="Profil"
              className="w-16 h-16 rounded-full object-cover border-2 border-orange-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
              <User className="w-8 h-8 text-orange-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 text-lg truncate">{profile?.business_name}</h1>
            <p className="text-sm text-gray-500 truncate">{profile?.category?.name} · {profile?.city}</p>
            <div className="flex items-center gap-3 mt-1">
              {profile?.is_verified ? (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="w-3.5 h-3.5" /> Vérifié
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" /> En attente
                </span>
              )}
              {profile?.is_premium && (
                <span className="flex items-center gap-1 text-xs text-yellow-600">
                  <Crown className="w-3.5 h-3.5" /> Premium
                </span>
              )}
              {profile?.rating > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <Star className="w-3.5 h-3.5 text-yellow-400" /> {profile.rating}
                </span>
              )}
            </div>
          </div>
          <Link
            to="/provider/profile"
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition shrink-0"
          >
            <Settings className="w-4 h-4" />
            Modifier
          </Link>
        </div>

        {/* Abonnement */}
        {expiresAt && (
          <div className={`rounded-2xl border p-4 ${daysLeft !== null && daysLeft <= 7 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
            <p className="text-sm text-gray-600">
              Abonnement <span className="font-medium capitalize">{profile?.subscription_type}</span>
              {' · '}
              {daysLeft !== null && daysLeft <= 7
                ? <span className="text-red-600 font-medium">Expire dans {daysLeft} jour{daysLeft > 1 ? 's' : ''}</span>
                : <span>Expire le {expiresAt}</span>
              }
            </p>
          </div>
        )}

        {/* Action principale */}
        <Link
          to="/provider/profile"
          className="block bg-white rounded-2xl border p-5 hover:border-orange-300 hover:shadow-sm transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition">
              <Settings className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Modifier mon profil</p>
              <p className="text-sm text-gray-500">Nom, description, photos, mot de passe</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
