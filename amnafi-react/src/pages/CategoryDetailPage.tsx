import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CategoryDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link to="/categories" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux catégories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Catégorie #{id}</h1>
        <p className="text-gray-600 mt-2">Page de détail de catégorie</p>
      </div>
    </div>
  );
}
