import { useState, useEffect } from 'react';
import { Send, Search, MessageSquare } from 'lucide-react';
import api from '../lib/api';

interface Provider {
  id: number;
  business_name: string;
  phone: string;
  city?: string;
  user: { name: string; email: string };
}

export default function AdminMessagesPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Provider | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get('/admin/providers', { params: { per_page: 500 } }).then(r => {
      const raw = r.data.data;
      setProviders(Array.isArray(raw) ? raw : (raw?.data || []));
    }).catch(() => {});
  }, []);

  const filtered = providers.filter(p => {
    const q = search.toLowerCase();
    return !q || p.business_name.toLowerCase().includes(q) || p.user?.name?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q);
  });

  const sendMessage = async () => {
    if (!selected || !message.trim()) return;
    setSending(true);
    try {
      await api.post(`/admin/providers/${selected.id}/note`, { note: `📩 Message admin: ${message.trim()}` });
      setToast(`Message envoyé à ${selected.business_name}`);
      setMessage('');
      setTimeout(() => setToast(''), 3000);
    } catch {
      setToast('Erreur lors de l\'envoi');
      setTimeout(() => setToast(''), 3000);
    }
    setSending(false);
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg bg-green-600 text-white">
          {toast}
        </div>
      )}

      <div className="flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-orange-600" />
        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Liste prestataires */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un prestataire..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {filtered.slice(0, 50).map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition text-sm ${selected?.id === p.id ? 'bg-orange-50 border-l-2 border-orange-500' : ''}`}
              >
                <p className="font-medium text-gray-900">{p.business_name}</p>
                <p className="text-xs text-gray-400">{p.user?.name} · {p.city || '—'}</p>
              </button>
            ))}
            {filtered.length === 0 && <p className="p-6 text-center text-sm text-gray-400">Aucun résultat</p>}
          </div>
        </div>

        {/* Zone de message */}
        <div className="bg-white rounded-xl border p-5 flex flex-col gap-4">
          {selected ? (
            <>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="font-semibold text-gray-900">{selected.business_name}</p>
                <p className="text-xs text-gray-500">{selected.user?.name} · {selected.phone}</p>
              </div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={6}
                placeholder="Écrivez votre message..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !message.trim()}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm font-medium transition"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
              <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Sélectionnez un prestataire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
