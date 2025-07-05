'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation'; // ✅ Hook pour détecter la route actuelle
import { FaHome, FaCreditCard, FaMoneyBill, FaShoppingCart, FaUser } from 'react-icons/fa';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const [isLoaded, setIsLoaded] = useState(true);
  const pathname = usePathname(); // ✅ Obtenir le chemin de la page active

  const BOTTOM_TABS = [
    { id: 'dashboard', icon: FaHome, label: 'Tableau de bord', href: '/dashboard/overview' },
    { id: 'deposit', icon: FaCreditCard, label: 'Dépôt', href: '/dashboard/deposit' },
    { id: 'withdraw', icon: FaMoneyBill, label: 'Retrait', href: '/dashboard/withdraw' },
    { id: 'invest', icon: FaShoppingCart, label: 'Achat', href: '/dashboard/invest' },
    { id: 'profile', icon: FaUser, label: 'Mon', href: '/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  from-red-600 via-red-600 to-red-600 relative overflow-hidden">
      {children}

      {/* ✅ Barre de menu fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-black/50 border-t border-red-500/30 backdrop-blur-lg">
          <div className="flex justify-around items-center py-4">
            {BOTTOM_TABS.map((tab, index) => {
              const isActive = pathname === tab.href; // ✅ Vérifie si la page actuelle correspond au lien du bouton

              return (
                <Link key={tab.id} href={tab.href}>
                  <button
                    className={`flex flex-col items-center space-y-2 px-4 py-3 rounded-xl transition-all duration-300
                      ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}
                      ${isActive ? 'bg-white/90 text-red-700 shadow shadow-yellow-400' : 'text-red-300 hover:text-white hover:bg-red-600/30'}`}
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                    aria-label={tab.label}
                  >
                    <tab.icon
                      className={`w-8 h-8 ${isActive ? '' : ''}`} // ⛔️ Suppression de l'animation infinie "animate-float"
                    />
                    <span className="text-sm sm:text-base font-medium">{tab.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ✅ Espace en bas pour ne pas que le contenu soit caché par la barre */}
      <div className="pb-32 md:pb-24"></div>
    </div>
  );
}
