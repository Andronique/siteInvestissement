"use client";

import { useState } from "react";
import Image from "next/image";
import { FaCog as SettingsIcon, FaSignOutAlt as LogOut } from "react-icons/fa";

export default function Header({ admin }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location.href = "/";
  };

  const adminName = admin?.name || "Admin Janson";
  const adminPhoto = admin?.photoUrl || "/admin-profile.jpg";

  return (
    <>
      <header className="flex flex-wrap justify-between items-center mb-6 bg-black/50 backdrop-blur-sm border-b border-white/10 p-4 rounded-lg">
        {/* Profil */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-white">
            <Image
              src={adminPhoto}
              alt={`Profil de ${adminName}`}
              fill
              sizes="50px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className="text-white font-semibold truncate max-w-xs">
            {adminName}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          <button
            className="flex items-center text-white hover:bg-white/20 text-sm p-2 rounded transition"
            onClick={() => alert("Ouvrir paramètres du compte (à implémenter)")}
            aria-label="Paramètres du compte"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>

          <button
            className="flex items-center text-white hover:bg-white/20 text-sm p-2 rounded transition"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Déconnexion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Modal déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirmer la déconnexion
            </h2>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
