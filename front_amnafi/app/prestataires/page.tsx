'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Phone, Crown, ArrowLeft, Search, MessageCircle, CheckCircle } from 'lucide-react';

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
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, []);

  const fetchProviders = async (search = '', categoryId = '') => {
    try {
      let url = 'http://localhost:8000/api/public/providers';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryId) params.append('category_id', categoryId);
      if (params.toString()) url += '?' + params.toString();
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProviders(data.data.data || data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/public/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchProviders(searchTerm, selectedCategory);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    fetchProviders(searchTerm, categoryId);
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
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/" className="flex items-center text-orange-600 hover:text-orange-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tous les prestataires</h1>
              <p className="text-gray-600">{providers.length} prestataires</p>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl shadow-md border border-orange-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom, métier, ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all shadow-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all shadow-sm"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                <Search className="w-4 h-4" />
                <span>Rechercher</span>
              </button>
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
            <Link href="/prestataire" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Devenir prestataire
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((provider) => (
              <div key={provider.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300 overflow-hidden transform hover:-translate-y-2">
                {/* Photo de couverture */}
                <div className="relative h-40 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 overflow-hidden">
                  {provider.cover_photo ? (
                    <img
                      src={`http://localhost:8000/storage/${provider.cover_photo}`}
                      alt="Couverture"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-300 via-red-300 to-pink-300 opacity-50"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                {/* Badge Premium épinglé */}
                {provider.is_premium && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xl animate-pulse">
                    <Crown className="w-4 h-4" />
                    PREMIUM
                  </div>
                )}
                
                <div className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-red-200 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                          {provider.profile_photo ? (
                            <img
                              src={`http://localhost:8000/storage/${provider.profile_photo}`}
                              alt={provider.business_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
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
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                          {provider.business_name}
                          {provider.is_verified && (
                            <CheckCircle className="w-5 h-5 text-blue-500" title="Certifié" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">{provider.user.name}</p>
                      </div>
                    </div>
                  </div>

                  {provider.category && (
                    <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1.5 rounded-full mb-4">
                      <span className="text-base mr-2">{provider.category.icon}</span>
                      <span className="text-sm text-gray-700 font-semibold">{provider.category.name}</span>
                    </div>
                  )}

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                      <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                      <span className="font-medium">{provider.city}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                      <Phone className="w-4 h-4 mr-2 text-orange-600" />
                      <span className="font-medium">{provider.phone}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-orange-100 pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-2 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-base font-bold text-gray-900">{parseFloat(provider.rating).toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({provider.reviews_count})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${provider.phone}`}
                        className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}