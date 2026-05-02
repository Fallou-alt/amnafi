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
        <Link to="/" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-bold text-gray-900">Services</h1>
          <p className="text-xs text-gray-400">Trouvez un prestataire par métier</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
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
                className="bg-white rounded-xl border border-gray-100 hover:border-orange-300 hover:shadow-sm transition p-4 flex flex-col items-center text-center gap-2 group"
              >
                <span className="text-3xl">{cat.icon}</span>
                <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition leading-tight">
                  {cat.name}
                </p>
                {cat.providers_count > 0 && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="w-3 h-3" /> {cat.providers_count}
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
