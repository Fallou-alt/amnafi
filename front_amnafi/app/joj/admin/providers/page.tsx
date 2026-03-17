'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Power } from 'lucide-react';
import { jojApi } from '@/lib/api/joj';
import { OfficialProvider } from '@/types/joj';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<OfficialProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    photo: null as File | null,
    specialty: '',
    description: '',
    certifications: '',
    years_experience: '',
    intervention_zone: '',
    availability: 'available',
    languages: '',
    badge_number: ''
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await jojApi.getOfficialProviders({});
      setProviders(data);
    } catch (error) {
      console.error('Erreur chargement prestataires:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('full_name', formData.full_name);
    if (formData.photo) data.append('photo', formData.photo);
    data.append('specialty', formData.specialty);
    data.append('description', formData.description);
    data.append('certifications', formData.certifications);
    data.append('years_experience', formData.years_experience);
    data.append('intervention_zone', formData.intervention_zone);
    data.append('availability', formData.availability);
    data.append('languages', formData.languages);
    data.append('badge_number', formData.badge_number);

    try {
      if (editingId) {
        await jojApi.updateProvider(editingId, data);
        alert('Prestataire mis à jour');
      } else {
        await jojApi.createProvider(data);
        alert('Prestataire créé');
      }
      loadProviders();
      resetForm();
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (provider: OfficialProvider) => {
    setEditingId(provider.id);
    setFormData({
      full_name: provider.full_name,
      photo: null,
      specialty: provider.specialty,
      description: provider.description,
      certifications: provider.certifications.join(', '),
      years_experience: provider.years_experience.toString(),
      intervention_zone: provider.intervention_zone,
      availability: provider.availability,
      languages: provider.languages.join(', '),
      badge_number: provider.badge_number
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce prestataire?')) return;
    try {
      await jojApi.deleteProvider(id);
      alert('Prestataire supprimé');
      loadProviders();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await jojApi.toggleProviderStatus(id);
      loadProviders();
    } catch (error) {
      alert('Erreur lors du changement de statut');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      full_name: '',
      photo: null,
      specialty: '',
      description: '',
      certifications: '',
      years_experience: '',
      intervention_zone: '',
      availability: 'available',
      languages: '',
      badge_number: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Prestataires JOJ</h1>
            <p className="text-lg text-gray-600">Administration des prestataires officiels</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau prestataire
          </button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Modifier' : 'Nouveau'} prestataire
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
                  <input
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                  <input
                    type="text"
                    required
                    value={formData.badge_number}
                    onChange={(e) => setFormData({ ...formData, badge_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Années d'expérience</label>
                  <input
                    type="number"
                    required
                    value={formData.years_experience}
                    onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zone d'intervention</label>
                  <input
                    type="text"
                    required
                    value={formData.intervention_zone}
                    onChange={(e) => setFormData({ ...formData, intervention_zone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Disponible</option>
                    <option value="busy">Occupé</option>
                    <option value="unavailable">Indisponible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Langues (séparées par virgule)</label>
                  <input
                    type="text"
                    required
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="fr, en"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (séparées par virgule)</label>
                <input
                  type="text"
                  required
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Certification 1, Certification 2"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  {editingId ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={provider.photo}
                    alt={provider.full_name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    provider.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {provider.is_active ? 'Actif' : 'Inactif'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{provider.full_name}</h3>
                  <p className="text-blue-600 text-sm font-semibold mb-2">{provider.specialty}</p>
                  <p className="text-xs text-gray-600 mb-3">Badge #{provider.badge_number}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(provider)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleToggleStatus(provider.id)}
                      className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(provider.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
