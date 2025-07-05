'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Coins, 
  Calendar,
  Filter,
  Download,
  Sparkles,
  DollarSign,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SAMPLE_EARNINGS = [
  {
    id: '1',
    type: 'daily',
    amount: 3000,
    currency: 'Ar',
    date: '25 juin 2025',
    time: '09:00',
    description: 'Revenu journalier BURGER 2',
    source: 'Plan BURGER 2'
  },
  {
    id: '2',
    type: 'referral',
    amount: 1500,
    currency: 'Ar',
    level: 1,
    date: '25 juin 2025',
    time: '10:30',
    description: 'Commission parrainage niveau 1',
    source: 'User123'
  },
  {
    id: '3',
    type: 'team',
    amount: 800,
    currency: 'Ar',
    level: 1,
    date: '25 juin 2025',
    time: '09:00',
    description: 'Commission équipe niveau 1',
    source: 'Équipe niveau 1'
  },
  {
    id: '4',
    type: 'points',
    amount: 25,
    currency: 'points',
    date: '24 juin 2025',
    time: '16:45',
    description: 'Points gagnés - Missions accomplies',
    source: 'Micro-tâches'
  },
  {
    id: '5',
    type: 'team',
    amount: 400,
    currency: 'Ar',
    level: 2,
    date: '24 juin 2025',
    time: '09:00',
    description: 'Commission équipe niveau 2',
    source: 'Équipe niveau 2'
  }
];

const EARNING_TYPES = [
  { id: 'all', label: 'Tous', icon: TrendingUp },
  { id: 'referral', label: 'Parrainage', icon: Users },
  { id: 'team', label: 'Équipe', icon: Users },
  { id: 'daily', label: 'Journalier', icon: DollarSign },
  { id: 'points', label: 'Points', icon: Coins }
];

const FILTER_PERIODS = [
  { id: '3', label: '3 derniers jours' },
  { id: '7', label: '7 derniers jours' },
  { id: '30', label: '30 derniers jours' },
  { id: 'all', label: 'Tout afficher' }
];

export default function EarningsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState('Ar');
  const [activeType, setActiveType] = useState('all');
  const [activePeriod, setActivePeriod] = useState('7');
  const [earnings] = useState(SAMPLE_EARNINGS);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const convertAmount = (amount, fromCurrency) => {
    if (fromCurrency === 'points') return `${amount} points`;
    if (currency === 'USDT' && fromCurrency === 'Ar') {
      return `${(amount / 5000).toFixed(2)} USDT`;
    }
    return `${amount.toLocaleString()} Ar`;
  };

  const getTypeIcon = (type) => {
    const typeConfig = EARNING_TYPES.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : TrendingUp;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'referral': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'team': return 'bg-green-100 text-green-800 border-green-200';
      case 'daily': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'points': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type, level) => {
    switch (type) {
      case 'referral': return `Parrainage L${level}`;
      case 'team': return `Équipe L${level}`;
      case 'daily': return 'Journalier';
      case 'points': return 'Points';
      default: return type;
    }
  };

  const filteredEarnings = earnings.filter(earning => {
    if (activeType !== 'all' && earning.type !== activeType) return false;
    return true;
  });

  const totalEarnings = filteredEarnings.reduce((total, earning) => {
    if (earning.currency === 'Ar') {
      return total + earning.amount;
    }
    return total;
  }, 0);

  const totalPoints = filteredEarnings.reduce((total, earning) => {
    if (earning.currency === 'points') {
      return total + earning.amount;
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan statique */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600"></div>
      
      {/* Particules statiques */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            <Sparkles className="w-2 h-2 text-yellow-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard">
              <button className="group flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500
               text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <ArrowLeft className="support-icon" />
                <span>Retour</span>
              </button>
            </Link>
            
            {/* Currency Toggle */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${currency === 'Ar' ? 'text-white' : 'text-white/60'}`}>
                Ar
              </span>
              <input
                type="checkbox"
                checked={currency === 'USDT'}
                onChange={(e) => setCurrency(e.target.checked ? 'USDT' : 'Ar')}
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
              />
              <span className={`text-sm font-semibold ${currency === 'USDT' ? 'text-white' : 'text-white/60'}`}>
                USDT
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600">HISTORIQUE DES GAINS</h1>
              <div className="absolute -top-2 -right-8">
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/80 text-lg">Suivi de vos revenus</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="card-summary bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl p-3 shadow-2xl border-2 border-yellow-400 hover:shadow-yellow-500/50 
            transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center">
              <DollarSign className="w-8 h-8 mb-1" />
              <p className="text-emerald-400 text-xs text-center">Total Gains</p>
              <p className="text-lg font-bold text-center">{convertAmount(totalEarnings, 'Ar')}</p>
            </div>
            
            <div className="card-summary bg-gradient-to-br from-yellow-500 to-yellow-700 text-white rounded-xl p-3 shadow-2xl border-2 border-yellow-400 hover:shadow-yellow-500/50 transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center">
              <Coins className="w-8 h-8 mb-1" />
              <p className="text-xs uppercase tracking-wide text-center">Points Gagnés</p>
              <p className="text-lg font-bold text-center">{totalPoints} points</p>
            </div>
            
            <div className="card-summary bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl p-3 shadow-2xl border-2 border-yellow-400 hover:shadow-yellow-500/50 transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center">
              <Target className="w-8 h-8 mb-1" />
              <p className="text-xs uppercase tracking-wide text-center">Transactions</p>
              <p className="text-lg font-bold text-center">{filteredEarnings.length}</p>
            </div>
          </div>

          {/* Filters */}
        <div className="bg-red-400 backdrop-blur-md border border-emerald-500/20 rounded-xl p-6 shadow-lg">
            {/* Header Filtres */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-green-400">Filtres</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-200">
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
            </div>

            {/* Filtres Type de gains */}
            <div className="mb-6">
              <p className="text-sm text-white mb-2">Type de gains :</p>
              <div className="flex flex-wrap gap-2">
                {EARNING_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isActive = activeType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setActiveType(type.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtres Période */}
            <div>
              <p className="text-sm text-white mb-2">Période :</p>
              <div className="flex flex-wrap gap-2">
                {FILTER_PERIODS.map((period) => {
                  const isActive = activePeriod === period.id;
                  return (
                    <button
                      key={period.id}
                      onClick={() => setActivePeriod(period.id)}
                      className={`px-3 py-2 rounded-full border text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {period.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

         {/* Earnings List */}
          <div className="space-y-4 mb-12 mt-6">
            {filteredEarnings.map((earning, index) => {
              const Icon = getTypeIcon(earning.type);
              return (
                <div
                  key={earning.id}
                  className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start gap-4">
                    {/* Icon + Infos */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-red-500" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-semibold">{earning.description}</h3>
                          <span className={`${getTypeColor(earning.type)} text-xs px-2 py-1 rounded-full border`}>
                            {getTypeLabel(earning.type, earning.level)}
                          </span>
                        </div>

                        {earning.source && (
                          <p className="text-sm text-white/80 mb-1">Source: {earning.source}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-white/60">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{earning.date}</span>
                          </div>
                          <span>{earning.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Montant */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-500">
                        +{convertAmount(earning.amount, earning.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>


            {/* Empty State */}
           {filteredEarnings.length === 0 && (
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center shadow-lg">
              <TrendingUp className="w-16 h-16 text-white/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aucun gain</h3>
              <p className="text-white/80">Aucun gain trouvé pour cette période et ce type.</p>
            </div>
          )}

          {/* Bottom padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}