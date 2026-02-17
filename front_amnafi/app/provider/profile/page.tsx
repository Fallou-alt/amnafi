'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit, MessageCircle, Star, MapPin, Phone, Crown, Calendar, Upload, X, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  id: number;
  sender_name: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Provider {
  id: number;
  business_name: string;
  description: string;
  phone: string;
  city: string;
  rating: string;
  reviews_count: number;
  is_premium: boolean;
  profile_photo_url: string;
  cover_photo_url: string;
  subscription_expires_at: string;
  category: {
    name: string;
    icon: string;
  };
}

export default function ProviderProfile() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const coverPhotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/connexion';
      return;
    }
    fetchProviderData();
    fetchMessages();
  }, []);

  const fetchProviderData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/provider/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProvider(data.data);
      } else {
        window.location.href = '/connexion';
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessages([
      { id: 1, sender_name: 'Client Test', message: 'Bonjour, je souhaite un devis', created_at: '2024-01-15', is_read: false }
    ]);
  };

  const updatePhoto = async (type: 'profile' | 'cover', file: File) => {
    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append(type === 'profile' ? 'profile_photo' : 'cover_photo', file);

      const response = await fetch(`http://localhost:8000/api/provider/update-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        fetchProviderData();
        alert('Photo mise à jour avec succès !');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handlePhotoChange = (type: 'profile' | 'cover', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      updatePhoto(type, file);
    }
  };

  const getDaysRemaining = () => {
    if (!provider?.subscription_expires_at) return 0;
    const expiryDate = new Date(provider.subscription_expires_at);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <Link href="/connexion" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Photo de couverture */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-orange-500">
        {provider.cover_photo_url && (
          <Image
            src={provider.cover_photo_url}
            alt="Couverture"
            fill
            className="object-cover"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-black/30"></div>
        <button
          onClick={() => coverPhotoRef.current?.click()}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30"
        >
          <Camera className="w-5 h-5" />
        </button>
        <input
          ref={coverPhotoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handlePhotoChange('cover', e)}
        />
      </div>

      {/* Profil header */}
      <div className="relative -mt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Photo de profil */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {provider.profile_photo_url ? (
                    <Image
                      src={provider.profile_photo_url}
                      alt={provider.business_name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-2xl">
                        {provider.business_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => profilePhotoRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={profilePhotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoChange('profile', e)}
                />
              </div>

              {/* Informations */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{provider.business_name}</h1>
                  {provider.is_premium && (
                    <div className="bg-orange-500 text-white px-2 py-1 rounded-full flex items-center space-x-1">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-medium">Premium</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">{provider.category?.icon}</span>
                    <span>{provider.category?.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{provider.city}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{parseFloat(provider.rating).toFixed(1)} ({provider.reviews_count})</span>
                  </div>
                </div>
                
                {/* Statut abonnement */}
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    provider.is_premium 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {provider.is_premium ? 'Premium' : 'Gratuit'}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{getDaysRemaining()} jours restants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Profil
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 font-medium relative ${
                activeTab === 'messages'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Messages
              {messages.filter(m => !m.is_read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {messages.filter(m => !m.is_read).length}
                </span>
              )}
            </button>
          </div>

          {/* Contenu des tabs */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600">{provider.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{provider.phone}</span>
                  </div>
                </div>

                {getDaysRemaining() <= 7 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-orange-800">Renouvellement requis</h4>
                    </div>
                    <p className="text-orange-700 mt-1">
                      Votre abonnement expire dans {getDaysRemaining()} jours.
                    </p>
                    <button className="mt-3 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                      Renouveler (Wave à venir)
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Messages clients</h3>

                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucun message reçu</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg border ${
                          message.is_read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{message.sender_name}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(message.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{message.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}