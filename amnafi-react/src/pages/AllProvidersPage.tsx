import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Crown, ArrowLeft, Search, MessageCircle, CheckCircle } from 'lucide-react';
import api from '../lib/api';

interface Provider {
  id: number;
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
  user: {
    name: string;
  };
  category: {
    name: string;
    icon: string;
    color: string;
  };
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function AllProviders() {
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');

  useEffect(() => {
    fetchCategories();
    fetchProviders(searchTerm, selectedCategory, selectedCity);
  }, []);

  const fetchProviders = async (search = '', categoryId = '', city = '') => {
    try {
      let url = '/public/providers';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryId) params.append('category_id', categoryId);
      if (city) params.append('city', city);
      if (params.toString()) url += '?' + params.toString();
      
      const response = await api.get(url);
      
      if (response.data.success) {
        setProviders(response.data.data.data || response.data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/public/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchProviders(searchTerm, selectedCategory, selectedCity);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    fetchProviders(searchTerm, categoryId, selectedCity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="bg-white/90 backdrop-blur-md shadow-xl border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-orange-600 hover:text-orange-700 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Tous les prestataires</h1>
                <p className="text-gray-600 font-medium">{providers.length} prestataires disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 p-4 rounded-2xl shadow-lg border-2 border-orange-200">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, métier, ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all shadow-sm bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 font-medium"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all shadow-sm bg-white/80 backdrop-blur-sm font-medium"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCity}
                  onChange={(e) => { setSelectedCity(e.target.value); setLoading(true); fetchProviders(searchTerm, selectedCategory, e.target.value); }}
                  className="px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all shadow-sm bg-white/80 backdrop-blur-sm font-medium"
                >
                  <option value="">Toutes les villes</option>
                  <option value="dakar">Dakar</option>
                  <option value="thies">Thiès</option>
                  <option value="kaolack">Kaolack</option>
                  <option value="ziguinchor">Ziguinchor</option>
                  <option value="saint-louis">Saint-Louis</option>
                  <option value="tambacounda">Tambacounda</option>
                  <option value="mbour">Mbour</option>
                  <option value="diourbel">Diourbel</option>
                  <option value="louga">Louga</option>
                  <option value="kolda">Kolda</option>
                </select>
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all font-bold transform hover:scale-105"
                >
                  <Search className="w-5 h-5" />
                  <span>Rechercher</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {providers.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? `Aucun prestataire trouvé pour "${searchTerm}"` : 'Aucun prestataire trouvé'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Ce métier ou service n\'est pas encore disponible sur notre plateforme' : 'Essayez de modifier vos critères de recherche'}
            </p>
            <Link to="/prestataire" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Devenir prestataire
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((provider) => (
              <div key={provider.id} className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-orange-100 hover:border-orange-300 overflow-hidden transform hover:-translate-y-3 hover:scale-105">
                <div className="relative h-48 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 overflow-hidden">
                  {provider.cover_photo ? (
                    <img
                      src={`https://amnafi.net/storage/${provider.cover_photo}`}
                      alt="Couverture"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-300 via-red-300 to-orange-300 opacity-60"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                
                {provider.is_premium && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl animate-pulse ring-2 ring-white">
                    <Crown className="w-5 h-5" />
                    PREMIUM
                  </div>
                )}
                
                <div className="p-6 relative bg-gradient-to-b from-white to-orange-50/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-red-200 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl transform group-hover:rotate-6 transition-transform duration-500">
                          {provider.profile_photo ? (
                            <img
                              src={`https://amnafi.net/storage/${provider.profile_photo}`}
                              alt={provider.business_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                              <span className="text-white font-bold text-2xl">{provider.business_name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        {provider.is_verified && (
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-2 ring-4 ring-white shadow-xl">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                          {provider.business_name}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">{provider.user.name}</p>
                      </div>
                    </div>
                  </div>

                  {provider.category && (
                    <div className="inline-flex items-center bg-gradient-to-r from-orange-100 via-red-100 to-orange-100 px-4 py-2 rounded-full mb-4 shadow-sm">
                      <span className="text-lg mr-2">{provider.category.icon}</span>
                      <span className="text-sm text-gray-800 font-bold">{provider.category.name}</span>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-700 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-3 rounded-xl shadow-sm">
                      <MapPin className="w-5 h-5 mr-3 text-orange-600" />
                      <span className="font-semibold">{provider.city}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-3 rounded-xl shadow-sm">
                      <Phone className="w-5 h-5 mr-3 text-red-600" />
                      <span className="font-semibold">{provider.phone}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-orange-100 pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 px-4 py-3 rounded-xl shadow-sm">
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-gray-900">{parseFloat(provider.rating).toFixed(1)}</span>
                      <span className="text-xs text-gray-500 font-medium">({provider.reviews_count})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${provider.phone}`}
                        className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
                        title="Appeler"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                      <a
                        href={provider.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
