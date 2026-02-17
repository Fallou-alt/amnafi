'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default function ProviderRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    business_name: '',
    profession: '',
    category_id: '',
    city: '',
    description: '',
    profile_photo: null,
    subscription_type: 'free'
  });

  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/categories-for-registration`);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, profile_photo: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    console.log('=== handleSubmit appelé ===');
    console.log('formData actuel:', formData);
    
    if (!formData.first_name || !formData.last_name || !formData.profession || !formData.profile_photo) {
      alert('Données manquantes. Retournez à l\'\u00e9tape 1.');
      setStep(1);
      return;
    }
    
    setLoading(true);

    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('phone', formData.phone);
      if (formData.email) data.append('email', formData.email);
      data.append('business_name', formData.business_name);
      data.append('profession', formData.profession);
      data.append('category_id', formData.category_id);
      data.append('city', formData.city);
      if (formData.description) data.append('description', formData.description);
      data.append('profile_photo', formData.profile_photo);
      data.append('subscription_type', formData.subscription_type);

      console.log('=== FormData prêt à envoyer ===');
      for (let pair of data.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      const response = await axios.post(`${API_URL}/provider/register`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Réponse:', response.data);

      if (response.data.success) {
        if (response.data.data.requires_payment) {
          setPaymentData(response.data.data);
          setStep(3);
        } else {
          alert(response.data.message);
          router.push('/provider/dashboard');
        }
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de l\'inscription';
      const errors = error.response?.data?.errors;
      if (errors) {
        const errorList = Object.values(errors).flat().join('\n');
        alert(errorMsg + '\n\n' + errorList);
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/premium/initiate`, {
        provider_id: paymentData.provider.id,
        duration_months: 1,
        subscription_type: formData.subscription_type
      });

      if (response.data.success && response.data.payment_url) {
        window.location.href = response.data.payment_url;
      }
    } catch (error) {
      alert('Erreur lors de l\'initialisation du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Devenir Prestataire AMNAFI</h1>

        {step === 1 && (
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            if (!formData.first_name || !formData.last_name || !formData.phone || 
                !formData.business_name || !formData.profession || !formData.category_id || 
                !formData.city || !formData.profile_photo) {
              alert('Veuillez remplir tous les champs obligatoires');
              return;
            }
            console.log('Formulaire étape 1 validé:', formData);
            setStep(2); 
          }} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Informations Personnelles</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="Prénom *"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="border rounded px-4 py-2"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Nom *"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="border rounded px-4 py-2"
              />
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Téléphone *"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-4 py-2"
            />

            <input
              type="email"
              name="email"
              placeholder="Email (optionnel)"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded px-4 py-2"
            />

            <input
              type="text"
              name="business_name"
              placeholder="Nom de l'entreprise *"
              value={formData.business_name}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-4 py-2"
            />

            <input
              type="text"
              name="profession"
              placeholder="Métier/Profession *"
              value={formData.profession}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-4 py-2"
            />

            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-4 py-2"
            >
              <option value="">Sélectionner une catégorie *</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input
              type="text"
              name="city"
              placeholder="Ville *"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-4 py-2"
            />

            <textarea
              name="description"
              placeholder="Description de vos services"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border rounded px-4 py-2"
            />

            <div>
              <label className="block mb-2 font-medium">Photo de profil *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Suivant
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Choisissez votre abonnement</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setFormData(prev => ({ ...prev, subscription_type: 'free' }))}
                className={`border-2 rounded-lg p-6 cursor-pointer ${
                  formData.subscription_type === 'free' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <h3 className="text-lg font-bold mb-2">Gratuit</h3>
                <p className="text-3xl font-bold mb-4">0 FCFA</p>
                <p className="text-sm text-gray-600 mb-4">30 jours d'essai</p>
                <ul className="text-sm space-y-2">
                  <li>✓ Profil visible</li>
                  <li>✓ Contact direct</li>
                  <li>✓ Support standard</li>
                </ul>
              </div>

              <div
                onClick={() => setFormData(prev => ({ ...prev, subscription_type: 'simple' }))}
                className={`border-2 rounded-lg p-6 cursor-pointer ${
                  formData.subscription_type === 'simple' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <h3 className="text-lg font-bold mb-2">Simple</h3>
                <p className="text-3xl font-bold mb-4">1 000 FCFA<span className="text-sm">/mois</span></p>
                <p className="text-sm text-gray-600 mb-4">30 jours gratuits</p>
                <ul className="text-sm space-y-2">
                  <li>✓ Tout du gratuit</li>
                  <li>✓ Priorité affichage</li>
                  <li>✓ Statistiques basiques</li>
                </ul>
              </div>

              <div
                onClick={() => setFormData(prev => ({ ...prev, subscription_type: 'premium' }))}
                className={`border-2 rounded-lg p-6 cursor-pointer ${
                  formData.subscription_type === 'premium' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <h3 className="text-lg font-bold mb-2">Premium</h3>
                <p className="text-3xl font-bold mb-4">2 900 FCFA<span className="text-sm">/mois</span></p>
                <p className="text-sm text-gray-600 mb-4">Badge Premium</p>
                <ul className="text-sm space-y-2">
                  <li>✓ Tout du Simple</li>
                  <li>✓ Badge Premium</li>
                  <li>✓ Top des résultats</li>
                  <li>✓ Support prioritaire</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Traitement...' : 'Confirmer'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && paymentData && (
          <div className="space-y-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Finaliser le paiement</h2>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-lg mb-2">Montant à payer</p>
              <p className="text-4xl font-bold text-blue-600">
                {paymentData.payment_info.amount} FCFA
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Abonnement {formData.subscription_type === 'premium' ? 'Premium' : 'Simple'}
              </p>
            </div>

            <p className="text-gray-600">
              Vous serez redirigé vers PayDunya pour effectuer le paiement via Wave, Orange Money ou Carte bancaire.
            </p>

            <button
              onClick={initiatePayment}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Redirection...' : 'Procéder au paiement'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
