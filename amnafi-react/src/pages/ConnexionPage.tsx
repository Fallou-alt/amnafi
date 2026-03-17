import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, LogIn, Mail } from 'lucide-react';
import api from '../lib/api';

export default function ConnexionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: ''
  });
  
  const [loginType, setLoginType] = useState<'phone' | 'email'>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const loginData = loginType === 'phone' 
        ? { phone: formData.phone.trim(), password: formData.password }
        : { email: formData.email.trim(), password: formData.password };
        
      const response = await api.post('/auth/login', loginData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.data.user));
        
        if (response.data.data.user_type === 'admin') {
          navigate('/admin/dashboard');
        } else if (response.data.data.user_type === 'provider') {
          localStorage.setItem('provider_data', JSON.stringify(response.data.data.provider));
          navigate('/provider/dashboard');
        }
      } else {
        setError(response.data.message || 'Erreur de connexion');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/images/1logoamnafi.png"
                alt="AMNAFI"
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-orange-600">AMNAFI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/prestataire" className="text-gray-600 hover:text-orange-600">
                Devenir prestataire
              </Link>
              <Link to="/" className="text-gray-600 hover:text-orange-600">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-600 to-red-500 px-8 py-6 text-center">
            <LogIn className="w-12 h-12 text-white mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-white">Connexion</h1>
            <p className="text-orange-100 mt-1">Prestataires & Administrateurs</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLoginType('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'phone'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Phone className="inline w-4 h-4 mr-1" />
                Téléphone
              </button>
              <button
                type="button"
                onClick={() => setLoginType('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'email'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="inline w-4 h-4 mr-1" />
                Email
              </button>
            </div>

            {loginType === 'phone' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+221 XX XXX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Adresse email
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@amnafi.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" />
                Mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-red-500 hover:shadow-lg'
              } text-white`}
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </motion.button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Pas encore inscrit ?{' '}
                <Link to="/prestataire" className="text-orange-600 hover:text-orange-700 font-medium">
                  Devenir prestataire
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
