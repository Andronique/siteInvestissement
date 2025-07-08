'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Target,
  Plus,
  Play,
  CheckCircle,
  Eye,
  Upload,
  Coins,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const SAMPLE_MISSIONS = [
  {
    id: '1',
    title: 'Like vidéo YouTube',
    description: "Liker cette vidéo YouTube sur les burgers McDonald's",
    url: 'https://youtube.com/watch?v=example',
    type: 'like',
    points: 1,
    maxExecutors: 100,
    currentExecutors: 45,
    creatorId: 'user123',
    status: 'active',
    validationType: 'manual',
    createdAt: '2025-06-25T10:00:00Z',
  },
  {
    id: '2',
    title: "S'abonner à la chaîne",
    description: "S'abonner à notre chaîne YouTube officielle",
    url: 'https://youtube.com/channel/example',
    type: 'subscribe',
    points: 2,
    maxExecutors: 50,
    currentExecutors: 12,
    creatorId: 'user456',
    status: 'active',
    validationType: 'manual',
    createdAt: '2025-06-25T09:30:00Z',
  },
];

export default function MicrotasksPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [userPoints, setUserPoints] = useState(150);
  const [myMissions, setMyMissions] = useState(3);
  const [missions] = useState(SAMPLE_MISSIONS);
  const [isExecuting, setIsExecuting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedMission, setSelectedMission] = useState(null);
  const [proofFile, setProofFile] = useState(null);

  const [newMission, setNewMission] = useState({
    title: '',
    url: '',
    type: 'like',
    maxExecutors: '',
    points: '',
    description: '',
    validationType: 'manual',
  });

  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  useEffect(() => {
    let interval;
    if (isExecuting && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExecuting, timer]);

  const handleCreateMission = async (e) => {
    e.preventDefault();

    const totalCost = parseInt(newMission.points) * parseInt(newMission.maxExecutors);
    if (totalCost > userPoints) {
      toast.error('Points insuffisants pour créer cette mission');
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUserPoints((prev) => prev - totalCost);
    setMyMissions((prev) => prev + 1);

    toast.success('Mission créée avec succès !');

    setNewMission({
      title: '',
      url: '',
      type: 'like',
      maxExecutors: '',
      points: '',
      description: '',
      validationType: 'manual',
    });
  };

  const handleExecuteMission = (mission) => {
    setSelectedMission(mission);
    setTimer(15);
    setIsExecuting(true);
    toast.info(`Exécution de la mission "${mission.title}" commencée. Temps restant: 15s`);
  };

  const handleSubmitProof = async () => {
    if (!proofFile) {
      toast.error('Veuillez télécharger une capture d\'écran');
      return;
    }

    if (timer > 0) {
      toast.error('Veuillez attendre la fin du timer');
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Mission soumise pour validation !');
    setIsExecuting(false);
    setSelectedMission(null);
    setProofFile(null);
    setTimer(0);
  };

  const getTypeLabel = (type) => {
    const types = {
      like: 'Like',
      subscribe: "S'abonner",
      watch: 'Regarder',
      follow: 'Suivre',
      register: "S'inscrire",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600"></div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/dashboard">
              <button className="group flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-white bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 glow">
                MICRO-TÂCHES
              </h1>
              <div className="absolute -top-2 -right-8">
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <p className="text-gray-200/80 text-lg">Créer et Exécuter des Missions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="glass-dark border border-emerald-500/20 bg-red-500 rounded-lg shadow-lg">
              <div className="p-4 text-center">
                <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-emerald-400 text-sm">Mes Points</p>
                <p className="text-lg font-bold text-white">{userPoints}</p>
              </div>
            </div>
            <div className="glass-dark border border-emerald-500/20 bg-red-500 rounded-lg shadow-lg">
              <div className="p-4 text-center">
                <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-emerald-400 text-sm">Mes Missions</p>
                <p className="text-lg font-bold text-white">{myMissions}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                  activeTab === 'create'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-emerald-500/30 text-white hover:bg-emerald-600/20'
                }`}
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Créer
              </button>
              <button
                onClick={() => setActiveTab('execute')}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                  activeTab === 'execute'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-emerald-500/30 text-white hover:bg-emerald-600/20'
                }`}
              >
                <Play className="w-4 h-4 mr-2 inline" />
                Exécuter
              </button>
              <button
                onClick={() => setActiveTab('validate')}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                  activeTab === 'validate'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-emerald-500/30 text-white hover:bg-emerald-600/20'
                }`}
              >
                <CheckCircle className="w-4 h-4 mr-2 inline" />
                Valider
              </button>
            </div>
          </div>

          {/* Create Mission Tab */}
          {activeTab === 'create' && (
            <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg bg-red-500">
              <div className="p-6">
                <h2 className="text-emerald-400 text-lg font-semibold mb-4">Créer une Mission</h2>
                <form onSubmit={handleCreateMission} className="space-y-6">
                  <div>
                    <label className="text-white text-sm font-medium">Titre de la mission</label>
                    <input
                      placeholder="Ex: Liker ma vidéo YouTube"
                      value={newMission.title}
                      onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                      className="w-full px-4 py-2 mt-1 bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Lien à promouvoir</label>
                    <input
                      placeholder="https://youtube.com/watch?v=..."
                      value={newMission.url}
                      onChange={(e) => setNewMission({ ...newMission, url: e.target.value })}
                      className="w-full px-4 py-2 mt-1 bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Type de mission</label>
                    <select
                      value={newMission.type}
                      onChange={(e) => setNewMission({ ...newMission, type: e.target.value })}
                      className="w-full px-4 py-2 mt-1 bg-emerald-900/30 border border-emerald-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="like">Like</option>
                      <option value="subscribe">S'abonner</option>
                      <option value="watch">Regarder une vidéo</option>
                      <option value="follow">Suivre une page</option>
                      <option value="register">S'inscrire sur un site</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm font-medium">Nombre d'exécutants</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={newMission.maxExecutors}
                        onChange={(e) => setNewMission({ ...newMission, maxExecutors: e.target.value })}
                        className="w-full px-4 py-2 mt-1 bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium">Points par exécutant</label>
                      <input
                        type="number"
                        placeholder="1"
                        value={newMission.points}
                        onChange={(e) => setNewMission({ ...newMission, points: e.target.value })}
                        className="w-full px-4 py-2 mt-1 bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Description</label>
                    <textarea
                      placeholder="Décrivez précisément ce que l'utilisateur doit faire..."
                      value={newMission.description}
                      onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                      className="w-full px-4 py-2 mt-1 bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Type de validation</label>
                    <select
                      value={newMission.validationType}
                      onChange={(e) => setNewMission({ ...newMission, validationType: e.target.value })}
                      className="w-full px-4 py-2 mt-1 bg-emerald-900/30 border border-emerald-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="manual">Validation manuelle</option>
                      <option value="automatic">Validation automatique</option>
                    </select>
                  </div>
                  {newMission.maxExecutors && newMission.points && (
                    <div className="bg-emerald-900/20 p-4 rounded-lg">
                      <p className="text-emerald-400 text-sm">
                        Coût total: {parseInt(newMission.maxExecutors || '0') * parseInt(newMission.points || '0')} points
                      </p>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newMission.title || !newMission.url || !newMission.maxExecutors || !newMission.points}
                    >
                      Créer la Mission
                    </button>
                    <button
                      type="button"
                      className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                      onClick={() =>
                        setNewMission({
                          title: '',
                          url: '',
                          type: 'like',
                          maxExecutors: '',
                          points: '',
                          description: '',
                          validationType: 'manual',
                        })
                      }
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Execute Mission Tab */}
          {activeTab === 'execute' && !isExecuting && (
            <div className="space-y-4">
              {missions.map((mission) => (
                <div key={mission.id} className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{mission.title}</h3>
                        <p className="text-gray-200 text-sm mb-2">{mission.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-200">
                          <span className="bg-emerald-600 text-white px-2 py-1 rounded">
                            {getTypeLabel(mission.type)}
                          </span>
                          <span>
                            {mission.currentExecutors}/{mission.maxExecutors} exécutants
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400 mb-2">
                          +{mission.points} points
                        </div>
                        <button
                          onClick={() => handleExecuteMission(mission)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={mission.currentExecutors >= mission.maxExecutors}
                        >
                          <Play className="w-4 h-4 mr-2 inline" />
                          Exécuter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Execute Mission - Active State */}
          {activeTab === 'execute' && isExecuting && selectedMission && (
            <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg">
              <div className="p-6">
                <h2 className="text-emerald-400 text-lg font-semibold mb-4">Exécution de la Mission</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-semibold">{selectedMission.title}</p>
                    <p className="text-gray-200 text-sm">{selectedMission.description}</p>
                    <a
                      href={selectedMission.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline text-sm"
                    >
                      {selectedMission.url}
                    </a>
                  </div>
                  <div className="bg-emerald-900/20 p-4 rounded-lg">
                    <p className="text-emerald-400 text-sm font-semibold">Temps restant</p>
                    <p className="text-2xl font-bold text-white">{timer} secondes</p>
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Preuve d'exécution</label>
                    <div className="relative mt-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProofFile(e.target.files[0])}
                        className="w-full px-4 py-2 bg-emerald-900/30 border border-emerald-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                    </div>
                    {proofFile && (
                      <p className="text-gray-200 text-sm mt-1">Fichier sélectionné: {proofFile.name}</p>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSubmitProof}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={timer > 0 || !proofFile}
                    >
                      Soumettre
                    </button>
                    <button
                      onClick={() => {
                        setIsExecuting(false);
                        setSelectedMission(null);
                        setProofFile(null);
                        setTimer(0);
                      }}
                      className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validate Tab */}
          {activeTab === 'validate' && (
            <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg">
              <div className="p-6">
                <h2 className="text-emerald-400 text-lg font-semibold mb-4">Missions à Valider</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-emerald-900/20 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">User123</p>
                      <p className="text-gray-200 text-sm">Like vidéo YouTube</p>
                      <p className="text-xs text-gray-400">Soumis il y a 5 min</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors duration-300">
                        <Eye className="w-4 h-4 mr-1 inline" />
                        Voir
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors duration-300">
                        Valider
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors duration-300">
                        Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}