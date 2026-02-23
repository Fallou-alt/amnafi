'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Phone, Crown, ArrowLeft, MessageCircle, CheckCircle, Award, Shield, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: { name: string; };
}

interface Provider {
  id: number;
  business_name: string;
  description: string;
  phone: string;
  city: string;
  address: string;
  service_rating: string;
  service_reviews_count: number;
  is_partner: boolean;
  profile_photo: string;
  cover_photo: string;
  whatsapp_url: string;
  certifications: string[];
  diplomas: string[];
  user: { name: string; };
  category: { name: string; icon: string; };
}

export default function ProviderDetails() {
  const params = useParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchProviderDetails();
    }
  }, [params?.id]);

  const fetchProviderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/public/official-providers/${params?.id}`);
      const data = await response.json();
      
      if (data.success) {
        setProvider(data.data.provider);
        setReviews(data.data.reviews || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prestataire non trouvé</h2>
          <Link href="/prestataires-officiels" className="text-blue-600 hover:underline">Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="relative h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        {provider.cover_photo && (
          <img src={`http://localhost:8000/storage/${provider.cover_photo}`} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute top-6 left-6">
          <Link href="/prestataires-officiels" className="flex items-center text-white hover:text-gray-200 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Link>
        </div>

        {provider.is_partner && (
          <div className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl">
            <Crown className="w-5 h-5" />
            PARTENAIRE
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-blue-200">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                    {provider.profile_photo ? (
                      <img src={`http://localhost:8000/storage/${provider.profile_photo}`} alt={provider.business_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                        <span className="text-white font-bold text-4xl">{provider.business_name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full p-2 ring-4 ring-white shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">{provider.business_name}</h1>
                <p className="text-gray-600 mb-4">{provider.user.name}</p>

                {provider.category && (
                  <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-4">
                    <span className="text-xl mr-2">{provider.category.icon}</span>
                    <span className="text-sm font-semibold text-gray-700">{provider.category.name}</span>
                  </div>
                )}

                <div className="w-full space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                        <span className="text-2xl font-bold text-gray-900">{parseFloat(provider.service_rating).toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-gray-600">{provider.service_reviews_count} avis</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-xl">
                    <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-semibold">{provider.city}</p>
                      <p className="text-xs text-gray-500">{provider.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-xl">
                    <Phone className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="font-semibold">{provider.phone}</span>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <a href={`tel:${provider.phone}`} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-semibold text-center block">
                    <Phone className="w-5 h-5 inline mr-2" />
                    Appeler
                  </a>
                  <a href={provider.whatsapp_url} target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg font-semibold text-center block">
                    <MessageCircle className="w-5 h-5 inline mr-2" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                À propos
              </h2>
              <p className="text-gray-700 leading-relaxed">{provider.description}</p>
            </motion.div>

            {provider.certifications && provider.certifications.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  Certifications & Diplômes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {provider.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl">
                      <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{cert}</span>
                    </div>
                  ))}
                  {provider.diplomas && provider.diplomas.map((diploma, index) => (
                    <div key={`diploma-${index}`} className="flex items-center gap-3 bg-purple-50 p-3 rounded-xl">
                      <Award className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{diploma}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Avis clients ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Aucun avis pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.user.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-bold text-gray-900">{review.rating}</span>
                        </div>
                      </div>
                      {review.comment && <p className="text-gray-700 leading-relaxed">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
