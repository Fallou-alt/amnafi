import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, MapPin, Star, CheckCircle, Crown, MessageCircle, ArrowLeft, User } from 'lucide-react';
import api from '../lib/api';

export default function ProviderPublicPage() {
  const { id } = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // L'API utilise le slug comme clé — on cherche d'abord par slug, sinon on liste pour trouver par id
    api.get(`/public/providers/${id}`)
      .then((r) => {
        if (r.data.data) setProvider(r.data.data);
        else setNotFound(true);
      })
      .catch(async () => {
        // Fallback : chercher dans la liste par id numérique
        try {
          const r = await api.get(`/public/providers?per_page=200`);
          const items = r.data.data?.data || r.data.data || [];
          const found = items.find((p: any) => String(p.id) === String(id) || p.slug === id);
          if (found) setProvider(found);
          else setNotFound(true);
        } catch { setNotFound(true); }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound || !provider) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <p className="text-gray-500">Prestataire introuvable</p>
      <Link to="/prestataires" className="text-orange-600 text-sm hover:underline">← Retour aux prestataires</Link>
    </div>
  );

  const photoUrl = provider.profile_photo_url ||
    (provider.profile_photo ? `https://amnafi.net/backend/public/storage/${provider.profile_photo}` : null);
  const coverUrl = provider.cover_photo_url ||
    (provider.cover_photo ? `https://amnafi.net/backend/public/storage/${provider.cover_photo}` : null);
  const phone = provider.phone || provider.user?.phone || '';
  const whatsapp = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/prestataires" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/1logoamnafi.png" alt="AMNAFI" className="w-7 h-7" />
          <span className="font-bold text-orange-600 text-sm">AMNAFI</span>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto pb-16">
        {/* Cover */}
        <div className="h-52 overflow-hidden relative">
          {coverUrl ? (
            <img src={coverUrl} alt="Couverture" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-orange-400 to-orange-600" />
          )}
          {provider.is_premium && (
            <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
              <Crown className="w-3 h-3" /> Premium
            </span>
          )}
        </div>

        {/* Carte principale */}
        <div className="bg-white shadow-sm">
          {/* Avatar + nom */}
          <div className="px-5 pb-5">
            <div className="flex items-end gap-4 -mt-12 mb-4">
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-orange-50 overflow-hidden shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt={provider.business_name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-orange-100">
                    <span className="text-orange-600 font-bold text-4xl">{provider.business_name?.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="pb-2 min-w-0 flex-1">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                  {provider.business_name}
                  {provider.is_verified && <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />}
                </h1>
                {provider.category?.name && (
                  <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full mt-1">
                    {provider.category.icon} {provider.category.name}
                  </span>
                )}
              </div>
            </div>

            {/* Infos */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {provider.city && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{provider.city}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                  <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{phone}</span>
                </div>
              )}
              {provider.user?.name && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                  <User className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{provider.user.name}</span>
                </div>
              )}
              {Number(provider.rating) > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                  <span>{parseFloat(provider.rating).toFixed(1)} <span className="text-gray-400">({provider.reviews_count} avis)</span></span>
                </div>
              )}
            </div>

            {/* Description */}
            {provider.description && provider.description !== 'Nouveau prestataire sur AMNAFI' && (
              <div className="bg-orange-50 rounded-xl p-4 mb-4 border border-orange-100">
                <p className="text-sm text-gray-700 leading-relaxed">{provider.description}</p>
              </div>
            )}

            {/* Boutons contact */}
            {phone && (
              <div className="flex gap-3">
                <a href={`tel:${phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition text-sm">
                  <Phone className="w-4 h-4" /> Appeler
                </a>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition text-sm">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
