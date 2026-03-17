import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ServiceSubcategoryPage() {
  const { category, subcategory } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link to="/services" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux services
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {category} / {subcategory}
        </h1>
        <p className="text-gray-600 mt-2">Page de sous-catégorie de service</p>
      </div>
    </div>
  );
}
