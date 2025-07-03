'use client';

import {
  FaUsers,
  FaMoneyCheckAlt,
  FaWallet,
  FaChartLine,
  FaHourglassHalf,
  FaCheckCircle,
  FaHamburger
} from 'react-icons/fa';

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Tableau de bord</h2>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaUsers className="text-white/70 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Utilisateurs totaux</h3>
            <p className="text-2xl font-bold text-white">1,247</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaMoneyCheckAlt className="text-green-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Dépôts validés</h3>
            <p className="text-2xl font-bold text-green-400">1.5M Ar</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaWallet className="text-yellow-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Retraits effectués</h3>
            <p className="text-2xl font-bold text-yellow-400">0.8M Ar</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaChartLine className="text-blue-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Plans actifs</h3>
            <p className="text-2xl font-bold text-blue-400">856</p>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <h3 className="text-white text-lg mb-4">Activité récente</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <span className="flex items-center gap-2 text-white text-sm">
              <FaHourglassHalf className="text-yellow-400" />
              Nouveau dépôt en attente - 50,000 Ar
            </span>
            <span className="text-yellow-400 text-xs">Il y a 5 min</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <span className="flex items-center gap-2 text-white text-sm">
              <FaCheckCircle className="text-green-400" />
              Retrait validé - 25,000 Ar
            </span>
            <span className="text-green-400 text-xs">Il y a 12 min</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <span className="flex items-center gap-2 text-white text-sm">
              <FaHamburger className="text-blue-400" />
              Nouvel investissement BURGER 2
            </span>
            <span className="text-blue-400 text-xs">Il y a 1 heure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
