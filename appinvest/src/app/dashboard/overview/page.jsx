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
        return 'bg-green-200 text-green-900 border-green-300';
      case 'pending':
        return 'bg-yellow-200 text-yellow-900 border-yellow-300';
      case 'failed':
        return 'bg-red-200 text-red-900 border-red-300';
      default:
        return 'bg-gray-200 text-gray-900 border-gray-300';
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
        return `Retrait de ${amount} ${getStatusText(transaction.status)} (Ref: ${ref}, ${dateTime})`;
      case 'deposit':
        return `Dépôt de ${amount} ${getStatusText(transaction.status)} (Ref: ${ref}, ${dateTime})`;
      case 'investment':
        return `Investissement de ${amount} réussi sur BURGER 1 (Ref: ${ref}, ${dateTime})`;
      default:
        return `Transaction ${amount} ${getStatusText(transaction.status)} (Ref: ${ref}, ${dateTime})`;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-900 to-red-500 animate-gradient" />
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
            <FaStar className="w-3 h-3 text-yellow-300 opacity-70 md:w-4 md:h-4" />
          </div>
        ))}
      </div>
      <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-center mb-8 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <button
                className="flex items-center px-4 py-3 text-lg font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md"
                aria-label="Retour au tableau de bord"
              >
                <FaArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </button>
            </Link>
          </div>
          <div className={`text-center mb-10 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight animate-pulse">
              Tableau de Bord
            </h1>
            <div className="flex items-center justify-center space-x-6 mt-6">
              <button
                onClick={() => setCurrency('Ar')}
                className={`text-lg sm:text-xl font-semibold transition-all duration-300 ${
                  currency === 'Ar' ? 'text-white' : 'text-white/50'
                } hover:text-white`}
                aria-label="Afficher en Ariary"
              >
                Ar
              </button>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={currency === 'USDT'}
                  onChange={(e) => setCurrency(e.target.checked ? 'USDT' : 'Ar')}
                  className="appearance-none w-16 h-8 bg-gray-300 rounded-full checked:bg-yellow-500 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  aria-label="Basculer entre Ariary et USDT"
                />
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${
                    currency === 'USDT' ? 'translate-x-8' : ''
                  } shadow-md`}
                />
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                </div>
              </div>
              <button
                onClick={() => setCurrency('USDT')}
                className={`text-lg sm:text-xl font-semibold transition-all duration-300 ${
                  currency === 'USDT' ? 'text-white' : 'text-white/50'
                } hover:text-white`}
                aria-label="Afficher en USDT"
              >
                USDT
              </button>
            </div>
            <p className="mt-4 text-white/80 text-sm sm:text-base animate-pulse">
              5 000 Ar = 1 USDT
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            <div
              className={`bg-white rounded-xl shadow-xl border-4 border-red-600 p-6 transform hover:scale-105 transition-all duration-300 ${
                isLoaded ? 'animate-slide-in-right' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <FaWallet className="w-8 h-8 text-red-600 animate-float" />
                    <p className="text-red-600 font-bold text-base sm:text-lg">
                      Solde Principal
                    </p>
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 animate-pulse">
                    {convertAmount(balanceData.mainBalance)} {currency}
                  </p>
                </div>
                <Link href="/withdraw">
                  <button
                    className="mt-4 sm:mt-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg font-semibold"
                    aria-label="Effectuer un retrait"
                  >
                    <FaMoneyBill className="w-5 h-5 mr-2 inline-block" />
                    Retrait
                  </button>
                </Link>
              </div>
            </div>
            <div
              className={`bg-white rounded-xl shadow-xl border-4 border-red-600 p-6 transform hover:scale-105 transition-all duration-300 ${
                isLoaded ? 'animate-slide-in-left' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <FaCoins className="w-8 h-8 text-red-600 animate-bounce" />
                    <p className="text-red-600 font-bold text-base sm:text-lg">
                      Solde Points
                    </p>
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">
                    {balanceData.pointsBalance} points
                  </p>
                </div>
                <Link href="/points/exchange">
                  <button
                    className="mt-4 sm:mt-0 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-5 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg font-semibold"
                    aria-label="Échanger des points"
                  >
                    <FaExchangeAlt className="w-5 h-5 mr-2 inline-block" />
                    Échanger
                  </button>
                </Link>
              </div>
            </div>
            <div
              className={`bg-white rounded-xl shadow-xl border-4 border-red-600 p-6 transform hover:scale-105 transition-all duration-300 ${
                isLoaded ? 'animate-slide-in-right' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.6s' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <FaChartLine className="w-8 h-8 text-red-600 animate-pulse" />
                    <p className="text-red-600 font-bold text-base sm:text-lg">
                      Investissements
                    </p>
                  </div>
                  <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 animate-pulse">
                    {convertAmount(balanceData.investmentAmount)} {currency}
                  </p>
                </div>
                <Link href="/invest">
                  <button
                    className="mt-4 sm:mt-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg font-semibold"
                    aria-label="Investir"
                  >
                    <FaCreditCard className="w-5 h-5 mr-2 inline-block" />
                    Investir
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div
            className={`bg-white rounded-xl shadow-xl border-4 border-red-600 p-6 md:p-8 ${
              isLoaded ? 'animate-slide-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.8s' }}
          >
            <div className="mb-6">
              <h2 className="text-red-600 text-xl sm:text-2xl font-bold flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse" />
                <span>Statut des Transactions</span>
              </h2>
            </div>
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 md:gap-4">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className={`flex flex-col md:flex-row md:items-center md:space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in-left`}
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(
                      transaction.status
                    )} animate-pulse mb-2 md:mb-0 md:w-24 text-center`}
                    aria-live="polite"
                  >
                    {getStatusText(transaction.status)}
                  </span>
                  <p className="text-sm sm:text-base text-gray-800 flex-1">
                    {getTransactionMessage(transaction)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="pb-32 md:pb-24" />
        </div>
      </div>
    </div>
  );
}