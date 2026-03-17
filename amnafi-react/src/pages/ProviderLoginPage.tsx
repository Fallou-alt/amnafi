import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, LogIn } from 'lucide-react';
import api from '../lib/api';

export default function ProviderLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        phone: formData.phone,
        password: formData.password
      });

      if (response.data.success) {
        // Stocker le token
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('provider', JSON.stringify(response.data.data.provider));

        alert('Connexion réussie !');
        navigate('/provider/profile');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion Prestataire</h1>
          <p className="text-gray-600">Accédez à votre espace prestataire</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-1" />
              Numéro de téléphone
            </label>
            <input
              type="tel"
              required
              placeholder="Ex: 771234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Le numéro utilisé lors de votre inscription
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-1" />
              Mot de passe
            </label>
            <input
              type="password"
              required
              placeholder="Votre numéro de téléphone"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Par défaut: votre numéro de téléphone
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              'Connexion...'
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Pas encore inscrit ?{' '}
            <Link to="/prestataire" className="text-orange-600 hover:text-orange-700 font-semibold">
              Devenir prestataire
            </Link>
          </p>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Astuce: Votre mot de passe par défaut est votre numéro de téléphone.
              <br />
              Vous pourrez le changer après connexion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
