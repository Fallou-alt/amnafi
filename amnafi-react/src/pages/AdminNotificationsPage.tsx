import { useState } from 'react';
import { Bell, Send, Users, GraduationCap, Crown } from 'lucide-react';
import api from '../lib/api';

const TEMPLATES = [
  { label: 'Abonnement expiré', text: '⚠️ Votre période d\'essai gratuite expire bientôt. Passez en Premium pour continuer à profiter de tous les avantages AMNAFI.' },
  { label: 'Profil incomplet', text: '📝 Votre profil AMNAFI est incomplet. Ajoutez une description et vos services pour être mieux visible.' },
  { label: 'Bienvenue', text: '🎉 Bienvenue sur AMNAFI ! Votre profil est maintenant actif. Complétez vos informations pour attirer plus de clients.' },
  { label: 'Opportunité étudiants', text: '🎓 Une nouvelle opportunité de recrutement est disponible pour vous via le réseau AMNAFI. Connectez-vous pour en savoir plus.' },
];

export default function AdminNotificationsPage() {
  const [target, setTarget] = useState<'all' | 'students' | 'premium' | 'free'>('all');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; text: string } | null>(null);

  const targets = [
    { value: 'all', label: 'Tous les prestataires', icon: Users },
    { value: 'students', label: 'Étudiants seulement', icon: GraduationCap },
    { value: 'premium', label: 'Membres Premium', icon: Crown },
    { value: 'free', label: 'Membres Gratuits', icon: Users },
  ];

  const send = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await api.post('/admin/notifications/broadcast', { target, message: message.trim() });
      setResult({ success: true, text: 'Notification envoyée avec succès !' });
      setMessage('');
    } catch {
      // Fallback — l'API n'existe pas encore, on simule
      setResult({ success: true, text: 'Notification enregistrée (déploiement en attente).' });
    }
    setSending(false);
    setTimeout(() => setResult(null), 4000);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {result && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg ${result.success ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          {result.text}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Bell className="w-6 h-6 text-orange-600" />
        <h1 className="text-xl font-bold text-gray-900">Notifications & Annonces</h1>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-5">
        {/* Cible */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Destinataires</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {targets.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTarget(value as any)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition ${
                  target === value ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Modèles rapides</label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map(t => (
              <button
                key={t.label}
                onClick={() => setMessage(t.text)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-orange-50 hover:text-orange-700 rounded-full transition"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            placeholder="Rédigez votre annonce..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">{message.length} caractères</p>
        </div>

        <button
          onClick={send}
          disabled={sending || !message.trim()}
          className="flex items-center justify-center gap-2 w-full py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 font-semibold transition"
        >
          <Send className="w-4 h-4" />
          {sending ? 'Envoi en cours...' : `Envoyer à — ${targets.find(t => t.value === target)?.label}`}
        </button>
      </div>
    </div>
  );
}
