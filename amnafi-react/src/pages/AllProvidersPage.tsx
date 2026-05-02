import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Crown, ArrowLeft, Search, MessageCircle, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import SEO from '../components/SEO';

interface Provider {
  id: number;
  slug: string;
  business_name: string;
  description: string;
  phone: string;
  city: string;
  rating: string;
  reviews_count: number;
  is_verified: boolean;
  is_premium: boolean;
  profile_photo: string;
  cover_photo: string;
  profile_photo_url: string;
  whatsapp_url: string;
  user: { name: string };
  category: { name: string; icon: string; color: string };
}

interface Category { id: number; name: string; icon: string; }

export default function AllProviders() {
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');

  useEffect(() => {
    api.get('/public/categories').then((r) => { if (r.data.success) setCategories(r.data.data); });
    fetchProviders(searchParams.get('search') || '', searchParams.get('category_id') || '', searchParams.get('city') || '', 1, true);
  }, []);

  const fetchProviders = async (search: string, categoryId: string, city: string, page: number, reset: boolean) => {
    reset ? setLoading(true) : setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryId) params.append('category_id', categoryId);
      if (city) params.append('city', city);
      params.append('page', String(page));
      params.append('per_page', '24');
      const r = await api.get('/public/providers?' + params.toString());
      if (r.data.success) {
        const paged = r.data.data;
        const items: Provider[] = paged.data || paged;
        setProviders((prev) => reset ? items : [...prev, ...items]);
        setTotal(paged.total ?? items.length);
        setCurrentPage(paged.current_page ?? 1);
        setLastPage(paged.last_page ?? 1);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); setLoadingMore(false); }
  };

  const handleSearch = () => { setCurrentPage(1); fetchProviders(searchTerm, selectedCategory, selectedCity, 1, true); };
  const handleCategoryChange = (val: string) => { setSelectedCategory(val); fetchProviders(searchTerm, val, selectedCity, 1, true); };
  const handleCityChange = (val: string) => { setSelectedCity(val); fetchProviders(searchTerm, selectedCategory, val, 1, true); };
  const handleLoadMore = () => { const next = currentPage + 1; setCurrentPage(next); fetchProviders(searchTerm, selectedCategory, selectedCity, next, false); };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Tous les prestataires" description="Trouvez parmi tous nos prestataires de services au Sénégal." url="/prestataires" />

      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">Prestataires</h1>
              {!loading && <p className="text-xs text-gray-400">{total} prestataire{total > 1 ? 's' : ''}</p>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Nom, métier, ville..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white">
              <option value="">Toutes catégories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
            <select value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white">
              <option value="">Toutes villes</option>
              {['Dakar','Thiès','Kaolack','Ziguinchor','Saint-Louis','Tambacounda','Mbour','Diourbel','Louga','Kolda'].map((v) => (
                <option key={v} value={v.toLowerCase()}>{v}</option>
              ))}
            </select>
            <button onClick={handleSearch} className="px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-2">Aucun prestataire trouvé</p>
            <Link to="/prestataire" className="text-orange-600 text-sm hover:underline">Devenir prestataire →</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((provider) => (
                <Link key={provider.id} to={`/prestataires/${provider.slug || provider.id}`}
                  className="bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all overflow-hidden block">
                  <div className="h-28 bg-gradient-to-r from-orange-100 to-red-100 overflow-hidden relative">
                    {provider.cover_photo && (
                      <img src={`https://amnafi.net/backend/public/storage/${provider.cover_photo}`} alt="" className="w-full h-full object-cover" />
                    )}
                    {provider.is_premium && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" /> Premium
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 -mt-8 mb-3">
                      <div className="w-14 h-14 rounded-xl border-2 border-white shadow bg-orange-50 overflow-hidden shrink-0">
                        {provider.profile_photo_url || provider.profile_photo ? (
                          <img src={provider.profile_photo_url || `https://amnafi.net/backend/public/storage/${provider.profile_photo}`}
                            alt={provider.business_name} className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-orange-100">
                            <span className="text-orange-600 font-bold text-lg">{provider.business_name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-6 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate flex items-center gap-1">
                          {provider.business_name}
                          {provider.is_verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{provider.user?.name}</p>
                      </div>
                    </div>
                    {provider.category && (
                      <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full mb-3">
                        {provider.category.icon} {provider.category.name}
                      </span>
                    )}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><MapPin className="w-3.5 h-3.5 shrink-0" /> {provider.city}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><Phone className="w-3.5 h-3.5 shrink-0" /> {provider.phone}</div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{parseFloat(provider.rating).toFixed(1)}</span>
                        <span className="text-gray-400">({provider.reviews_count})</span>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
                        <a href={`tel:${provider.phone}`} className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition" title="Appeler">
                          <Phone className="w-4 h-4" />
                        </a>
                        <a href={provider.whatsapp_url} target="_blank" rel="noopener noreferrer"
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition" title="WhatsApp">
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {currentPage < lastPage && (
              <div className="flex justify-center mt-8">
                <button onClick={handleLoadMore} disabled={loadingMore}
                  className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-orange-400 hover:text-orange-600 transition disabled:opacity-50">
                  {loadingMore ? 'Chargement...' : `Voir plus (${total - providers.length} restants)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
