'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Provider {
  id: number;
  business_name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  is_active: boolean;
  is_premium: boolean;
  is_verified: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  profile_photo?: string;
  user: {
    name: string;
    email: string;
  };
  category: {
    name: string;
  };
  services: any[];
  reviews: any[];
}

export default function AdminProviderDetail() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (params.id) {
      fetchProvider();
    }
  }, [params.id]);

  const fetchProvider = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8001/api/admin/providers/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProvider(data.data);
        setFormData(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProvider = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8001/api/admin/providers/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setProvider(data.data);
        setEditing(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Prestataire non trouvé</p>
        <Link href="/admin/prestataires" className="text-blue-600 hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/prestataires"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Retour
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {provider.business_name}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          {editing ? (
            <>
              <button
                onClick={updateProvider}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                💾 Sauvegarder
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                ❌ Annuler
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ✏️ Modifier
            </button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <p className={`font-semibold ${provider.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {provider.is_active ? 'Actif' : 'Inactif'}
              </p>
            </div>
            <span className="text-2xl">
              {provider.is_active ? '✅' : '❌'}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className={`font-semibold ${provider.is_premium ? 'text-yellow-600' : 'text-gray-600'}`}>
                {provider.is_premium ? 'Premium' : 'Gratuit'}
              </p>
            </div>
            <span className="text-2xl">
              {provider.is_premium ? '⭐' : '🆓'}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Note</p>
              <p className="font-semibold text-gray-900">
                {provider.rating}/5 ({provider.reviews_count} avis)
              </p>
            </div>
            <span className="text-2xl">⭐</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Services</p>
              <p className="font-semibold text-gray-900">
                {provider.services.length}
              </p>
            </div>
            <span className="text-2xl">🛠️</span>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'entreprise
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.business_name || ''}
                  onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{provider.business_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {editing ? (
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{provider.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{provider.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <p className="text-gray-900">{provider.category.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{provider.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{provider.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.postal_code || ''}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{provider.postal_code}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'inscription
              </label>
              <p className="text-gray-900">
                {new Date(provider.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          {editing ? (
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{provider.description || 'Aucune description'}</p>
          )}
        </div>
      </div>

      {/* Services */}
      {provider.services.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Services ({provider.services.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {provider.services.map((service: any) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{service.price}€</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}