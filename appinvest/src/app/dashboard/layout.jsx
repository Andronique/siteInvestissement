'use client';
import { useState } from 'react';
import { FaHome, FaCreditCard, FaMoneyBill, FaShoppingCart, FaUser } from 'react-icons/fa';
import Link from 'next/link';
export default function DashboardLayout({ children }) {
         const [isLoaded, setIsLoaded] = useState(true);
        const BOTTOM_TABS = [
          { id: 'dashboard', icon: FaHome, label: 'Tableau de bord', href: '/dashboard/overview' },
          { id: 'deposit', icon: FaCreditCard, label: 'Dépôt', href: '/dashboard/deposit' },
          { id: 'withdraw', icon: FaMoneyBill, label: 'Retrait', href: '/dashboard/withdraw' },
          { id: 'invest', icon: FaShoppingCart, label: 'Achat', href: '/dashboard/invest' },
          { id: 'profile', icon: FaUser, label: 'Mon', href: '/dashboard/profile' },
        ];
  return (
   <div>
        {children}
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
      <div className="pb-32 md:pb-24 bg-gradient-to-br from-red-700 via-red-700 to-red-700 animate-gradient"></div>
   </div>
  );
}