'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaCreditCard, FaMoneyBill, FaShoppingCart, FaUser, FaQuestionCircle, FaHistory, FaBuilding, FaBullseye, FaShoppingBag, FaExchangeAlt, FaChartLine, FaSignOutAlt, FaUsers, FaStar, FaBolt } from 'react-icons/fa';
import Link from 'next/link';

const starCount = 15;
const stars = Array.from({ length: starCount }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 3}s`,
  animationDuration: `${3 + Math.random() * 2}s`
}));

const DASHBOARD_ITEMS = [
  { id: 'faq', icon: FaQuestionCircle, label: 'FAQ', href: '/faq', type: 'square', color: 'from-blue-500 to-blue-600' },
  { id: 'history', icon: FaHistory, label: 'Historique de transaction', href: '/history', type: 'square', color: 'from-purple-500 to-purple-600' },
  { id: 'company', icon: FaBuilding, label: 'Profil entreprise', href: '/company', type: 'square', color: 'from-indigo-500 to-indigo-600' },
  { id: 'microtasks', icon: FaBullseye, label: 'Micro-tâches', href: '/microtasks', type: 'square', color: 'from-pink-500 to-pink-600' },
  { id: 'buypoints', icon: FaShoppingBag, label: 'Acheter des points', href: '/points/buy', type: 'square', color: 'from-orange-500 to-orange-600' },
  { id: 'exchange', icon: FaExchangeAlt, label: 'Échanger des points', href: '/points/exchange', type: 'square', color: 'from-teal-500 to-teal-600' },
  { id: 'earnings', icon: FaChartLine, label: 'Historique des gains', href: '/earnings', type: 'square', color: 'from-green-500 to-green-600' },
  { id: 'logout', icon: FaSignOutAlt, label: 'Déconnexion', href: '/', type: 'square', color: 'from-red-500 to-red-600' },
  { id: 'team', icon: FaUsers, label: 'Équipe et Groupe', href: '/team', type: 'square', color: 'from-cyan-500 to-cyan-600' },
];

const BOTTOM_TABS = [
  { id: 'dashboard', icon: FaHome, label: 'Tableau de bord', href: '/dashboard/overview' },
  { id: 'deposit', icon: FaCreditCard, label: 'Dépôt', href: '/deposit' },
  { id: 'withdraw', icon: FaMoneyBill, label: 'Retrait', href: '/withdraw' },
  { id: 'invest', icon: FaShoppingCart, label: 'Achat', href: '/invest' },
  { id: 'profile', icon: FaUser, label: 'Mon', href: '/profile' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userId');
    router.push('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center">
        <div className="text-white animate-pulse">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          Chargement<span className="loading-dots"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-700 to-red-700 animate-gradient" />
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration
            }}
          >
            <FaStar className="w-3 h-3 text-emerald-300 opacity-60 md:w-4 md:h-4" />
          </div>
        ))}
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8">
        <div className={`text-center mb-10 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}>
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight animate-pulse">
              McDonald's Investa
            </h1>
            <div className="absolute -top-2 -right-8">
              <FaBolt className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
          </div>
          <p className="text-emerald-300 text-lg sm:text-xl md:text-2xl mt-4 animate-pulse">
            Espace Membre
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-12">
          {DASHBOARD_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-xl border-4 border-red-600 p-4 text-center transform hover:scale-105 transition-all duration-300 ${
                isLoaded ? 'animate-bounce-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link href={item.href} onClick={item.id === 'logout' ? handleLogout : undefined}>
                <div className="space-y-2 group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto shadow-lg hover:rotate-6 transition-all duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-red-900 text-xs font-semibold leading-tight group-hover:text-red-600 transition-colors duration-300">
                    {item.label}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="bg-black/50 border-t border-red-500/30 backdrop-blur-lg">
            <div className="flex justify-around items-center py-4">
              {BOTTOM_TABS.map((tab, index) => (
                <Link key={tab.id} href={tab.href}>
                  <button
                    className={`flex flex-col items-center space-y-2 text-red-300 hover:text-white hover:bg-red-600/30 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                    } ${tab.href === '/dashboard/overview' ? 'bg-red-600/30 text-white' : ''}`}
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                    aria-label={tab.label}
                  >
                    <tab.icon className="w-8 h-8 animate-float" style={{ animationDelay: `${index * 0.2}s` }} />
                    <span className="text-sm sm:text-base font-medium">{tab.label}</span>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="pb-32 md:pb-24"></div>
      </div>
    </div>
  );
}