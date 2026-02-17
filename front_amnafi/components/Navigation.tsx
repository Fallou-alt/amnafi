'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut, Settings } from 'lucide-react';

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Vérifier si c'est un prestataire
      fetch('http://localhost:8000/api/provider/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
      .then(response => {
        if (response.ok) {
          setIsProvider(true);
        }
      })
      .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/1logoamnafi.png"
              alt="AMNAFI"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-blue-600">AMNAFI</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="/prestataires" className="text-gray-700 hover:text-blue-600 transition-colors">
              Prestataires
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Bonjour, {user.name}</span>
                {isProvider && (
                  <Link href="/provider/profile" className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <Settings className="w-4 h-4" />
                    <span>Mon Profil</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/prestataire" className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                  Devenir Prestataire
                </Link>
                <Link href="/connexion" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Connexion Prestataire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}