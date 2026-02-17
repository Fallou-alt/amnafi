'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Provider {
  id: number;
  business_name: string;
  phone: string;
  is_active: boolean;
  is_premium: boolean;
  is_hidden: boolean;
  is_locked: boolean;
  locked_until?: string;
  status_reason?: string;
  created_at: string;
  profile_photo?: string;
  user: {
    name: string;
    email: string;
  };
  category: {
    name: string;
  };
}

export default function AdminProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [lockModal, setLockModal] = useState<{open: boolean, providerId: number | null, isLocked: boolean}>({open: false, providerId: null, isLocked: false});
  const [lockForm, setLockForm] = useState({duration: 7, reason: ''});

  useEffect(() => {
    fetchProviders();
  }, [search, statusFilter, typeFilter]);

  const fetchProviders = async () => {
    try {
      let url = 'http://localhost:8000/api/debug/providers';
      
      if (search && search.trim()) {
        url = `http://localhost:8000/api/debug/admin/providers/search?q=${encodeURIComponent(search.trim())}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProviders(data.data.map((p: any) => ({
            id: p.id,
            business_name: p.business_name,
            phone: p.phone,
            is_active: p.is_active,
            is_premium: p.is_premium,
            is_hidden: p.is_hidden,
            is_locked: p.is_locked,
            created_at: p.created_at,
            user: { name: p.user_name, email: '' },
            category: { name: p.category_name }
          })));
        }
      } else {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          let filteredProviders = data.data.providers;
          
          if (statusFilter === 'active') {
            filteredProviders = filteredProviders.filter((p: any) => p.is_active);
          } else if (statusFilter === 'inactive') {
            filteredProviders = filteredProviders.filter((p: any) => !p.is_active);
          }
          
          if (typeFilter === 'premium') {
            filteredProviders = filteredProviders.filter((p: any) => p.is_premium);
          } else if (typeFilter === 'free') {
            filteredProviders = filteredProviders.filter((p: any) => !p.is_premium);
          }
          
          setProviders(filteredProviders.map((p: any) => ({
            id: p.id,
            business_name: p.business_name,
            phone: p.phone,
            is_active: p.is_active,
            is_premium: p.is_premium,
            is_hidden: p.is_hidden,
            is_locked: p.is_locked,
            created_at: p.created_at,
            user: { name: p.user_name, email: '' },
            category: { name: p.category_name }
          })));
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number) => {
    console.log('🔄 Toggle status pour ID:', id);
    try {
      const url = `http://localhost:8000/api/debug/admin/providers/${id}/toggle-status`;
      console.log('📡 URL:', url);
      
      const response = await fetch(url, {
        method: 'PATCH'
      });

      console.log('📊 Response status:', response.status);
      const data = await response.json();
      console.log('📋 Data:', data);

      if (response.ok) {
        setProviders(prev => prev.map(p => 
          p.id === id ? { ...p, is_active: data.data.is_active } : p
        ));
        showNotification('success', data.message);
      } else {
        showNotification('error', 'Erreur: ' + (data.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur complète:', error);
      showNotification('error', 'Erreur lors de la modification');
    }
  };

  const togglePremium = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/debug/admin/providers/${id}/toggle-premium`, {
        method: 'PATCH'
      });

      if (response.ok) {
        const data = await response.json();
        setProviders(prev => prev.map(p => 
          p.id === id ? { ...p, is_premium: data.data.is_premium } : p
        ));
        showNotification('success', data.message);
      }
    } catch (error) {
      showNotification('error', 'Erreur lors de la modification');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const hideProvider = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/debug/admin/providers/${id}/hide`, {
        method: 'PATCH'
      });

      if (response.ok) {
        const data = await response.json();
        setProviders(prev => prev.map(p => 
          p.id === id ? { ...p, is_hidden: data.data.is_hidden } : p
        ));
        showNotification('success', data.message);
      }
    } catch (error) {
      showNotification('error', 'Erreur lors de la modification');
    }
  };

  const openLockModal = (id: number, isLocked: boolean) => {
    setLockModal({open: true, providerId: id, isLocked});
    setLockForm({duration: 7, reason: ''});
  };

  const lockProvider = async () => {
    if (!lockModal.providerId) return;
    
    try {
      const url = lockModal.isLocked 
        ? `http://localhost:8000/api/debug/admin/providers/${lockModal.providerId}/unlock`
        : `http://localhost:8000/api/debug/admin/providers/${lockModal.providerId}/lock`;
        
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: lockModal.isLocked ? null : JSON.stringify(lockForm)
      });

      if (response.ok) {
        const data = await response.json();
        setProviders(prev => prev.map(p => 
          p.id === lockModal.providerId ? { ...p, is_locked: data.data.is_locked } : p
        ));
        showNotification('success', data.message);
        setLockModal({open: false, providerId: null, isLocked: false});
      }
    } catch (error) {
      showNotification('error', 'Erreur lors de la modification');
    }
  };

  const deleteProvider = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce prestataire ?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/debug/admin/providers/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const data = await response.json();
        setProviders(prev => prev.filter(p => p.id !== id));
        showNotification('success', data.message);
      }
    } catch (error) {
      showNotification('error', 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Prestataires</h1>
        <div className="bg-white rounded-lg shadow animate-pulse">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Prestataires</h1>
        <div className="text-sm text-gray-600">
          {providers.length} prestataire(s)
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Rechercher (nom, numéro)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="premium">Premium</option>
            <option value="free">Gratuit</option>
          </select>
          
          <button
            onClick={fetchProviders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prestataire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modération
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {provider.business_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {provider.category.name}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {provider.phone}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(provider.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        provider.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors cursor-pointer`}
                    >
                      {provider.is_active ? '✅ Actif' : '❌ Inactif'}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePremium(provider.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        provider.is_premium
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } transition-colors cursor-pointer`}
                    >
                      {provider.is_premium ? '⭐ Premium' : '🆓 Gratuit'}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
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
                      {!provider.is_hidden && !provider.is_locked && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✅ Normal
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => hideProvider(provider.id)}
                        className={`px-2 py-1 rounded text-xs ${
                          provider.is_hidden 
                            ? 'text-green-600 hover:text-green-900' 
                            : 'text-yellow-600 hover:text-yellow-900'
                        }`}
                        title={provider.is_hidden ? 'Afficher' : 'Masquer'}
                      >
                        {provider.is_hidden ? '👁️' : '🙈'}
                      </button>
                      
                      <button
                        onClick={() => openLockModal(provider.id, provider.is_locked)}
                        className={`px-2 py-1 rounded text-xs ${
                          provider.is_locked 
                            ? 'text-green-600 hover:text-green-900' 
                            : 'text-red-600 hover:text-red-900'
                        }`}
                        title={provider.is_locked ? 'Déverrouiller' : 'Verrouiller'}
                      >
                        {provider.is_locked ? '🔓' : '🔒'}
                      </button>
                      
                      <button
                        onClick={() => deleteProvider(provider.id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded text-xs"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {lockModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              {lockModal.isLocked ? 'Déverrouiller le prestataire' : 'Verrouiller le prestataire'}
            </h3>
            
            {!lockModal.isLocked && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée (jours)
                  </label>
                  <select
                    value={lockForm.duration}
                    onChange={(e) => setLockForm({...lockForm, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={1}>1 jour</option>
                    <option value={7}>7 jours</option>
                    <option value={30}>30 jours</option>
                    <option value={90}>90 jours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raison
                  </label>
                  <textarea
                    value={lockForm.reason}
                    onChange={(e) => setLockForm({...lockForm, reason: e.target.value})}
                    placeholder="Motif du verrouillage..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setLockModal({open: false, providerId: null, isLocked: false})}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={lockProvider}
                className={`px-4 py-2 rounded-lg text-white ${
                  lockModal.isLocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {lockModal.isLocked ? 'Déverrouiller' : 'Verrouiller'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
