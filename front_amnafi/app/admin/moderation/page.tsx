'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Provider {
  id: number;
  business_name: string;
  is_active: boolean;
  is_hidden: boolean;
  is_locked: boolean;
  locked_until?: string;
  status_reason?: string;
  admin_notes?: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminModeration() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchPhone, setSearchPhone] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    fetchProviders();
  }, [filter]);

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:8000/api/debug/providers';
      
      if (searchPhone.trim()) {
        url = `http://localhost:8000/api/debug/admin/providers/search?q=${encodeURIComponent(searchPhone.trim())}`;
      }
      
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        let filteredProviders = searchPhone.trim() ? data.data : data.data.providers;
        
        // Si recherche par téléphone et aucun résultat
        if (searchPhone.trim() && filteredProviders.length === 0) {
          showNotification('error', `Aucun prestataire trouvé avec le téléphone ${searchPhone}`);
          setProviders([]);
          return;
        }

        if (filter === 'hidden') {
          filteredProviders = filteredProviders.filter((p: any) => p.is_hidden);
        } else if (filter === 'locked') {
          filteredProviders = filteredProviders.filter((p: any) => p.is_locked);
        } else if (filter === 'issues') {
          filteredProviders = filteredProviders.filter((p: any) => p.is_hidden || p.is_locked || !p.is_active);
        }

        setProviders(filteredProviders.map((p: any) => ({
          id: p.id,
          business_name: p.business_name,
          is_active: p.is_active,
          is_hidden: p.is_hidden || false,
          is_locked: p.is_locked || false,
          locked_until: p.locked_until,
          status_reason: p.status_reason,
          admin_notes: p.admin_notes,
          user: {
            name: p.user_name || 'Inconnu',
            email: p.user?.email || '',
            phone: p.phone || p.user_phone || ''
          }
        })));
      }
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('error', 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const quickAction = async (id: number, action: string) => {
    try {
      let url = '';
      let method = 'PATCH';
      let body = null;

      switch (action) {
        case 'unhide':
        case 'hide':
          url = `http://localhost:8000/api/debug/admin/providers/${id}/hide`;
          break;
        case 'unlock':
          url = `http://localhost:8000/api/debug/admin/providers/${id}/unlock`;
          break;
        case 'activate':
          url = `http://localhost:8000/api/debug/admin/providers/${id}/toggle-status`;
          break;
        case 'lock':
          url = `http://localhost:8000/api/debug/admin/providers/${id}/lock`;
          body = JSON.stringify({ duration: 7, reason: 'Verrouillage rapide depuis modération' });
          break;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body
      });

      if (response.ok) {
        const result = await response.json();
        showNotification('success', result.message);
        fetchProviders();
      } else {
        showNotification('error', 'Erreur lors de l\'action');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('error', 'Erreur de connexion');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Modération</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">🛡️ Modération</h1>
        <div className="text-sm text-gray-600">
          {providers.length} élément(s) à modérer
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Recherche par ID */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher par numéro de téléphone
            </label>
            <div className="flex space-x-2">
              <input
                type="tel"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Ex: +221 77 123 45 67"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={fetchProviders}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔍 Rechercher
              </button>
              <button
                onClick={() => { setSearchPhone(''); fetchProviders(); }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                ❌ Effacer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres rapides */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('issues')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'issues' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🚨 Problèmes
          </button>
          <button
            onClick={() => setFilter('hidden')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'hidden' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🙈 Masqués
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'locked' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔒 Verrouillés
          </button>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-2">👁️</div>
          <h3 className="font-semibold text-gray-900">Masquer/Afficher</h3>
          <p className="text-sm text-gray-600 mt-1">Contrôler la visibilité</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="font-semibold text-gray-900">Verrouiller</h3>
          <p className="text-sm text-gray-600 mt-1">Bloquer temporairement</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-semibold text-gray-900">Notes Admin</h3>
          <p className="text-sm text-gray-600 mt-1">Ajouter des commentaires</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-2">🗑️</div>
          <h3 className="font-semibold text-gray-900">Supprimer</h3>
          <p className="text-sm text-gray-600 mt-1">Suppression définitive</p>
        </div>
      </div>

      {/* Liste des prestataires */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Prestataires nécessitant une attention
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {providers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">✅</div>
              <p>Aucun élément à modérer pour le moment</p>
            </div>
          ) : (
            providers.map((provider) => (
              <div key={provider.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {provider.business_name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {provider.business_name}
                      </h3>
                      <p className="text-sm text-gray-500">{provider.user.email}</p>
                      <p className="text-sm text-blue-600 font-medium">📞 {provider.user.phone || 'Téléphone non renseigné'}</p>
                      
                      <div className="flex space-x-2 mt-2">
                        {!provider.is_active && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ❌ Inactif
                          </span>
                        )}
                        {provider.is_hidden && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            🙈 Masqué
                          </span>
                        )}
                        {provider.is_locked && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            🔒 Verrouillé
                          </span>
                        )}
                      </div>
                      
                      {provider.status_reason && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Raison:</strong> {provider.status_reason}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!provider.is_active && (
                      <button
                        onClick={() => quickAction(provider.id, 'activate')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        ✅ Activer
                      </button>
                    )}
                    
                    {provider.is_hidden ? (
                      <button
                        onClick={() => quickAction(provider.id, 'unhide')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        👁️ Afficher
                      </button>
                    ) : (
                      <button
                        onClick={() => quickAction(provider.id, 'hide')}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                      >
                        🙈 Masquer
                      </button>
                    )}
                    
                    {provider.is_locked ? (
                      <button
                        onClick={() => quickAction(provider.id, 'unlock')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        🔓 Déverrouiller
                      </button>
                    ) : (
                      <button
                        onClick={() => quickAction(provider.id, 'lock')}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        🔒 Verrouiller
                      </button>
                    )}
                    
                    <Link
                      href={`/admin/prestataires/${provider.id}`}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      👁️ Détails
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}