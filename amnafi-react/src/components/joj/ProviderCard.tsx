import { motion } from 'framer-motion';
import { Award, MapPin, Languages, ChevronRight } from 'lucide-react';
import { type OfficialProvider } from '../../lib/jojApi';
import { Link } from 'react-router-dom';

interface ProviderCardProps {
  provider: OfficialProvider;
  index?: number;
}

export default function ProviderCard({ provider, index = 0 }: ProviderCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/joj/official-providers/${provider.id}`}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group">
          <div className="relative h-48">
            <img
              src={provider.photo}
              alt={provider.full_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${availabilityColors[provider.availability as keyof typeof availabilityColors]}`}>
              {availabilityLabels[provider.availability as keyof typeof availabilityLabels]}
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
  );
}
