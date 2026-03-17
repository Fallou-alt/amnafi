'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Award, MapPin, Languages, Calendar, Shield, ArrowLeft, Send } from 'lucide-react';
import { jojApi } from '@/lib/api/joj';
import { OfficialProvider } from '@/types/joj';
import Link from 'next/link';

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<OfficialProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [missionData, setMissionData] = useState({
    title: '',
    description: '',
    location: '',
    preferred_date: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProvider();
  }, [params.id]);

  const loadProvider = async () => {
    try {
      setLoading(true);
      const data = await jojApi.getOfficialProvider(Number(params.id));
      console.log('Provider data:', data);
      setProvider(data);
    } catch (error) {
      console.error('Erreur chargement prestataire:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      if (confirm('Vous devez être connecté pour créer une mission. Voulez-vous vous connecter maintenant?')) {
        router.push('/provider/login');
      }
      return;
    }
    
    try {
      setSubmitting(true);
      await jojApi.createMission(missionData);
      alert('Mission créée avec succès! Un administrateur la validera bientôt.');
      setShowMissionForm(false);
      setMissionData({ title: '', description: '', location: '', preferred_date: '' });
      router.push('/joj/missions');
    } catch (error: any) {
      console.error('Erreur:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ') 
        : 'Erreur lors de la création de la mission.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Prestataire non trouvé</p>
      </div>
    );
  }

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
      <div className="max-w-5xl mx-auto">
        <Link href="/joj/official-providers">
          <button className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à la liste
          </button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="relative h-80 overflow-hidden">
            <img
              src={provider.photo.includes('unsplash') ? provider.photo.replace('http://localhost:8000/storage/', '') : provider.photo}
              alt={provider.full_name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${availabilityColors[provider.availability]} shadow-lg`}>
              {availabilityLabels[provider.availability]}
            </div>
            <div className="absolute bottom-6 left-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Badge #{provider.badge_number}
            </div>
          </div>

          <div className="p-8 bg-gradient-to-b from-white to-gray-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {provider.full_name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{provider.full_name}</h1>
                <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">{provider.specialty}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                <Award className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Expérience</p>
                  <p className="text-gray-700 font-medium">{provider.years_experience} ans</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                <MapPin className="w-6 h-6 text-red-600 mr-3 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Zone d'intervention</p>
                  <p className="text-gray-700 font-medium">{provider.intervention_zone}</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <Languages className="w-6 h-6 text-green-600 mr-3 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Langues</p>
                  <p className="text-gray-700 font-medium">{provider.languages.join(', ').toUpperCase()}</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-start bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Certifications</p>
                  <p className="text-gray-700 font-medium">{provider.certifications.length} certification(s)</p>
                </div>
              </motion.div>
            </div>

            <div className="mb-8 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{provider.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                Certifications
              </h2>
              <div className="flex flex-wrap gap-3">
                {provider.certifications.map((cert, index) => (
                  <span key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {!showMissionForm ? (
              <div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Vous devez être connecté pour demander une mission. La demande sera validée par un administrateur avant d'être assignée au prestataire.
                  </p>
                </div>
                <button
                  onClick={() => setShowMissionForm(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300"
                >
                  Demander une mission
                </button>
              </div>
            ) : (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleSubmitMission}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Créer une demande de mission</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Votre demande sera validée par un administrateur avant d'être assignée au prestataire.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la mission</label>
                    <input
                      type="text"
                      required
                      value={missionData.title}
                      onChange={(e) => setMissionData({ ...missionData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Visite guidée de Dakar"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      required
                      value={missionData.description}
                      onChange={(e) => setMissionData({ ...missionData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Décrivez votre besoin..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
                    <input
                      type="text"
                      required
                      value={missionData.location}
                      onChange={(e) => setMissionData({ ...missionData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Centre-ville de Dakar"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date préférée</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={missionData.preferred_date}
                      onChange={(e) => setMissionData({ ...missionData, preferred_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {submitting ? 'Envoi...' : 'Envoyer la demande'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMissionForm(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
