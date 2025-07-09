"use client";

import {
  FaUsers,
  FaMoneyCheckAlt,
  FaWallet,
  FaChartLine,
  FaHourglassHalf,
  FaCheckCircle,
  FaHamburger,
  FaUserPlus, // Pour Utilisateur invest
  FaUserTimes, // Pour Utilisateur non-invest
  FaDollarSign, // Pour Soldes total, Total payé, Dépôt total, Échanges des points
} from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Tableau de bord</h2>

      {/* Statistiques - Toutes les cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
        {/* Total utilisateurs */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaUsers className="text-white/70 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Total utilisateurs</h3>
            <p className="text-2xl font-bold text-white">1,247</p>
          </div>
        </div>

        {/* Utilisateur invest */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaUserPlus className="text-green-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Utilisateur invest</h3>
            <p className="text-2xl font-bold text-green-400">450</p>
          </div>
        </div>

        {/* Utilisateur non-invest */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaUserTimes className="text-yellow-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Utilisateur non-invest</h3>
            <p className="text-2xl font-bold text-yellow-400">300</p>
          </div>
        </div>

        {/* Investissement actif */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaChartLine className="text-blue-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Investissement actif</h3>
            <p className="text-2xl font-bold text-blue-400">856</p>
          </div>
        </div>

        {/* Soldes total des utilisateurs */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaDollarSign className="text-green-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Soldes total</h3>
            <p className="text-2xl font-bold text-green-400">2.5M Ar</p>
          </div>
        </div>

        {/* Total payé */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaDollarSign className="text-yellow-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Total payé</h3>
            <p className="text-2xl font-bold text-yellow-400">1.2M Ar</p>
          </div>
        </div>

        {/* Dépôt total utilisateur */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaMoneyCheckAlt className="text-blue-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Dépôt total</h3>
            <p className="text-2xl font-bold text-blue-400">1.8M Ar</p>
          </div>
        </div>

        {/* Échanges des points en argent */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-center">
            <FaDollarSign className="text-purple-400 text-2xl mx-auto mb-2" />
            <h3 className="text-white/80 text-sm">Échanges points</h3>
            <p className="text-2xl font-bold text-purple-400">100,000 Ar</p>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6">
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

      {/* Tableau statique avec diagrammes */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <h3 className="text-white text-lg mb-4">Statistiques mensuelles 2025</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2 text-left">Catégorie</th>
                <th className="py-2 text-right">Jan</th>
                <th className="py-2 text-right">Fév</th>
                <th className="py-2 text-right">Mar</th>
                <th className="py-2 text-right">Avr</th>
                <th className="py-2 text-right">Mai</th>
                <th className="py-2 text-right">Juin</th>
                <th className="py-2 text-right">Juil</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/20">
                <td className="py-2">Utilisateurs inscrits</td>
                <td className="py-2 text-right">50</td>
                <td className="py-2 text-right">60</td>
                <td className="py-2 text-right">70</td>
                <td className="py-2 text-right">80</td>
                <td className="py-2 text-right">90</td>
                <td className="py-2 text-right">100</td>
                <td className="py-2 text-right">120</td>
              </tr>
              <tr className="border-b border-white/20">
                <td className="py-2">Retrait mensuel</td>
                <td className="py-2 text-right">10,000 Ar</td>
                <td className="py-2 text-right">15,000 Ar</td>
                <td className="py-2 text-right">20,000 Ar</td>
                <td className="py-2 text-right">25,000 Ar</td>
                <td className="py-2 text-right">30,000 Ar</td>
                <td className="py-2 text-right">35,000 Ar</td>
                <td className="py-2 text-right">40,000 Ar</td>
              </tr>
              <tr>
                <td className="py-2">Dépôt mensuel</td>
                <td className="py-2 text-right">20,000 Ar</td>
                <td className="py-2 text-right">25,000 Ar</td>
                <td className="py-2 text-right">30,000 Ar</td>
                <td className="py-2 text-right">35,000 Ar</td>
                <td className="py-2 text-right">40,000 Ar</td>
                <td className="py-2 text-right">45,000 Ar</td>
                <td className="py-2 text-right">50,000 Ar</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-white/80 text-sm mt-4">
          Note : Les données sont des estimations pour 2025. Un diagramme visuel peut être ajouté avec une bibliothèque comme Chart.js pour une meilleure représentation.
        </p>
      </div>
    </div>
  );
}