'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Star, Crown, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  providers_count: number;
}

interface Provider {
  id: number;
  business_name: string;
  rating: string;
  reviews_count: number;
  is_premium: boolean;
  city: string;
  profile_photo: string;
  whatsapp_url: string;
  user: {
    name: string;
  };
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/public/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 hover:from-blue-200 hover:to-blue-300',
      pink: 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-300 hover:from-pink-200 hover:to-pink-300',
      red: 'bg-gradient-to-br from-red-100 to-red-200 border-red-300 hover:from-red-200 hover:to-red-300',
      purple: 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 hover:from-purple-200 hover:to-purple-300',
      green: 'bg-gradient-to-br from-green-100 to-green-200 border-green-300 hover:from-green-200 hover:to-green-300',
      orange: 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 hover:from-orange-200 hover:to-orange-300',
      indigo: 'bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-300 hover:from-indigo-200 hover:to-indigo-300',
      yellow: 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 hover:from-yellow-200 hover:to-yellow-300',
      teal: 'bg-gradient-to-br from-teal-100 to-teal-200 border-teal-300 hover:from-teal-200 hover:to-teal-300',
      gray: 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 hover:from-gray-200 hover:to-gray-300'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/" className="flex items-center text-orange-600 hover:text-orange-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services par catégorie</h1>
              <p className="text-gray-600">Découvrez nos prestataires organisés par métier</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => window.location.href = `/categories?category=${category.id}`}
              className={`rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border-2 p-6 ${getColorClasses(category.color)}`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{category.providers_count}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}