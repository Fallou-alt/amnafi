'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, User, FileText } from 'lucide-react';
import { jojApi } from '@/lib/api/joj';
import { JojMission } from '@/types/joj';

export default function MyMissionsPage() {
  const [missions, setMissions] = useState<JojMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const data = await jojApi.getMyMissions();
      setMissions(data);
    } catch (error) {
      console.error('Erreur chargement missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    validated: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'En attente',
    validated: 'Validée',
    assigned: 'Assignée',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mes Missions JOJ</h1>
          <p className="text-lg text-gray-600">Suivez l'état de vos demandes de missions</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : missions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune mission pour le moment</p>
          </div>
        ) : (
          <div className="space-y-6">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{mission.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[mission.status]}`}>
                      {statusLabels[mission.status]}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Créée le {new Date(mission.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{mission.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    <span>{mission.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{new Date(mission.preferred_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {mission.official_provider && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="font-semibold text-gray-900">Prestataire assigné</span>
                    </div>
                    <p className="text-gray-700">{mission.official_provider.full_name}</p>
                    <p className="text-sm text-gray-600">{mission.official_provider.specialty}</p>
                  </div>
                )}

                {mission.admin_notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Notes de l'administrateur:</p>
                    <p className="text-gray-600">{mission.admin_notes}</p>
                  </div>
                )}

                {mission.validated_at && (
                  <div className="mt-4 text-sm text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Validée le {new Date(mission.validated_at).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
