'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, Coins, Calendar, Filter, Download, DollarSign, Target } from 'lucide-react';
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
    source: 'Plan BURGER 2',
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
    source: 'User123',
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
    source: 'Équipe niveau 1',
  },
  {
    id: '4',
    type: 'points',
    amount: 25,
    currency: 'points',
    date: '24 juin 2025',
    time: '16:45',
    description: 'Points gagnés - Missions accomplies',
    source: 'Micro-tâches',
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
    source: 'Équipe niveau 2',
  },
];

const EARNING_TYPES = [
  { id: 'all', label: 'Tous', icon: TrendingUp },
  { id: 'referral', label: 'Parrainage', icon: Users },
  { id: 'team', label: 'Équipe', icon: Users },
  { id: 'daily', label: 'Journalier', icon: DollarSign },
  { id: 'points', label: 'Points', icon: Coins },
];

const FILTER_PERIODS = [
  { id: '3', label: '3 derniers jours' },
  { id: '7', label: '7 derniers jours' },
  { id: '30', label: '30 derniers jours' },
  { id: 'all', label: 'Tout afficher' },
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
    const typeConfig = EARNING_TYPES.find((t) => t.id === type);
    return typeConfig ? typeConfig.icon : TrendingUp;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'referral':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'team':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'daily':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'points':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type, level) => {
    switch (type) {
      case 'referral':
        return `Parrainage L${level}`;
      case 'team':
        return `Équipe L${level}`;
      case 'daily':
        return 'Journalier';
      case 'points':
        return 'Points';
      default:
        return type;
    }
  };

  const filteredEarnings = earnings.filter((earning) => {
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
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600"></div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard">
              <button className="group flex items-center px-4 py-2 bg-gradient-to-r
               from-red-500 to-yellow-500 text-white font-semibold rounded-full 
               shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>
            </Link>
            <div className="flex items-center space-x-2">
              <span className={`font-semibold ${currency === 'Ar' ? 'text-green-600' : 'text-gray-400'}`}>
                Ar
              </span>
               <label className="relative inline-flex items-center cursor-pointer ml-2 mr-2">
              <input
                type="checkbox"
                checked={currency === 'USDT'}
                onChange={(e) => setCurrency(e.target.checked ? 'USDT' : 'Ar')}
                className="sr-only peer"
              />
               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
               </label>
              <span className={`font-semibold ${currency === 'USDT' ? 'text-green-600' : 'text-gray-400'}`}>
                USDT
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-emerald-400 glow">HISTORIQUE DES GAINS</h1>
              <div className="absolute -top-2 -right-8">
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/90 text-lg mt-2">Suivi de vos revenus</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="glass-dark border border-emerald-500/20 bg-red-500 rounded-lg shadow-lg p-4 text-center">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-emerald-400 text-sm">Total Gains</p>
              <p className="text-lg font-bold text-white">{convertAmount(totalEarnings, 'Ar')}</p>
            </div>
            <div className="glass-dark border border-emerald-500/20 bg-red-500 rounded-lg shadow-lg p-4 text-center">
              <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-emerald-400 text-sm">Points Gagnés</p>
              <p className="text-lg font-bold text-white">{totalPoints} points</p>
            </div>
            <div className="glass-dark border border-emerald-500/20  bg-red-500 rounded-lg shadow-lg p-4 text-center">
              <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-emerald-400 text-sm">Transactions</p>
              <p className="text-lg font-bold text-white">{filteredEarnings.length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="glass-dark border border-emerald-500/20 bg-red-500 rounded-lg shadow-lg mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">Filtres</span>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-300">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Exporter
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white mb-2">Type de gains :</p>
                  <div className="flex flex-wrap gap-2">
                    {EARNING_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setActiveType(type.id)}
                          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-300 ${
                            activeType === type.id
                              ? 'bg-emerald-500 text-white'
                              : 'border border-emerald-400/30 text-white bg-amber-700 hover:bg-emerald-600/20'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-2 inline" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-white mb-2">Période :</p>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_PERIODS.map((period) => (
                      <button
                        key={period.id}
                        onClick={() => setActivePeriod(period.id)}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-300 ${
                          activePeriod === period.id
                            ? 'bg-emerald-600 text-white'
                            : 'border border-emerald-500/30 text-white bg-amber-700 hover:bg-emerald-600/20'
                        }`}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings List */}
          <div className="space-y-4 mb-8">
            {filteredEarnings.map((earning) => {
              const Icon = getTypeIcon(earning.type);
              return (
                <div key={earning.id} className="glass-dark border border-emerald-500/20 bg-red-500 rounded-lg shadow-lg">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-semibold">{earning.description}</h3>
                            <span className={`${getTypeColor(earning.type)} text-xs px-2 py-1 rounded border`}>
                              {getTypeLabel(earning.type, earning.level)}
                            </span>
                          </div>
                          {earning.source && (
                            <p className="text-sm text-white/80 mb-1">Source: {earning.source}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-white">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{earning.date}</span>
                            </div>
                            <span>{earning.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          +{convertAmount(earning.amount, earning.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredEarnings.length === 0 && (
              <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg">
                <div className="p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun gain</h3>
                  <p className="text-white/80">Aucun gain trouvé pour cette période et ce type.</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}