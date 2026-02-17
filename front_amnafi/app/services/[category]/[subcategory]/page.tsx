'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, MapPin, Star, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '../../../../lib/api';

interface Provider {
  id: number;
  business_name: string;
  description: string;
  rating: number;
  reviews_count: number;
  city: string;
  phone: string;
  email: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  price_unit: string;
  provider: Provider;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: {
    name: string;
    slug: string;
    icon: string;
  };
}

export default function SubcategoryServicesPage() {
  const params = useParams();
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get(`/public/categories/${params.category}/subcategories/${params.subcategory}/services`);
        if (response.data.success) {
          setSubcategory(response.data.data.subcategory);
          setServices(response.data.data.services.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
        setError('Erreur lors du chargement des services');
      } finally {
        setLoading(false);
      }
    };

    if (params.category && params.subcategory) {
      fetchServices();
    }
  }, [params.category, params.subcategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des prestataires...</p>
        </div>
      </div>
    );
  }

  if (error || !subcategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Service non trouvé'}</p>
          <Link href="/services" className="text-blue-600 hover:underline">
            Retour aux services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-600">AMNAFI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/services" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Retour aux services</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-5xl">{subcategory.category.icon}</span>
              <h1 className="text-4xl md:text-5xl font-bold">{subcategory.name}</h1>
            </div>
            <p className="text-xl text-blue-100 mb-2">{subcategory.category.name}</p>
            <p className="text-lg text-blue-200">{subcategory.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Services/Prestataires */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucun prestataire trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Il n'y a pas encore de prestataires inscrits pour ce service.
                </p>
                <Link 
                  href="/prestataire"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Devenir prestataire
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.provider.business_name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{service.provider.description}</p>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{service.provider.rating}</span>
                        <span className="text-sm text-gray-500">({service.provider.reviews_count} avis)</span>
                      </div>
                      {service.provider.city && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{service.provider.city}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{service.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        {service.price} {service.price_unit}
                      </span>
                      <div className="flex space-x-2">
                        {service.provider.phone && (
                          <a
                            href={`tel:${service.provider.phone}`}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        {service.provider.email && (
                          <a
                            href={`mailto:${service.provider.email}`}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}