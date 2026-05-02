import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, MapPin, Star, CheckCircle, Crown, MessageCircle, ArrowLeft } from 'lucide-react';
import api from '../lib/api';

export default function ProviderPublicPage() {
  const { id } = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/public/providers/${id}`)
      .then((r) => setProvider(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!provider) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Prestataire introuvable</p>
    </div>
  );

  const photoUrl = provider.profile_photo_url || (provider.profile_photo ? `https://amnafi.net/backend/public/storage/${provider.profile_photo}` : null);
  const coverUrl = provider.cover_photo_url || (provider.cover_photo ? `https://amnafi.net/backend/public/storage/${provider.cover_photo}` : null);
  const whatsapp = `https://wa.me/${provider.phone?.replace(/[^0-9]/g, '')}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Link to="/prestataires" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/1logoamnafi.png" alt="AMNAFI" className="w-7 h-7" />
          <span className="font-bold text-orange-600 text-sm">AMNAFI</span>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto pb-12">
        {/* Cover */}
        <div className="h-48 bg-gradient-to-r from-orange-100 to-red-100 overflow-hidden relative">
          {coverUrl ? (
            <img src={coverUrl} alt="Couverture" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-orange-200 to-red-200" />
          )}
          {provider.is_premium && (
            <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" /> Premium
            </span>
          )}
        </div>

        {/* Profil */}
        <div className="bg-white px-5 pb-5">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-orange-50 overflow-hidden shrink-0">
              {photoUrl ? (
                <img src={photoUrl} alt={provider.business_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-100">
                  <span className="text-orange-600 font-bold text-3xl">{provider.business_name?.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="pb-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {provider.business_name}
                {provider.is_verified && <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />}
              </h1>
              <p className="text-sm text-gray-500">{provider.category?.name}</p>
            </div>
          </div>

          {/* Infos rapides */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-orange-400" />{provider.city}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-orange-400" />{provider.phone}</span>
            {provider.rating > 0 && (
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {parseFloat(provider.rating).toFixed(1)} ({provider.reviews_count} avis)
              </span>
            )}
          </div>

          {/* Description */}
          {provider.description && (
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 mb-4">
              {provider.description}
            </p>
          )}

          {/* Boutons contact */}
          <div className="flex gap-3">
            <a href={`tel:${provider.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition">
              <Phone className="w-4 h-4" /> Appeler
            </a>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
