'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Phone, Crown, ArrowLeft } from 'lucide-react';

interface Provider {
  id: number;
  business_name: string;
  slug: string;
  description: string;
  phone: string;
  city: string;
  rating: string;
  reviews_count: number;
  is_verified: boolean;
  is_premium: boolean;
  profile_photo: string;
  user: {
    name: string;
  };
  category: {
    name: string;
    icon: string;
  };
}

export default function CategoryProviders() {
  const params = useParams();
  const categoryId = params.id as string;
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // Essayer d'abord la nouvelle route
        let response = await fetch(`http://localhost:8000/api/public/categories/${categoryId}/providers`);
        let data = await response.json();
        
        // Si la nouvelle route ne fonctionne pas, utiliser l'ancienne
        if (!response.ok || !data.success) {
          response = await fetch(`http://localhost:8000/api/public/providers/by-category/${categoryId}`);
          data = await response.json();
        }
        
        if (data.success) {
          setProviders(data.data);
          if (data.data.length > 0) {
            setCategoryName(data.data[0].category.name);
          } else if (data.category) {
            setCategoryName(data.category.name);
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProviders();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des prestataires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {categoryName}
                </h1>
                <p className="text-gray-600">
                  {providers.length} prestataire{providers.length > 1 ? 's' : ''} disponible{providers.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prestataires */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {providers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun prestataire trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Il n'y a pas encore de prestataires dans cette catégorie.
            </p>
            <Link
              href="/prestataire"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Devenir prestataire
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="p-6">
                  {/* Header avec photo et badges */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                          {provider.profile_photo ? (
                            <Image
                              src={`http://localhost:8000/storage/${provider.profile_photo}`}
                              alt={provider.business_name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-lg">
                                {provider.business_name.charAt(0)}
                              </span>
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
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {provider.business_name}
                        </h3>
                        <p className="text-xs text-gray-600">{provider.user.name}</p>
                      </div>
                    </div>
                    {provider.is_verified && (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Vérifié
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {provider.description}
                  </p>

                  {/* Informations */}
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

                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {parseFloat(provider.rating).toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({provider.reviews_count} avis)
                      </span>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                      Contacter
                    </button>
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