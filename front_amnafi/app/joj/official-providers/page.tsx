'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Languages, Award, ChevronRight } from 'lucide-react';
import { jojApi } from '@/lib/api/joj';
import { OfficialProvider } from '@/types/joj';
import Link from 'next/link';

export default function OfficialProvidersPage() {
  const [providers, setProviders] = useState<OfficialProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ specialty: '', zone: '', language: '' });

  useEffect(() => {
    loadProviders();
  }, [filters]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.specialty) params.specialty = filters.specialty;
      if (filters.zone) params.zone = filters.zone;
      if (filters.language) params.language = filters.language;
      const data = await jojApi.getOfficialProviders(params);
      setProviders(data);
    } catch (error) {
      console.error('Erreur chargement prestataires:', error);
    } finally {
      setLoading(false);
    }
  };

  const availabilityColors = {
    available: 'bg-green-100 text-green-800',
    busy: 'bg-orange-100 text-orange-800',
    unavailable: 'bg-red-100 text-red-800'
  };

  const availabilityLabels = {
    available: 'Disponible',
    busy: 'Occupé',
    unavailable: 'Indisponible'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prestataires Officiels JOJ Dakar 2026
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez nos prestataires certifiés pour les Jeux Olympiques de la Jeunesse
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
              <input
                type="text"
                placeholder="Ex: Guide touristique"
                value={filters.specialty}
                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
              <input
                type="text"
                placeholder="Ex: Dakar"
                value={filters.zone}
                onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes</option>
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/joj/official-providers/${provider.id}`}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                    <div className="relative h-48">
                      <img
                        src={provider.photo}
                        alt={provider.full_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${availabilityColors[provider.availability]}`}>
                        {availabilityLabels[provider.availability]}
                      </div>
                      <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Badge #{provider.badge_number}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{provider.full_name}</h3>
                      <p className="text-blue-600 font-semibold mb-3">{provider.specialty}</p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{provider.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="w-4 h-4 mr-2 text-yellow-500" />
                          <span>{provider.years_experience} ans d'expérience</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-red-500" />
                          <span>{provider.intervention_zone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Languages className="w-4 h-4 mr-2 text-green-500" />
                          <span>{provider.languages.join(', ')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-500">{provider.certifications.length} certification(s)</span>
                        <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && providers.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun prestataire trouvé avec ces critères</p>
          </div>
        )}
      </div>
    </div>
  );
}
