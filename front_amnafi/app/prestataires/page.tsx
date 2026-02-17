'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Phone, Crown, ArrowLeft, Search, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
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
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom, métier, ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="md:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                        {provider.profile_photo ? (
                          <img
                            src={`http://localhost:8000/storage/${provider.profile_photo}`}
                            alt={provider.business_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                            <span className="text-orange-600 font-semibold">{provider.business_name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      {provider.is_premium && (
                        <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{provider.business_name}</h3>
                      <p className="text-sm text-gray-600">{provider.user.name}</p>
                    </div>
                  </div>
                </div>

                {provider.category && (
                  <div className="flex items-center mb-3">
                    <span className="text-sm mr-2">{provider.category.icon}</span>
                    <span className="text-sm text-gray-600">{provider.category.name}</span>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {provider.city}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {provider.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{parseFloat(provider.rating).toFixed(1)}</span>
                  </div>
                  <a
                    href={provider.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}