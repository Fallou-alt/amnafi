'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Menu, Phone, MessageCircle, Star, MapPin, Shield, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedCategory) params.append('category_id', selectedCategory);
    if (selectedCity) params.append('city', selectedCity);
    
    window.location.href = `/prestataires?${params.toString()}`;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
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

            {/* Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
                Services
              </Link>
              <Link href="/prestataires" className="text-gray-700 hover:text-blue-600 transition-colors">
                Prestataires
              </Link>
              <Link href="/prestataires-officiels" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <Shield className="w-4 h-4 mr-1" />
                Officiels
              </Link>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                À propos
              </a>
            </div>

            {/* Boutons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link href="/prestataire" className="hidden sm:block px-3 md:px-4 py-2 text-sm md:text-base text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                Devenir Prestataire
              </Link>
              <Link href="/provider/login" className="hidden sm:block px-3 md:px-4 py-2 text-sm md:text-base bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Connexion
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              <Link 
                href="/services" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/prestataires" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Prestataires
              </Link>
              <Link 
                href="/prestataires-officiels" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Prestataires Officiels
              </Link>
              <a 
                href="#about" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </a>
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link 
                  href="/prestataire" 
                  className="block w-full px-4 py-2 text-center text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Devenir Prestataire
                </Link>
                <Link 
                  href="/provider/login" 
                  className="block w-full px-4 py-2 text-center bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cover bg-center text-gray-800" style={{backgroundImage: 'url(/images/accueil.png)'}}>
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo animé */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="inline-block"
              >
                <Image
                  src="/images/1logoamnafi.png"
                  alt="AMNAFI"
                  width={350}
                  height={350}
                  className="w-64 h-64 md:w-80 md:h-80 mx-auto drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* Slogan animé */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-light text-gray-700">
                La bonne adresse des services
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Trouvez les meilleurs prestataires près de chez vous
              </p>
            </motion.div>

            {/* Barre de recherche */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-2">
                <div className="flex flex-col md:flex-row gap-2">
                  {/* Recherche principale */}
                  <div className="flex-1 flex items-center">
                    <Search className="w-5 h-5 text-gray-400 ml-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un service, un prestataire..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>

                  {/* Filtres */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full sm:w-auto px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous les métiers</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>

                    <select 
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full sm:w-auto px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Toutes les villes</option>
                      <option value="dakar">Dakar</option>
                      <option value="thies">Thiès</option>
                      <option value="kaolack">Kaolack</option>
                      <option value="ziguinchor">Ziguinchor</option>
                      <option value="saint-louis">Saint-Louis</option>
                      <option value="tambacounda">Tambacounda</option>
                      <option value="mbour">Mbour</option>
                      <option value="diourbel">Diourbel</option>
                      <option value="louga">Louga</option>
                      <option value="kolda">Kolda</option>
                    </select>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSearch}
                      className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Rechercher
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Formes décoratives */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-orange-400 rounded-full opacity-10 blur-3xl"></div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir AMNAFI ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La plateforme idéale pour trouver des services de qualité près de chez vous
            </p>
          </div>

          {/* Bande passante animée */}
          <div className="mb-16 overflow-hidden">
            <div className="relative">
              <div className="flex animate-scroll-infinite">
                {/* Première série d'images */}
                <div className="flex space-x-6 px-3">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f1.png" 
                        alt="Collaboration" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Collaboration</h3>
                      <p className="text-gray-600">Des professionnels qui travaillent ensemble pour votre satisfaction</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f2.png" 
                        alt="Innovation" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                      <p className="text-gray-600">Une plateforme moderne pour des services de qualité</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f3.png" 
                        alt="Excellence" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                      <p className="text-gray-600">Des prestataires sélectionnés pour leur expertise</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f4.png" 
                        alt="Confiance" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Confiance</h3>
                      <p className="text-gray-600">Une communauté basée sur la transparence et la qualité</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f1.png" 
                        alt="Engagement" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Engagement</h3>
                      <p className="text-gray-600">Des professionnels dévoués à votre service</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f2.png" 
                        alt="Passion" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Passion</h3>
                      <p className="text-gray-600">L'amour du travail bien fait au quotidien</p>
                    </div>
                  </motion.div>
                </div>

                {/* Duplication pour défilement infini */}
                <div className="flex space-x-6 px-3">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f1.png" 
                        alt="Collaboration" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Collaboration</h3>
                      <p className="text-gray-600">Des professionnels qui travaillent ensemble pour votre satisfaction</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f2.png" 
                        alt="Innovation" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                      <p className="text-gray-600">Une plateforme moderne pour des services de qualité</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f3.png" 
                        alt="Excellence" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                      <p className="text-gray-600">Des prestataires sélectionnés pour leur expertise</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f4.png" 
                        alt="Confiance" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Confiance</h3>
                      <p className="text-gray-600">Une communauté basée sur la transparence et la qualité</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f1.png" 
                        alt="Engagement" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Engagement</h3>
                      <p className="text-gray-600">Des professionnels dévoués à votre service</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-lg"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="/images/f2.png" 
                        alt="Passion" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Passion</h3>
                      <p className="text-gray-600">L'amour du travail bien fait au quotidien</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recherche avancée</h3>
              <p className="text-gray-600">Trouvez exactement ce que vous cherchez avec nos filtres précis</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prestataires vérifiés</h3>
              <p className="text-gray-600">Tous nos professionnels sont sélectionnés et validés</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Avis authentiques</h3>
              <p className="text-gray-600">Lisez les expériences réelles des clients</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact direct</h3>
              <p className="text-gray-600">Appelez ou messagez directement les prestataires</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* À propos Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              À propos d'AMNAFI
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-8 md:p-12 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed text-justify">
                AMNAFI est une plateforme innovante conçue pour connecter les prestataires et les clients au Sénégal. 
                Notre mission est de faciliter l'accès aux services locaux, en offrant une expérience simple, fiable et sécurisée. 
                Que ce soit pour des travaux, des services domestiques, ou du commerce, AMNAFI vise à dynamiser l'économie locale. 
                Nous croyons en l'innovation, en la confiance et en la collaboration, pour construire un futur où chaque service trouve son client. 
                Rejoignez-nous dans cette aventure !
              </p>
              
              <div className="mt-8 flex justify-center">
                <Link href="/prestataire" className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold">
                  Devenir Prestataire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Prestataires</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-orange-600 mb-2">5000+</div>
              <div className="text-gray-600">Services</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Villes</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/1logoamnafi.png"
                  alt="AMNAFI"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold">AMNAFI</span>
              </div>
              <p className="text-gray-400">
                La bonne adresse des services
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Plomberie</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Électricité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Jardinage</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nettoyage</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+221 71 135 60 53</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>amnaficontact@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 AMNAFI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}