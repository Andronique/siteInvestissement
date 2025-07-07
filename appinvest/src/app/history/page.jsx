'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, History, Banknote, CreditCard, ShoppingCart, Coins, ArrowRightLeft, TrendingUp, Calendar, Filter, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SAMPLE_TRANSACTIONS = [
  {
    id: '1',
    type: 'withdrawal',
    amount: 10000,
    currency: 'Ar',
    status: 'pending',
    reference: 'WTH_789553',
    date: '25 juin 2025',
    time: '10:00',
    description: 'Demande de retrait via MVola',
    method: 'MVola',
  },
  {
    id: '2',
    type: 'deposit',
    amount: 50000,
    currency: 'Ar',
    status: 'success',
    reference: 'DEP_789963',
    date: '25 juin 2025',
    time: '10:17',
    description: 'Dépôt via Airtel Money',
    method: 'Airtel Money',
  },
  {
    id: '3',
    type: 'investment',
    amount: 100000,
    currency: 'Ar',
    status: 'success',
    reference: 'INV_189963',
    date: '24 juin 2025',
    time: '15:30',
    description: 'Investissement BURGER 2',
    method: 'BURGER 2',
  },
  {
    id: '4',
    type: 'points_purchase',
    amount: 50,
    currency: 'points',
    status: 'success',
    reference: 'PTS_456789',
    date: '24 juin 2025',
    time: '14:20',
    description: 'Achat de 50 points',
    method: 'Solde principal',
  },
  {
    id: '5',
    type: 'points_exchange',
    amount: 30,
    currency: 'points',
    status: 'success',
    reference: 'EXC_123456',
    date: '23 juin 2025',
    time: '16:45',
    description: 'Échange 30 points contre 3000 Ar',
    method: 'Conversion',
  },
  {
    id: '6',
    type: 'commission',
    amount: 1500,
    currency: 'Ar',
    status: 'success',
    reference: 'COM_987654',
    date: '23 juin 2025',
    time: '09:00',
    description: 'Commission de parrainage niveau 1',
    method: 'Parrainage',
  },
];

const TRANSACTION_TYPES = [
  { id: 'all', label: 'Toutes', icon: History },
  { id: 'withdrawal', label: 'Retraits', icon: Banknote },
  { id: 'deposit', label: 'Dépôts', icon: CreditCard },
  { id: 'investment', label: 'Investissements', icon: ShoppingCart },
  { id: 'points_purchase', label: 'Achat Points', icon: Coins },
  { id: 'points_exchange', label: 'Échange Points', icon: ArrowRightLeft },
  { id: 'commission', label: 'Commissions', icon: TrendingUp },
];

export default function HistoryPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState('Ar');
  const [activeTab, setActiveTab] = useState('all');
  const [transactions] = useState(SAMPLE_TRANSACTIONS);
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
    if (currency === 'Ar' && fromCurrency === 'USDT') {
      return `${(amount * 5000).toLocaleString()} Ar`;
    }
    return fromCurrency === 'Ar' ? `${amount.toLocaleString()} Ar` : `${amount} ${fromCurrency}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Succès';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échec';
      default:
        return status;
    }
  };

  const getTypeIcon = (type) => {
    const typeConfig = TRANSACTION_TYPES.find((t) => t.id === type);
    return typeConfig ? typeConfig.icon : History;
  };

  const filteredTransactions = activeTab === 'all' ? transactions : transactions.filter((t) => t.type === activeTab);

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
              <button className="group flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white
               font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>
            </Link>
            <div className="flex items-center space-x-2">
              <span className={`font-semibold ${currency === 'Ar' ? 'text-emerald-600' : 'text-gray-800'}`}>
                Ar
              </span>
               <label className="relative inline-flex items-center cursor-pointer ml-2 mr-2">
              <input
                type="checkbox"
                checked={currency === 'USDT'}
                onChange={(e) => setCurrency(e.target.checked ? 'USDT' : 'Ar')}
                className="sr-only peer"
              />
               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
               </label>
              <span className={`font-semibold ${currency === 'USDT' ? 'text-emerald-700' : 'text-gray-400'}`}>
                USDT
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-emerald-400 glow">HISTORIQUE</h1>
              <div className="absolute -top-2 -right-8">
                <History className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/80 text-lg mt-2">Historique des Transactions</p>
          </div>

          {/* Filters */}
          <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg mb-6 bg-red-500">
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
              <div className="flex flex-wrap gap-2">
                {TRANSACTION_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setActiveTab(type.id)}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-300 bg-amber-700 ${
                        activeTab === type.id
                          ? 'bg-emerald-600 text-white'
                          : 'border border-emerald-500/30 text-white hover:bg-emerald-600/20'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2 inline" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4 mb-8">
            {filteredTransactions.map((transaction) => {
              const Icon = getTypeIcon(transaction.type);
              return (
                <div key={transaction.id} className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-white">{transaction.description}</h3>
                            <span className={`${getStatusColor(transaction.status)} text-xs px-2 py-1 rounded border`}>
                              {getStatusText(transaction.status)}
                            </span>
                          </div>
                          <p className="text-sm text-white/80 mb-1">Référence: {transaction.reference}</p>
                          {transaction.method && (
                            <p className="text-sm text-white/80 mb-1">Méthode: {transaction.method}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-white/70">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{transaction.date}</span>
                            </div>
                            <span>{transaction.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <p
                          className={`text-lg font-bold ${
                            transaction.type === 'withdrawal' ? 'text-red-500' : 'text-white'
                          }`}
                        >
                          {transaction.type === 'withdrawal' ? '-' : '+'}
                          {convertAmount(transaction.amount, transaction.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredTransactions.length === 0 && (
              <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg">
                <div className="p-12 text-center">
                  <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Aucune transaction</h3>
                  <p className="text-white/80">Aucune transaction trouvée pour cette catégorie.</p>
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