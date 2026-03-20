import { useState } from 'react';
import { X } from 'lucide-react';

// Dates de la Korité (à ajuster selon l'annonce officielle)
const START = new Date('2026-03-20T00:00:00');
const END = new Date('2026-03-22T00:00:00'); // affiché pendant 2 jours

export default function KoriteBanner() {
  const [closed, setClosed] = useState(false);
  const now = new Date();

  if (closed || now < START || now >= END) return null;

  return (
    <div className="relative bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 text-white py-3 px-4 text-center z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <span className="text-lg">🌙</span>
        <p className="text-sm md:text-base font-medium leading-snug">
          ✨ <strong>AMNAFI</strong> vous souhaite une excellente fête de Korité !
          Que cette journée de partage vous apporte paix, joie et réussite.
          Restons unis et solidaires pour construire ensemble un avenir meilleur.
          Bonne fête à vous et à vos proches ! 🌙
        </p>
        <button
          onClick={() => setClosed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
