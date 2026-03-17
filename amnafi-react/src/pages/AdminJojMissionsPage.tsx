import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, UserCheck, XCircle, Filter } from 'lucide-react';
import { jojApi, type JojMission, type OfficialProvider } from '../lib/jojApi';

export default function AdminJojMissionsPage() {
  const [missions, setMissions] = useState<JojMission[]>([]);
  const [providers, setProviders] = useState<OfficialProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedMission, setSelectedMission] = useState<JojMission | null>(null);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [missionsData, providersData] = await Promise.all([
        jojApi.getAllMissions(filter),
        jojApi.getOfficialProviders({})
      ]);
      setMissions(missionsData);
      setProviders(providersData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id: number) => {
    try {
      await jojApi.validateMission(id, notes);
      alert('Mission validée avec succès');
      loadData();
      setSelectedMission(null);
      setNotes('');
    } catch (error) {
      alert('Erreur lors de la validation');
    }
  };

  const handleAssign = async (id: number) => {
    if (!selectedProvider) {
      alert('Veuillez sélectionner un prestataire');
      return;
    }
    try {
      await jojApi.assignMission(id, Number(selectedProvider), notes);
      alert('Mission assignée avec succès');
      loadData();
      setSelectedMission(null);
      setSelectedProvider('');
      setNotes('');
    } catch (error) {
      alert('Erreur lors de l\'assignation');
    }
  };

  const handleCancel = async (id: number) => {
    const reason = prompt('Raison de l\'annulation:');
    if (!reason) return;
    try {
      await jojApi.cancelMission(id, reason);
      alert('Mission annulée');
      loadData();
    } catch (error) {
      alert('Erreur lors de l\'annulation');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    validated: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'En attente',
    validated: 'Validée',
    assigned: 'Assignée',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gestion des Missions JOJ</h1>
          <p className="text-lg text-gray-600">Administration des demandes de missions</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="validated">Validées</option>
              <option value="assigned">Assignées</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {missions.map((mission) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{mission.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[mission.status]}`}>
                      {statusLabels[mission.status]}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: #{mission.id}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{mission.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-semibold">Lieu:</span> {mission.location}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span> {new Date(mission.preferred_date).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                {mission.official_provider && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="font-semibold">Prestataire: {mission.official_provider.full_name}</p>
                    <p className="text-sm text-gray-600">{mission.official_provider.specialty}</p>
                  </div>
                )}

                {selectedMission?.id === mission.id ? (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Notes administrateur..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                      rows={3}
                    />
                    
                    {mission.status === 'validated' && (
                      <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                      >
                        <option value="">Sélectionner un prestataire</option>
                        {providers.filter(p => p.is_active && p.availability === 'available').map(p => (
                          <option key={p.id} value={p.id}>
                            {p.full_name} - {p.specialty}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : null}

                <div className="flex gap-3">
                  {mission.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedMission(mission);
                          handleValidate(mission.id);
                        }}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Valider
                      </button>
                      <button
                        onClick={() => handleCancel(mission.id)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Refuser
                      </button>
                    </>
                  )}

                  {mission.status === 'validated' && (
                    <>
                      {selectedMission?.id === mission.id ? (
                        <>
                          <button
                            onClick={() => handleAssign(mission.id)}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Confirmer l'assignation
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMission(null);
                              setSelectedProvider('');
                              setNotes('');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedMission(mission)}
                          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Assigner
                        </button>
                      )}
                    </>
                  )}

                  {['assigned', 'in_progress'].includes(mission.status) && (
                    <button
                      onClick={() => handleCancel(mission.id)}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Annuler
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
