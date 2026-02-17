'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  subcategories?: Subcategory[];
}

export default function CategorySubcategories() {
  const params = useParams();
  const categoryId = params.id as string;
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch(`http://localhost:8000/api/public/categories`);
        const categoryData = await categoryResponse.json();
        
        if (categoryData.success) {
          const foundCategory = categoryData.data.find((cat: Category) => cat.id.toString() === categoryId);
          setCategory(foundCategory);
          
          if (foundCategory && foundCategory.subcategories) {
            setSubcategories(foundCategory.subcategories);
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/categories" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            {category && (
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  {category.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                  <p className="text-gray-600">{subcategories.length} sous-catégories</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((subcategory) => (
            <div key={subcategory.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{subcategory.name}</h3>
              <p className="text-gray-600 text-sm">{subcategory.description}</p>
              <div className="mt-4 flex items-center text-sm text-blue-600">
                <Users className="w-4 h-4 mr-2" />
                <span>Voir les services</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}