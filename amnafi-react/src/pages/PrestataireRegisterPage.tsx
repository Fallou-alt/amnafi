import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MapPin, Phone, Briefcase, Crown, CheckCircle, Upload, X } from 'lucide-react';
import api from '../lib/api';

const VILLES_SENEGAL = [
  'Dakar', 'Thiès', 'Kaolack', 'Ziguinchor', 'Saint-Louis', 'Tambacounda',
  'Mbour', 'Diourbel', 'Louga', 'Kolda', 'Fatick', 'Kédougou',
  'Matam', 'Sédhiou', 'Kaffrine', 'Rufisque', 'Pikine', 'Guédiawaye'
];

export default function InscriptionPrestataire() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    business_name: '',
    category_id: '',
    ville: '',
    quartier: '',
    photo: null as File | null,
    statut: 'gratuit'
  });
  
  const [categories, setCategories] = useState<any[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/public/categories-for-registration');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('La photo ne doit pas dépasser 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }
      
      setFormData({...formData, photo: file});
      
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
    
    if (!formData.photo) {
      alert('La photo de profil est obligatoire');
      return;
    }
    
    if (!formData.category_id) {
      alert('Veuillez sélectionner une catégorie');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
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
      
      const response = await api.post('/provider/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        if (response.data.data.requires_payment) {
          const paymentResponse = await api.post('/premium/initiate', {
            provider_id: response.data.data.provider.id,
            duration_months: 1,
            subscription_type: 'premium'
          });
          
          if (paymentResponse.data.success && paymentResponse.data.payment_url) {
            window.location.href = paymentResponse.data.payment_url;
          } else {
            alert('Erreur lors de l\'initialisation du paiement');
          }
        } else {
          alert('Inscription réussie !\n\nVous pouvez maintenant vous connecter.');
          navigate('/provider/login');
        }
      }
    } catch (error: any) {
      let errorMessage = 'Erreur inconnue';
      
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert('Erreur lors de l\'inscription: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <nav className="bg-white/90 backdrop-blur-md shadow-xl border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/images/1logoamnafi.png"
                alt="AMNAFI"
                className="w-10 h-10 transform group-hover:scale-110 transition-transform"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">AMNAFI</span>
            </Link>
            <Link to="/" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-100"
        >
          <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 px-6 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative">
              <h1 className="text-3xl font-bold text-white mb-1">Devenir Prestataire</h1>
              <p className="text-orange-50">Rejoignez notre réseau de professionnels au Sénégal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="text-center bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-2xl">
              <div className="relative inline-block">
                {photoPreview ? (
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-3 border-4 border-orange-300 shadow-xl ring-4 ring-orange-100">
                      <img
                        src={photoPreview}
                        alt="Aperçu photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-dashed border-orange-300 hover:border-orange-500 transition-all cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
                       onClick={() => fileInputRef.current?.click()}>
                    <div className="text-center">
                      <Camera className="w-10 h-10 text-orange-500 mx-auto mb-1" />
                      <Upload className="w-5 h-5 text-orange-400 mx-auto" />
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
              <p className="text-sm font-semibold text-gray-700 mb-1">
                <span className="text-red-500">*</span> Photo de profil obligatoire
              </p>
              <p className="text-xs text-gray-600">
                Formats acceptés: JPG, PNG, GIF, WEBP (max 10MB)
              </p>
            </div>

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
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-xl ${
                isSubmitting || !formData.photo
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 hover:shadow-2xl hover:scale-105'
              } text-white`}
            >
              {isSubmitting ? 'Inscription en cours...' : '🚀 Créer mon profil prestataire'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
