import { useState, useEffect } from 'react';
import { Download, Eye, EyeOff, Search, GraduationCap } from 'lucide-react';
import api from '../lib/api';

interface Student {
  id: number;
  business_name: string;
  phone: string;
  email: string;
  city: string;
  is_active: boolean;
  is_student: boolean;
  phone_hidden: boolean;
  created_at: string;
  user: { name: string; email: string };
  category: { name: string } | null;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/providers', { params: { is_student: 1, per_page: 500 } });
      const raw = res.data.data;
      const list: Student[] = Array.isArray(raw) ? raw : (raw?.data || []);
      setStudents(list.filter((p: Student) => p.is_student));
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const revealPhone = async (id: number) => {
    try {
      const res = await api.patch(`/admin/providers/${id}/reveal-phone`);
      if (res.data.success) {
        setRevealedIds(prev => new Set(prev).add(id));
        setStudents(prev => prev.map(s => s.id === id ? { ...s, phone_hidden: false, phone: res.data.data.phone } : s));
      }
    } catch {}
  };

  const exportCSV = () => {
    window.open(api.defaults.baseURL + '/admin/students/export', '_blank');
  };

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return !q || s.user?.name?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.category?.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
  });

  const maskedPhone = (phone: string) => {
    if (!phone) return '—';
    return phone.slice(0, 4) + '••••' + phone.slice(-2);
  };

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Étudiants & Jeunes diplômés</h1>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{students.length}</span>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
        >
          <Download className="w-4 h-4" /> Exporter Excel (CSV)
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, ville, catégorie..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucun étudiant trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['#', 'Nom', 'Catégorie', 'Ville', 'Email', 'Téléphone', 'Statut', 'Inscrit le'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-400 text-xs">{s.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.user?.name || s.business_name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{s.city || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{s.email || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs ${s.phone_hidden && !revealedIds.has(s.id) ? 'text-gray-400' : 'text-gray-900'}`}>
                        {s.phone_hidden && !revealedIds.has(s.id) ? maskedPhone(s.phone) : (s.phone || '—')}
                      </span>
                      {s.phone_hidden && !revealedIds.has(s.id) ? (
                        <button onClick={() => revealPhone(s.id)} title="Démasquer" className="text-blue-500 hover:text-blue-700">
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {s.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(s.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
