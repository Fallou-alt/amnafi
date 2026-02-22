'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, Phone, Crown, ArrowLeft, MessageCircle, CheckCircle, Award, Shield, X, Calendar, DollarSign, FileText, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [missionForm, setMissionForm] = useState({
    title: '',
    description: '',
    location: '',
    preferred_date: '',
    budget: ''
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

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

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedProvider(provider);
                        setShowMissionModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Demander une mission
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProvider(provider);
                          setShowReviewModal(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg font-semibold text-sm flex items-center justify-center gap-1"
                      >
                        <Star className="w-4 h-4" />
                        Noter
                      </button>
                      <a
                        href={`tel:${provider.phone}`}
                        className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-2.5 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={provider.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white p-2.5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Mission */}
      <AnimatePresence>
        {showMissionModal && selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMissionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Demander une mission</h3>
                    <p className="text-blue-100 mt-1">à {selectedProvider.business_name}</p>
                  </div>
                  <button
                    onClick={() => setShowMissionModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Titre de la mission *
                  </label>
                  <input
                    type="text"
                    value={missionForm.title}
                    onChange={(e) => setMissionForm({...missionForm, title: e.target.value})}
                    placeholder="Ex: Réparation plomberie urgente"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    value={missionForm.description}
                    onChange={(e) => setMissionForm({...missionForm, description: e.target.value})}
                    placeholder="Décrivez en détail votre besoin..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Localisation *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={missionForm.location}
                      onChange={(e) => setMissionForm({...missionForm, location: e.target.value})}
                      placeholder="Adresse complète"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date souhaitée
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={missionForm.preferred_date}
                        onChange={(e) => setMissionForm({...missionForm, preferred_date: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget estimé (FCFA)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={missionForm.budget}
                        onChange={(e) => setMissionForm({...missionForm, budget: e.target.value})}
                        placeholder="Ex: 50000"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Le prestataire recevra votre demande et vous contactera dans les plus brefs délais.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowMissionModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!missionForm.title || !missionForm.description || !missionForm.location) {
                        alert('Veuillez remplir tous les champs obligatoires');
                        return;
                      }
                      
                      try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          alert('Vous devez être connecté pour demander une mission');
                          return;
                        }

                        const response = await fetch('http://localhost:8000/api/protected/missions', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            provider_id: selectedProvider.id,
                            ...missionForm
                          })
                        });

                        const data = await response.json();
                        
                        if (data.success) {
                          alert('Mission envoyée avec succès!');
                          setShowMissionModal(false);
                          setMissionForm({ title: '', description: '', location: '', preferred_date: '', budget: '' });
                        } else {
                          alert(data.message || 'Erreur lors de l\'envoi de la mission');
                        }
                      } catch (error) {
                        console.error('Erreur:', error);
                        alert('Erreur lors de l\'envoi de la mission');
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    Envoyer la demande
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Avis */}
      <AnimatePresence>
        {showReviewModal && selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Donner votre avis</h3>
                    <p className="text-yellow-100 mt-1">sur {selectedProvider.business_name}</p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                    Votre note
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-12 h-12 ${
                            star <= reviewForm.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center mt-2 text-lg font-bold text-gray-700">
                    {reviewForm.rating} / 5
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Votre commentaire (optionnel)
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    placeholder="Partagez votre expérience avec ce prestataire..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!reviewForm.rating) {
                        alert('Veuillez sélectionner une note');
                        return;
                      }
                      
                      try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          alert('Vous devez être connecté pour noter un prestataire');
                          return;
                        }

                        const response = await fetch('http://localhost:8000/api/protected/service-reviews', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            provider_id: selectedProvider.id,
                            rating: reviewForm.rating,
                            comment: reviewForm.comment
                          })
                        });

                        const data = await response.json();
                        
                        if (data.success) {
                          alert('Avis envoyé avec succès!');
                          setShowReviewModal(false);
                          setReviewForm({ rating: 5, comment: '' });
                          fetchProviders(selectedCategory, filterPartner);
                        } else {
                          alert(data.message || 'Erreur lors de l\'envoi de l\'avis');
                        }
                      } catch (error) {
                        console.error('Erreur:', error);
                        alert('Erreur lors de l\'envoi de l\'avis');
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Star className="w-5 h-5" />
                    Publier l'avis
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
