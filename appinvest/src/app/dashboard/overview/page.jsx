'use client';

import { useState, useEffect } from 'react';
import { FaMoneyBill, FaExchangeAlt, FaCreditCard, FaArrowLeft, FaChartLine, FaWallet, FaCoins, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const starCount = 12;
const stars = Array.from({ length: starCount }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 3}s`,
  animationDuration: `${3 + Math.random() * 2}s`,
}));

export default function DashboardOverview() {
  const [currency, setCurrency] = useState('Ar');
  const [isLoaded, setIsLoaded] = useState(false);
  const [balanceData, setBalanceData] = useState({
    mainBalance: 58000,
    pointsBalance: 150,
    investmentAmount: 250000,
  });
  const router = useRouter();

  const [transactions] = useState([
    {
      id: '789553',
      type: 'withdraw',
      status: 'pending',
      amount: 10000,
      currency: 'Ar',
      reference: '789553',
      date: '25 juin 2025',
      time: '10:00',
    },
    {
      id: '789963',
      type: 'deposit',
      status: 'success',
      amount: 50000,
      currency: 'Ar',
      reference: '789963',
      date: '25 juin 2025',
      time: '10:17',
    },
    {
      id: '189963',
      type: 'investment',
      status: 'success',
      amount: 100000,
      currency: 'Ar',
      reference: '189963',
      date: '24 juin 2025',
      time: '15:30',
    },
  ]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const convertAmount = (amount) => {
    if (currency === 'USDT') {
      return (amount / 5000).toFixed(2);
    }
    return amount.toLocaleString();
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

  const getTransactionMessage = (transaction) => {
    const amount = `${convertAmount(transaction.amount)} ${currency}`;
    const ref = transaction.reference;
    const dateTime = `${transaction.time}, ${transaction.date}`;

    switch (transaction.type) {
      case 'withdraw':
        return `Votre demande de retrait de ${amount} est ${getStatusText(transaction.status)} ref: ${ref} à ${dateTime}`;
      case 'deposit':
        return `Dépôt de ${amount} ${getStatusText(transaction.status)} ref: ${ref} à ${dateTime}`;
      case 'investment':
        return `Investissement de ${amount} réussi sur BURGER 1 ref: ${ref} à ${dateTime}`;
      default:
        return `Transaction ${amount} ${getStatusText(transaction.status)} ref: ${ref} à ${dateTime}`;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700 animate-gradient" />
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration,
            }}
          >
            <FaStar className="w-2 h-2 text-yellow-300 opacity-70" />
          </div>
        ))}
      </div>
      <div className="relative z-10 p-4">
        <div className="max-w-md mx-auto">
          <div className={`flex items-center mb-6 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <button className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-300">
                <FaArrowLeft className="w-4 h-4 mr-2 inline-block" />
                Retour
              </button>
            </Link>
          </div>
          <div className={`text-center mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <h1 className="text-4xl font-bold text-white mb-4 animate-pulse">DASHBOARD</h1>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <span
                className={`font-semibold transition-all duration-300 ${
                  currency === 'Ar' ? 'text-white text-lg' : 'text-white/60'
                }`}
              >
                Ar
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={currency === 'USDT'}
                  onChange={(e) => setCurrency(e.target.checked ? 'USDT' : 'Ar')}
                  className="appearance-none w-12 h-6 bg-gray-300 rounded-full checked:bg-yellow-400 cursor-pointer relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                    currency === 'USDT' ? 'translate-x-6' : ''
                  }`}
                />
                <div className="absolute -top-1 -right-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                </div>
              </div>
              <span
                className={`font-semibold transition-all duration-300 ${
                  currency === 'USDT' ? 'text-white text-lg' : 'text-white/60'
                }`}
              >
                USDT
              </span>
            </div>
            <p className="text-white/80 text-sm animate-pulse">5 000 Ar = 1 USDT</p>
          </div>
          <div className="space-y-6 mb-8">
            <div
              className={`bg-white/90 rounded-lg shadow-lg hover:shadow-xl border-4 border-red-600 p-6 transform hover:scale-105 transition-all duration-300 ${
                isLoaded ? 'animate-slide-in-right' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaWallet className="w-5 h-5 text-red-600 animate-float" />
                    <p className="text-red-600 font-semibold text-sm">SOLDE PRINCIPAL</p>
                  </div>
                  <p className="text-4xl font-bold text-gray-900 animate-pulse">
                    {convertAmount(balanceData.mainBalance)} {currency}
                  </p>
                </div>
                <Link href="/withdraw">
                  <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
                    <FaMoneyBill className="w-4 h-4 mr-1 inline-block" />
                    RETRAIT
                  </button>
                </Link>
              </div>
            </div>
            <div
              className={`bg-white/90 rounded-lg shadow-lg hover:shadow-xl border-4 border-red-600 p-6 transform hover:scale-105 transition-all duration-300 ${
                isLoaded ? 'animate-slide-in-left' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaCoins className="w-5 h-5 text-red-600 animate-bounce" />
                    <p className="text-red-600 font-semibold text-sm">SOLDE POINTS</p>
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">
                    {balanceData.pointsBalance} points
                  </p>
                </div>
                <Link href="/points/exchange">
                  <button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
                    <FaExchangeAlt className="w-4 h-4 mr-1 inline-block" />
                    ÉCHANGER
                  </button>
                </Link>
              </div>
            </div>
            <div
              className={`bg-white/90 rounded-lg shadow-lg hover:shadow-xl border-4 border-red-600 p-6 transform hover:scale-105 transition-all duration-300 ${
                isLoaded ? 'animate-slide-in-right' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.6s' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaChartLine className="w-5 h-5 text-red-300 animate-pulse" />
                    <p className="text-red-600 font-semibold text-sm">INVESTISSEMENTS</p>
                  </div>
                  <p className="text-4xl font-bold text-gray-900 animate-pulse">
                    {convertAmount(balanceData.investmentAmount)} {currency}
                  </p>
                </div>
                <Link href="/invest">
                  <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
                    <FaCreditCard className="w-4 h-4 mr-1 inline-block" />
                    INVESTIR
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div
            className={`bg-white/90 rounded-lg shadow-lg border-4 border-red-600 p-6 ${
              isLoaded ? 'animate-slide-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.8s' }}
          >
            <div className="mb-4">
              <h2 className="text-red-600 text-lg font-semibold flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <span>Statut des Transactions</span>
              </h2>
            </div>
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg bg-gray-50 transform hover:scale-105 transition-all duration-300 animate-slide-in-left`}
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  <span
                    className={`px-2 py-1 rounded text-xs border animate-pulse ${getStatusColor(transaction.status)}`}
                  >
                    {getStatusText(transaction.status)}
                  </span>
                  <p className="text-sm text-gray-700 flex-1">{getTransactionMessage(transaction)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pb-24" />
        </div>
      </div>
    </div>
  );
}