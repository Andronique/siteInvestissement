'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Target, 
  Plus, 
  Play, 
  CheckCircle,
  Clock,
  Eye,
  Upload,
  Coins,
  Users,
  Sparkles,
  Timer,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const SAMPLE_MISSIONS = [
  {
    id: '1',
    title: 'Like vidéo YouTube',
    description: 'Liker cette vidéo YouTube sur les burgers McDonald\'s',
    url: 'https://youtube.com/watch?v=example',
    type: 'like',
    points: 1,
    maxExecutors: 100,
    currentExecutors: 45,
    creatorId: 'user123',
    status: 'active',
    validationType: 'manual',
    createdAt: '2025-06-25T10:00:00Z'
  },
  {
    id: '2',
    title: 'S\'abonner à la chaîne',
    description: 'S\'abonner à notre chaîne YouTube officielle',
    url: 'https://youtube.com/channel/example',
    type: 'subscribe',
    points: 2,
    maxExecutors: 50,
    currentExecutors: 12,
    creatorId: 'user456',
    status: 'active',
    validationType: 'manual',
    createdAt: '2025-06-25T09:30:00Z'
  }
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
    validationType: 'manual'
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
        setTimer(prev => prev - 1);
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

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUserPoints(prev => prev - totalCost);
    setMyMissions(prev => prev + 1);
    
    toast.success('Mission créée avec succès !');
    
    setNewMission({
      title: '',
      url: '',
      type: 'like',
      maxExecutors: '',
      points: '',
      description: '',
      validationType: 'manual'
    });
  };

  const handleExecuteMission = (mission) => {
    setSelectedMission(mission);
    setTimer(15);
    setIsExecuting(true);
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

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Mission soumise pour validation !');
    setIsExecuting(false);
    setSelectedMission(null);
    setProofFile(null);
    setTimer(0);
  };

  const getTypeLabel = (type) => {
    const types = {
      like: 'Like',
      subscribe: 'S\'abonner',
      watch: 'Regarder',
      follow: 'Suivre',
      register: 'S\'inscrire'
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-2 h-2 text-emerald-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-4 ">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`flex items-center mb-6 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <button className="btn-return text-emerald-400 hover:bg-emerald-600/20">
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                Retour
              </button>
            </Link>
          </div>

          {/* Title */}
          <div className={`text-center mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">MICRO-TÂCHES</h1>
              <div className="absolute -top-2 -right-8">
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/80 text-lg">Créer et Exécuter des Missions</p>
          </div>

          {/* Stats */}
       <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2 justify-center mx-auto max-w-4xl">
        <div className="card-summary bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl p-4
                        shadow-2xl border-2 border-yellow-400 hover:shadow-yellow-500/50
                        transform hover:-translate-y-2 transition-all duration-300
                        flex flex-col items-center justify-center text-center">
          <Coins className="w-8 h-8 text-yellow-400 mb-1 animate-bounce" />
          <p className="text-emerald-400 text-xs">Mes Points</p>
          <p className="text-lg font-bold">{userPoints}</p>
        </div>
        
        <div className="card-summary bg-gradient-to-br from-yellow-500 to-yellow-700 text-white rounded-xl p-4
                        shadow-2xl border-2 border-red-400 hover:shadow-yellow-500/50
                        transform hover:-translate-y-2 transition-all duration-300
                        flex flex-col items-center justify-center text-center">
          <Users className="w-8 h-8 text-yellow-400 mb-1 animate-bounce" />
          <p className="text-emerald-400 text-xs">Mes Missions</p>
          <p className="text-lg font-bold">{myMissions}</p>
        </div>
        </div>
          {/* Tabs */}
          <div className="mb-6">
            <div className="p-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`px-4 py-2 rounded-full bg-gray-200  ${
                    activeTab === 'create' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-green-500' 
                      : 'border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Créer
                </button>
                <button
                  onClick={() => setActiveTab('execute')}
                  className={`px-4 py-2 rounded-full bg-gray-200  ${
                    activeTab === 'execute' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                  }`}
                >
                  <Play className="w-4 h-4 mr-2 inline" />
                  Exécuter
                </button>
                <button
                  onClick={() => setActiveTab('validate')}
                  className={`px-4 py-2 rounded-full bg-gray-200  ${
                    activeTab === 'validate' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2 inline" />
                  Valider
                </button>
              </div>
            </div>
          </div>

          {/* Create Mission Tab */}
          {activeTab === 'create' && (
          <div className={`bg-gradient-to-br from-emerald-800/30 to-emerald-900/40 border border-emerald-500/20 backdrop-blur-lg shadow-xl rounded-xl 
          transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transform`}>
              <div className="p-6">
                <h2 className="text-emerald-400 text-lg font-semibold mb-4">Créer une Mission</h2>
                <form onSubmit={handleCreateMission} className="space-y-6">
                  <div>
                    <label className="text-white">Titre de la mission</label>
                    <input
                      placeholder="Ex: Liker ma vidéo YouTube"
                      value={newMission.title}
                      onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                      className="bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 w-full px-4 py-2 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-white">Lien à promouvoir</label>
                    <input
                      placeholder="https://youtube.com/watch?v=..."
                      value={newMission.url}
                      onChange={(e) => setNewMission({...newMission, url: e.target.value})}
                      className="bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 w-full px-4 py-2 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-white">Type de mission</label>
                    <select
                      value={newMission.type}
                      onChange={(e) => setNewMission({...newMission, type: e.target.value})}
                      className="bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 w-full px-4 py-2 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                    >
                      <option value="like" className="text-white bg-gray-800">Like</option>
                      <option value="subscribe" className="text-white bg-gray-800">S'abonner</option>
                      <option value="watch" className="text-white bg-gray-800">Regarder une vidéo</option>
                      <option value="follow" className="text-white bg-gray-800">Suivre une page</option>
                      <option value="register" className="text-white bg-gray-800">S'inscrire sur un site</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white">Nombre d'exécutants</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={newMission.maxExecutors}
                        onChange={(e) => setNewMission({...newMission, maxExecutors: e.target.value})}
                         className="bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 w-full px-4 py-2 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-white">Points par exécutant</label>
                      <input
                        type="number"
                        placeholder="1"
                        value={newMission.points}
                        onChange={(e) => setNewMission({...newMission, points: e.target.value})}
                        className="bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 w-full px-4 py-2 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white">Description</label>
                    <textarea
                      placeholder="Décrivez précisément ce que l'utilisateur doit faire..."
                      value={newMission.description}
                      onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                       className="bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 w-full px-4 py-2 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-white">Type de validation</label>
                    <select
                      value={newMission.validationType}
                      onChange={(e) => setNewMission({...newMission, validationType: e.target.value})}
                      className="bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 w-full px-4 py-2 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                    >
                      <option value="manual" className="text-white bg-gray-800">Validation manuelle</option>
                      <option value="automatic" className="text-white bg-gray-800">Validation automatique</option>
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
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"

                      disabled={!newMission.title || !newMission.url || !newMission.maxExecutors || !newMission.points}
                    >
                      Créer la Mission
                    </button>
                    <button
                      type="button"
                     className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-2 px-4 rounded-lg transition"

                      onClick={() => setNewMission({
                        title: '',
                        url: '',
                        type: 'like',
                        maxExecutors: '',
                        points: '',
                        description: '',
                        validationType: 'manual'
                      })}
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
              {missions.map((mission, index) => (
                <div 
                  key={mission.id} 
                  className={`glass-card border-emerald-500/20 hover-lift ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}
                  style={{animationDelay: `${0.6 + index * 0.1}s`}}
                >
                  <div className="p-6 bg-red-600">
                    <div className="flex justify-between items-start mb-4  bordedr-b border-emerald-500/30">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{mission.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">{mission.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span className="bg-emerald-600 text-white px-2 py-1 rounded">
                            {getTypeLabel(mission.type)}
                          </span>
                          <span>{mission.currentExecutors}/{mission.maxExecutors} exécutants</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400 mb-2">
                          +{mission.points} points
                        </div>
                        <button
                          onClick={() => handleExecuteMission(mission)}
                         className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow transition"

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

          {/* Validate Tab */}
          {activeTab === 'validate' && (
            <div className={`glass-card border-emerald-500/20 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <div className="p-6">
                <h2 className="text-emerald-400 text-lg font-semibold mb-4">Missions à Valider</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-emerald-900/20 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">User123</p>
                      <p className="text-gray-300 text-sm">Like vidéo YouTube</p>
                      <p className="text-xs text-gray-400">Soumis il y a 5 min</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="btn-view bg-blue-600 hover:bg-blue-700">
                        <Eye className="w-4 h-4 mr-1 inline" />
                        Voir
                      </button>
                      <button className="btn-validate bg-green-600 hover:bg-green-700">
                        Valider
                      </button>
                      <button className="btn-reject bg-red-600 hover:bg-red-700">
                        Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}