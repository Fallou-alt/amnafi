'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Phone, Briefcase, Crown, CheckCircle, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const VILLES_SENEGAL = [
  'Dakar', 'Thiès', 'Kaolack', 'Ziguinchor', 'Saint-Louis', 'Tambacounda',
  'Mbour', 'Diourbel', 'Louga', 'Kolda', 'Fatick', 'Kédougou',
  'Matam', 'Sédhiou', 'Kaffrine', 'Rufisque', 'Pikine', 'Guédiawaye'
];

const METIERS = [
  // Mode & Textile
  { name: 'Tailleur', category: 1 },
  { name: 'Couturier', category: 1 },
  { name: 'Styliste', category: 1 },
  { name: 'Créateur de vêtements', category: 1 },
  { name: 'Vente de tissus', category: 1 },
  { name: 'Accessoires', category: 1 },
  { name: 'Chaussures', category: 1 },
  { name: 'Maroquinerie', category: 1 },
  
  // Alimentation & Traiteur
  { name: 'Traiteur', category: 2 },
  { name: 'Pâtisserie', category: 2 },
  { name: 'Boulangerie', category: 2 },
  { name: 'Restaurant', category: 2 },
  { name: 'Food truck', category: 2 },
  { name: 'Confiserie', category: 2 },
  { name: 'Produits frais', category: 2 },
  
  // Maison & Décoration
  { name: 'Menuiserie', category: 3 },
  { name: 'Décoration intérieur', category: 3 },
  { name: 'Fabrication meubles', category: 3 },
  { name: 'Réparateur électroménager', category: 3 },
  
  // Bâtiment & Construction
  { name: 'Plombier', category: 4 },
  { name: 'Électricien', category: 4 },
  { name: 'Maçon', category: 4 },
  { name: 'Menuisier', category: 4 },
  { name: 'Peintre', category: 4 },
  { name: 'Carreleur', category: 4 },
  { name: 'Climatisation', category: 4 },
  
  // Technologies & Digital
  { name: 'Développeur web', category: 5 },
  { name: 'Graphiste', category: 5 },
  { name: 'Community manager', category: 5 },
  { name: 'Photographie', category: 5 },
  { name: 'Support informatique', category: 5 },
  
  // Beauté & Bien-être
  { name: 'Coiffure', category: 6 },
  { name: 'Coiffeur', category: 6 },
  { name: 'Salon de coiffure', category: 6 },
  { name: 'Esthétique', category: 6 },
  { name: 'Barbier', category: 6 },
  { name: 'Maquillage', category: 6 },
  { name: 'Spa & massage', category: 6 },
  { name: 'Manucure', category: 6 },
  { name: 'Pédicure', category: 6 },
  
  // Transport & Logistique
  { name: 'Chauffeur', category: 7 },
  { name: 'Livraison', category: 7 },
  { name: 'Transport marchandises', category: 7 },
  
  // Éducation & Formation
  { name: 'Cours particuliers', category: 8 },
  { name: 'Coaching', category: 8 },
  { name: 'Formation professionnelle', category: 8 },
  { name: 'Soutien scolaire', category: 8 },
  
  // Services & Réparation
  { name: 'Réparation smartphone', category: 9 },
  { name: 'Couture/retouches', category: 9 },
  { name: 'Serrurier', category: 9 },
  { name: 'Nettoyage', category: 9 },
  { name: 'Jardinage', category: 9 },
  
  // Événements & Animation
  { name: 'DJ', category: 10 },
  { name: 'Animateur', category: 10 },
  { name: 'Location matériel', category: 10 },
  { name: 'Photographe événement', category: 10 },
  
  // Services Administratifs
  { name: 'Assistance administrative', category: 11 },
  { name: 'Comptabilité', category: 11 },
  { name: 'Conseils juridiques', category: 11 },
  { name: 'Immobilier', category: 11 },
  
  // Agriculture & Produits Locales
  { name: 'Produits agricoles', category: 12 },
  { name: 'Artisanat local', category: 12 },
  { name: 'Horticulture', category: 12 },
  { name: 'Apiculture', category: 12 },
  
  // Animaux & Services
  { name: 'Toilettage animaux', category: 13 },
  { name: 'Accessoires animaux', category: 13 },
  { name: 'Garde animaux', category: 13 },
  
  // Santé & Services médicaux
  { name: 'Soins à domicile', category: 14 },
  { name: 'Coach sportif', category: 14 },
  { name: 'Nutritionniste', category: 14 },
  
  // Services Divers
  { name: 'Micro-entrepreneur', category: 15 },
  { name: 'Objets recyclés', category: 15 },
  { name: 'Petites réparations', category: 15 },
  { name: 'Sécurité', category: 15 }
];

export default function InscriptionPrestataire() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    business_name: '',
    category_id: '',
    ville: '',
    quartier: '',
    photo: null,
    statut: 'gratuit'
  });
  
  const [categories, setCategories] = useState([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/public/categories-for-registration');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('La photo ne doit pas dépasser 10MB');
        return;
      }
      
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }
      
      setFormData({...formData, photo: file});
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({...formData, photo: null});
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Début de soumission du formulaire');
    console.log('📋 Données du formulaire:', formData);
    
    // Validation photo obligatoire
    if (!formData.photo) {
      alert('La photo de profil est obligatoire');
      return;
    }
    
    // Validation catégorie obligatoire
    if (!formData.category_id) {
      alert('Veuillez sélectionner une catégorie');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Test de connexion d'abord
      console.log('🔍 Test de connexion API...');
      const healthCheck = await fetch('http://localhost:8000/api/health');
      if (!healthCheck.ok) {
        throw new Error('API non accessible');
      }
      console.log('✅ API accessible');
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('first_name', formData.prenom.trim());
      formDataToSend.append('last_name', formData.nom.trim());
      formDataToSend.append('phone', formData.telephone.trim());
      formDataToSend.append('business_name', formData.business_name.trim());
      formDataToSend.append('profession', formData.business_name.trim());
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('city', formData.ville);
      formDataToSend.append('profile_photo', formData.photo);
      formDataToSend.append('subscription_type', formData.statut === 'premium' ? 'premium' : 'free');
      
      if (formData.quartier && formData.quartier.trim()) {
        formDataToSend.append('description', `Prestataire basé à ${formData.quartier.trim()}, ${formData.ville}`);
      }
      
      console.log('📤 Envoi des données:', {
        first_name: formData.prenom,
        last_name: formData.nom,
        profession: formData.business_name,
        subscription_type: formData.statut === 'premium' ? 'premium' : 'free',
        phone: formData.telephone,
        city: formData.ville,
        category_id: formData.category_id,
        photo_size: formData.photo.size,
        photo_type: formData.photo.type
      });
      
      const response = await fetch('http://localhost:8000/api/provider/register', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('📊 Réponse HTTP:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const result = await response.json();
      console.log('📋 Données de réponse:', result);
      
      if (response.ok && result.success) {
        // Si paiement requis (premium)
        if (result.data.requires_payment) {
          console.log('💳 Paiement requis, initiation...');
          
          // Initier le paiement
          const paymentResponse = await fetch('http://localhost:8000/api/premium/initiate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              provider_id: result.data.provider.id,
              duration_months: 1,
              subscription_type: 'premium'
            })
          });
          
          const paymentResult = await paymentResponse.json();
          console.log('💳 Résultat paiement:', paymentResult);
          
          if (paymentResult.success && paymentResult.payment_url) {
            alert('Redirection vers le paiement...');
            window.location.href = paymentResult.payment_url;
          } else {
            alert('Erreur lors de l\'initialisation du paiement');
          }
        } else {
          // Gratuit - afficher les identifiants
          alert(`Inscription réussie !\n\nVos identifiants de connexion:\n📞 Téléphone: ${formData.telephone}\n🔑 Mot de passe: ${formData.telephone}\n\nVous pouvez maintenant vous connecter sur /provider/login`);
          window.location.href = '/provider/login';
        }
      } else {
        let errorMessage = 'Erreur inconnue';
        
        if (result.errors) {
          // Erreurs de validation Laravel
          errorMessage = Object.values(result.errors).flat().join(', ');
        } else if (result.message) {
          errorMessage = result.message;
        } else if (!response.ok) {
          errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`;
        }
        
        console.error('❌ Erreur API:', result);
        alert('Erreur lors de l\'inscription: ' + errorMessage);
      }
    } catch (error) {
      console.error('💥 Erreur complète:', error);
      console.error('Stack trace:', error.stack);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('Erreur de connexion: Impossible de joindre le serveur. Vérifiez que l\'API Laravel est démarrée sur http://localhost:8000');
      } else {
        alert('Erreur de connexion: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/1logoamnafi.png"
                alt="AMNAFI"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-orange-600">AMNAFI</span>
            </Link>
            <Link href="/" className="text-gray-600 hover:text-orange-600">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-500 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Devenir Prestataire</h1>
            <p className="text-orange-100 mt-2">Rejoignez notre réseau de professionnels au Sénégal</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Photo de profil obligatoire */}
            <div className="text-center">
              <div className="relative inline-block">
                {photoPreview ? (
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-orange-200">
                      <Image
                        src={photoPreview}
                        alt="Aperçu photo"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-dashed border-gray-300 hover:border-orange-400 transition-colors cursor-pointer"
                       onClick={() => fileInputRef.current?.click()}>
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <Upload className="w-4 h-4 text-gray-400 mx-auto" />
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <span className="text-red-500">*</span> Photo de profil obligatoire
              </p>
              <p className="text-xs text-gray-500">
                Formats acceptés: JPG, PNG, GIF, WEBP (max 10MB)
              </p>
            </div>

            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                Téléphone *
              </label>
              <input
                type="tel"
                required
                placeholder="+221 XX XXX XX XX"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline w-4 h-4 mr-1" />
                Catégorie *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline w-4 h-4 mr-1" />
                Nom du service/métier *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Salon de coiffure, Plomberie, Restaurant..."
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Ville *
              </label>
              <select
                required
                value={formData.ville}
                onChange={(e) => setFormData({...formData, ville: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              >
                <option value="">Sélectionnez votre ville</option>
                {VILLES_SENEGAL.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
              
              {formData.ville && (
                <input
                  type="text"
                  placeholder="Précisez votre quartier (optionnel)"
                  value={formData.quartier}
                  onChange={(e) => setFormData({...formData, quartier: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Choisissez votre statut
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.statut === 'gratuit' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setFormData({...formData, statut: 'gratuit'})}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <h3 className="font-semibold text-gray-900">Gratuit</h3>
                    </div>
                    {formData.statut === 'gratuit' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">30 jours d'essai</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Profil de base</li>
                    <li>• Contact direct</li>
                    <li>• Expiration automatique</li>
                  </ul>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.statut === 'premium' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setFormData({...formData, statut: 'premium'})}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Crown className="w-4 h-4 text-orange-500 mr-2" />
                      <h3 className="font-semibold text-gray-900">Premium</h3>
                    </div>
                    {formData.statut === 'premium' && <CheckCircle className="w-5 h-5 text-orange-500" />}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Badge visible</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Profil mis en avant</li>
                    <li>• Badge premium</li>
                    <li>• Priorité dans les résultats</li>
                  </ul>
                </motion.div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              type="submit"
              disabled={isSubmitting || !formData.photo}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                isSubmitting || !formData.photo
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-red-500 hover:shadow-lg'
              } text-white`}
            >
              {isSubmitting ? 'Inscription en cours...' : 'Créer mon profil prestataire'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}