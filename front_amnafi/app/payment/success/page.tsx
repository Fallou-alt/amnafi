'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Vérification du paiement...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyPayment(token);
    } else {
      setStatus('error');
      setMessage('Token de paiement manquant');
    }
  }, [searchParams]);

  const verifyPayment = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/premium/verify/${token}`);
      
      if (response.data.success) {
        setStatus('success');
        setMessage('Paiement confirmé ! Votre abonnement est maintenant actif.');
        setTimeout(() => {
          router.push('/provider/dashboard');
        }, 3000);
      } else {
        setStatus('pending');
        setMessage('Paiement en cours de traitement...');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erreur lors de la vérification du paiement');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Vérification en cours</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Paiement réussi !</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirection automatique...</p>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="text-yellow-600 text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">En attente</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/provider/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Aller au tableau de bord
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-600 text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/provider/register')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
