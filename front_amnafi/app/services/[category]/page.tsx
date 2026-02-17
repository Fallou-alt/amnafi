'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Phone, Crown, ArrowLeft, MessageCircle } from 'lucide-react';

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

export default function CategoryProviders() {
  const params = useParams();
  const categoryId = params.category as string;
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchProviders();
    }
  }, [categoryId]);

  const fetchProviders = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/public/categories/${categoryId}/providers`);
      const data = await response.json();
      
      if (data.success) {
        setProviders(data.data);
        setCategory(data.category);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
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
          <div className="flex items-center space-x-4">
            <Link href="/services" className="flex items-center text-orange-600 hover:text-orange-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux services
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                {category && <span className="text-3xl">{category.icon}</span>}
                <span>{category?.name || 'Catégorie'}</span>
              </h1>
              <p className="text-gray-600">{providers.length} prestataires</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {providers.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun prestataire dans cette catégorie</h3>
            <p className="text-gray-600 mb-4">Soyez le premier à proposer vos services !</p>
            <Link href="/prestataire" className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
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

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{provider.description}</p>

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
                    <span className="text-sm text-gray-500">({provider.reviews_count})</span>
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