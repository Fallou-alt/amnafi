import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, Crown, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

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
  };
}

export default function CategoryPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    if (categoryId) {
      fetchProviders(categoryId);
    }
  }, [categoryId]);

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

  const fetchProviders = async (catId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/public/providers/by-category/${catId}`);
      if (response.data.success) {
        setProviders(response.data.data.data || response.data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId) {
      fetchProviders(catId);
    } else {
      setProviders([]);
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(p => 
    p.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCat = categories.find(c => c.id.toString() === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link to="/services" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedCat ? `${selectedCat.icon} ${selectedCat.name}` : 'Catégories'}
              </h1>
              <p className="text-gray-600">{filteredProviders.length} prestataires</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl shadow-md border border-blue-100">
            <div className="flex flex-col gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher un prestataire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all shadow-sm"
                />
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all shadow-sm"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : !selectedCategory ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sélectionnez une catégorie
            </h3>
            <p className="text-gray-600">
              Choisissez une catégorie pour voir les prestataires disponibles
            </p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun prestataire trouvé
            </h3>
            <p className="text-gray-600">
              Aucun prestataire dans cette catégorie pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProviders.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative h-40 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 overflow-hidden">
                  {provider.cover_photo ? (
                    <img
                      src={`https://amnafi.net/backend/public/storage/${provider.cover_photo}`}
                      alt="Couverture"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 opacity-50"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                {provider.is_premium && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xl">
                    <Crown className="w-4 h-4" />
                    PREMIUM
                  </div>
                )}
                
                <div className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                          {provider.profile_photo ? (
                            <img
                              src={`https://amnafi.net/backend/public/storage/${provider.profile_photo}`}
                              alt={provider.business_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                              <span className="text-white font-bold text-xl">{provider.business_name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        {provider.is_verified && (
                          <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-1.5 ring-2 ring-white shadow-lg">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{provider.business_name}</h3>
                        <p className="text-sm text-gray-500 font-medium">{provider.user.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-medium">{provider.city}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-medium">{provider.phone}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-blue-100 pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-2 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-base font-bold text-gray-900">{parseFloat(provider.rating).toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({provider.reviews_count})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${provider.phone}`}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
                        title="Appeler"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                      <a
                        href={provider.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
