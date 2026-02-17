'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Star, Crown, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  providers_count: number;
}

interface Provider {
  id: number;
  business_name: string;
  rating: string;
  reviews_count: number;
  is_premium: boolean;
  city: string;
  profile_photo: string;
  whatsapp_url: string;
  user: {
    name: string;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 24;
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const category = categories.find(c => c.id === parseInt(categoryParam));
      if (category) {
        handleCategoryClick(category);
      }
    }
  }, [categoryParam, categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/public/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvidersByCategory = async (categoryId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/public/categories/${categoryId}/providers`);
      const data = await response.json();
      if (data.success) {
        setProviders(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    fetchProvidersByCategory(category.id);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
      red: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
      teal: 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
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
            <Link href="/services" className="flex items-center text-orange-600 hover:text-orange-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catégories de métiers</h1>
              <p className="text-gray-600">Découvrez tous les services disponibles sur AMNAFI ({categories.length} catégories)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCategory ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {categories.slice((currentPage - 1) * categoriesPerPage, currentPage * categoriesPerPage).map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('category', category.id.toString());
                    window.history.pushState({}, '', url.toString());
                    handleCategoryClick(category);
                  }}
                  className="p-4 rounded-xl bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-all duration-200 hover:shadow-md"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-medium text-sm text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.providers_count || 0}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {Math.ceil(categories.length / categoriesPerPage) > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-orange-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(Math.min(Math.ceil(categories.length / categoriesPerPage), currentPage + 1))}
                    disabled={currentPage === Math.ceil(categories.length / categoriesPerPage)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                    <span className="text-3xl">{selectedCategory.icon}</span>
                    <span>{selectedCategory.name}</span>
                  </h2>
                  <p className="text-gray-600">{providers.length} prestataires disponibles</p>
                </div>
              </div>
            </div>

            {providers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">{selectedCategory.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun prestataire dans cette catégorie
                </h3>
                <p className="text-gray-600 mb-4">
                  Cette catégorie n'a pas encore de prestataires inscrits
                </p>
                <Link href="/prestataire" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Devenir prestataire
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {providers.map((provider) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                            {provider.profile_photo ? (
                              <img
                                src={`http://localhost:8000/storage/${provider.profile_photo}`}
                                alt={provider.business_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                                <span className="text-orange-600 font-semibold text-lg">{provider.business_name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          {provider.is_premium && (
                            <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1">
                              <Crown className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">{provider.business_name}</h3>
                          <p className="text-gray-600">{provider.user?.name}</p>
                          <p className="text-sm text-gray-500">{provider.city}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{parseFloat(provider.rating).toFixed(1)}</span>
                            <span className="text-sm text-gray-500">({provider.reviews_count} avis)</span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={provider.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>Contacter</span>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}