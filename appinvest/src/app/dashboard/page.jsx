'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaHome, FaCreditCard, FaMoneyBill,
  FaShoppingCart, FaUser, FaQuestionCircle, FaHistory, FaBuilding,
  FaBullseye, FaShoppingBag, FaExchangeAlt, FaChartLine, FaSignOutAlt, FaUsers, FaStar, FaBolt
} from 'react-icons/fa';
import Link from 'next/link';

const starCount = 15;
const stars = Array.from({ length: starCount }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 3}s`,
  animationDuration: `${3 + Math.random() * 2}s`
}));

const DASHBOARD_ITEMS = [
  { id: 'faq', icon: FaQuestionCircle, label: 'FAQ', href: '/faq', type: 'square', color: 'from-yellow-400 to-yellow-500' },
  { id: 'history', icon: FaHistory, label: 'Historique de transaction', href: '/history', type: 'square', color: 'from-purple-500 to-purple-600' },
  { id: 'company', icon: FaBuilding, label: 'Profil entreprise', href: '/company', type: 'square', color: 'from-indigo-500 to-indigo-600' },
  { id: 'microtasks', icon: FaBullseye, label: 'Micro-tâches', href: '/microtasks', type: 'square', color: 'from-pink-500 to-pink-600' },
  { id: 'buypoints', icon: FaShoppingBag, label: 'Acheter des points', href: '/points/buy', type: 'square', color: 'from-orange-500 to-orange-600' },
  { id: 'exchange', icon: FaExchangeAlt, label: 'Échanger des points', href: '/points/exchange', type: 'square', color: 'from-teal-500 to-teal-600' },
  { id: 'earnings', icon: FaChartLine, label: 'Historique des gains', href: '/earnings', type: 'square', color: 'from-green-500 to-green-600' },
  { id: 'logout', icon: FaSignOutAlt, label: 'Déconnexion', href: '/', type: 'square', color: 'from-red-500 to-red-600' },
  { id: 'team', icon: FaUsers, label: 'Équipe et Groupe', href: '/team', type: 'square', color: 'from-cyan-500 to-cyan-600' },
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
          <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          Chargement<span className="loading-dots"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-red-600">
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
            <FaStar className="w-3 h-3 text-yellow-300 opacity-80 md:w-4 md:h-4" />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10">
        <div className={`text-center mb-10 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              McDonald's Investa
            </h1>
            <div className="absolute -top-3 -right-8">
              <FaBolt className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
          </div>
          <p className="text-yellow-300 text-lg sm:text-xl md:text-2xl mt-4">
            Espace Membre
          </p>
        </div>

        {/* Grid stays with 3 per line on medium and above */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
          {DASHBOARD_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white/90 rounded-2xl shadow-xl border border-yellow-400 p-4 text-center transform hover:scale-105 transition-all duration-300 ${
                isLoaded ? 'animate-fade-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link href={item.href} onClick={item.id === 'logout' ? handleLogout : undefined}>
                <div className="space-y-3 group">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-red-800 text-sm font-semibold group-hover:text-yellow-500 transition-colors duration-300">
                    {item.label}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
