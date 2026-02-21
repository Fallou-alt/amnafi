'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, Phone, Crown, ArrowLeft, MessageCircle, CheckCircle, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface Provider {
  id: number;
  business_name: string;
  phone: string;
  city: string;
  rating: string;
  service_rating: string;
  reviews_count: number;
  service_reviews_count: number;
  is_official: boolean;
  is_partner: boolean;
  profile_photo: string;
  cover_photo: string;
  profile_photo_url: string;
  whatsapp_url: string;
  certifications: string[];
  user: { name: string; };
  category: { name: string; icon: string; };
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function OfficialProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterPartner, setFilterPartner] = useState(false);

  useEffect(() => {
    fetchProviders();
    fetchCategories();
  }, []);

  const fetchProviders = async (categoryId = '', isPartner = false) => {
    try {
      let url = 'http://localhost:8000/api/public/official-providers';
      const params = new URLSearchParams();
      if (categoryId) params.append('category_id', categoryId);
      if (isPartner) params.append('is_partner', '1');
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

  const handleFilter = (categoryId: string, isPartner: boolean) => {
    setSelectedCategory(categoryId);
    setFilterPartner(isPartner);
    setLoading(true);
    fetchProviders(categoryId, isPartner);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-orange-600 hover:text-orange-700">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-8 h-8 text-blue-600" />
                  Prestataires Officiels
                </h1>
                <p className="text-gray-600">Validés et certifiés par AMNAFI</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-4 sm:p-6 rounded-2xl shadow-md border border-orange-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => handleFilter(e.target.value, filterPartner)}
                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              >
                <option value="">Tous les domaines</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleFilter(selectedCategory, !filterPartner)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                  filterPartner
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-300'
                }`}
              >
                <Crown className="w-5 h-5 inline mr-2" />
                Partenaires uniquement
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {providers.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun prestataire officiel trouvé
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 overflow-hidden"
              >
                <div className="relative h-40 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 overflow-hidden">
                  {provider.cover_photo ? (
                    <img
                      src={`http://localhost:8000/storage/${provider.cover_photo}`}
                      alt="Couverture"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 opacity-50"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {provider.is_partner && (
                      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xl">
                        <Crown className="w-3 h-3" />
                        PARTENAIRE
                      </div>
                    )}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xl">
                      <Shield className="w-3 h-3" />
                      OFFICIEL
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                          {provider.profile_photo ? (
                            <img
                              src={`http://localhost:8000/storage/${provider.profile_photo}`}
                              alt={provider.business_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                              <span className="text-white font-bold text-xl">{provider.business_name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-500 to-green-600 rounded-full p-1.5 ring-2 ring-white shadow-lg">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{provider.business_name}</h3>
                        <p className="text-sm text-gray-500 font-medium">{provider.user.name}</p>
                      </div>
                    </div>
                  </div>

                  {provider.category && (
                    <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1.5 rounded-full mb-4">
                      <span className="text-base mr-2">{provider.category.icon}</span>
                      <span className="text-sm text-gray-700 font-semibold">{provider.category.name}</span>
                    </div>
                  )}

                  {provider.certifications && provider.certifications.length > 0 && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>{provider.certifications.length} certification(s)</span>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-medium">{provider.city}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-medium">{provider.phone}</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-blue-100 pt-4 mb-4">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-2 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-base font-bold text-gray-900">{parseFloat(provider.service_rating || provider.rating).toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({provider.service_reviews_count || provider.reviews_count})</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${provider.phone}`}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-semibold text-sm text-center"
                    >
                      Appeler
                    </a>
                    <a
                      href={provider.whatsapp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
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
