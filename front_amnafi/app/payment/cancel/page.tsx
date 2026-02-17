'use client';

import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-yellow-600 text-6xl mb-4">⚠</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement annulé</h2>
        <p className="text-gray-600 mb-6">
          Vous avez annulé le paiement. Vous pouvez réessayer quand vous le souhaitez.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => router.push('/provider/register')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Réessayer le paiement
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
