'use client';

import { useState, useEffect } from 'react';
import { FaMoneyBill, FaExchangeAlt, FaCreditCard, FaArrowLeft, FaChartLine, FaWallet, FaCoins, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const starCount = 12;
const stars = Array.from({ length: starCount }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
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
      <div className="absolute inset-0 bg-gradient-to-br  from-red-600 via-red-600 to-red-600" />
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: star.left,
              top: star.top,
            }}
          >
            <FaStar className="w-2 h-2 text-yellow-300 opacity-70 sm:w-3 sm:h-3 md:w-4 md:h-4" />
          </div>
        ))}
      </div>
      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/dashboard">
              <button
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md sm:px-4 sm:py-3 sm:text-base"
                aria-label="Retour au tableau de bord"
              >
                <FaArrowLeft className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                Retour
              </button>
            </Link>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Tableau de Bord
            </h1>
            <div className="flex items-center justify-center space-x-4 mt-4 sm:mt-6">
              <button
                onClick={() => setCurrency('Ar')}
                className={`text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 ${
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
                  className="appearance-none w-12 h-6 bg-gray-300 rounded-full checked:bg-yellow-500 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400 sm:w-14 sm:h-7"
                  aria-label="Basculer entre Ariary et USDT"
                />
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 transform ${
                    currency === 'USDT' ? 'translate-x-6 sm:translate-x-7' : ''
                  } shadow-md`}
                />
                <div className="absolute -top-1 -right-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full sm:w-3 sm:h-3" />
                </div>
              </div>
              <button
                onClick={() => setCurrency('USDT')}
                className={`text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 ${
                  currency === 'USDT' ? 'text-white' : 'text-white/50'
                } hover:text-white`}
                aria-label="Afficher en USDT"
              >
                USDT
              </button>
            </div>
            <p className="mt-3 text-white/80 text-xs sm:text-sm">
              5 000 Ar = 1 USDT
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div
              className="bg-white rounded-lg shadow-lg border-2  border-yellow-400 p-4 sm:p-5 transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <FaWallet className="w-6 h-6 text-red-600 sm:w-7 sm:h-7" />
                    <p className="text-red-600 font-bold text-sm sm:text-base">
                      Solde Principal
                    </p>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
                    {convertAmount(balanceData.mainBalance)} {currency}
                  </p>
                </div>
                <Link href="/withdraw">
                  <button
                    className="mt-3 sm:mt-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                    aria-label="Effectuer un retrait"
                  >
                    <FaMoneyBill className="w-4 h-4 mr-2 inline-block sm:w-5 sm:h-5" />
                    Retrait
                  </button>
                </Link>
              </div>
            </div>
            <div
              className="bg-white rounded-lg shadow-lg border-2  border-yellow-400 p-4 sm:p-5 transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <FaCoins className="w-6 h-6 text-red-600 sm:w-7 sm:h-7" />
                    <p className="text-red-600 font-bold text-sm sm:text-base">
                      Solde Points
                    </p>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">
                    {balanceData.pointsBalance} points
                  </p>
                </div>
                <Link href="/points/exchange">
                  <button
                    className="mt-3 sm:mt-0 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                    aria-label="Échanger des points"
                  >
                    <FaExchangeAlt className="w-4 h-4 mr-2 inline-block sm:w-5 sm:h-5" />
                    Échanger
                  </button>
                </Link>
              </div>
            </div>
            <div
              className="bg-white rounded-lg shadow-lg border-2  border-yellow-400 p-4 sm:p-5 transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <FaChartLine className="w-6 h-6 text-red-600 sm:w-7 sm:h-7" />
                    <p className="text-red-600 font-bold text-sm sm:text-base">
                      Investissements
                    </p>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
                    {convertAmount(balanceData.investmentAmount)} {currency}
                  </p>
                </div>
                <Link href="/invest">
                  <button
                    className="mt-3 sm:mt-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                    aria-label="Investir"
                  >
                    <FaCreditCard className="w-4 h-4 mr-2 inline-block sm:w-5 sm:h-5" />
                    Investir
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-lg shadow-lg border-2  border-yellow-400 p-4 sm:p-6 md:p-8"
          >
            <div className="mb-4 sm:mb-6">
              <h2 className="text-red-600 text-lg sm:text-xl md:text-2xl font-bold flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full sm:w-4 sm:h-4" />
                <span>Statut des Transactions</span>
              </h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col md:flex-row md:items-center md:space-x-3 p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span
                    className={`px-2 py-1 rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(
                      transaction.status
                    )} mb-2 md:mb-0 md:w-20 text-center`}
                    aria-live="polite"
                  >
                    {getStatusText(transaction.status)}
                  </span>
                  <p className="text-xs sm:text-sm md:text-base text-gray-800 flex-1">
                    {getTransactionMessage(transaction)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="pb-16 sm:pb-20 md:pb-24" />
        </div>
      </div>
    </div>
  );
}