import { motion } from 'framer-motion';
import { Calendar, MapPin, User } from 'lucide-react';
import { JojMission } from '@/types/joj';

interface MissionCardProps {
  mission: JojMission;
  index?: number;
}

export default function MissionCard({ mission, index = 0 }: MissionCardProps) {
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
    <motion.div
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
    </motion.div>
  );
}
