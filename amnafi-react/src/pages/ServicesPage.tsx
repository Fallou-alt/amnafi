import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import api from '../lib/api';

export default function ServicesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/categories')
      .then((r) => { if (r.data.success) setCategories(r.data.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3">
        <Link to="/" className="text-gray-400 hover:text-orange-600 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Link to="/" className="flex items-center gap-2 mr-2">
          <img src="/images/1logoamnafi.png" alt="AMNAFI" className="w-7 h-7" />
          <span className="font-bold text-orange-600">AMNAFI</span>
        </Link>
        <div className="h-4 w-px bg-gray-200" />
        <div>
          <h1 className="font-bold text-gray-900">Services</h1>
          <p className="text-xs text-gray-400">Trouvez un prestataire par métier</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Bannière orange */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 mb-6 text-white">
          <h2 className="font-bold text-lg">Tous nos métiers</h2>
          <p className="text-blue-100 text-sm mt-0.5">Cliquez sur une catégorie pour voir les prestataires disponibles</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/prestataires?category_id=${cat.id}`}
                className="bg-white rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-sm transition p-4 flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition">
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition leading-tight">
                  {cat.name}
                </p>
                {cat.providers_count > 0 && (
                  <span className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                    <Users className="w-3 h-3" /> {cat.providers_count} prestataire{cat.providers_count > 1 ? 's' : ''}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
