"use client";

import { useState } from "react";
import {
  FaTh as LayoutDashboard,
  FaUser as UsersIcon,
  FaArrowCircleDown as ArrowDownCircle,
  FaArrowCircleUp as ArrowUpCircle,
  FaStar as Star,
  FaHistory as History,
  FaChartLine as TrendingUp,
  FaDollarSign as DollarSign,
  FaTasks as ListChecks,
  FaUserPlus as UserPlus,
  FaCog as SettingsIcon,
  FaEdit as FileEdit,
  FaLock as Lock,
  FaUserCog as UserCog,
  FaSignOutAlt as LogOut,
  FaBars as MenuIcon,
  FaTimes,
} from "react-icons/fa";

import Dashboard from "../../components/admin/Dashboard";
import Users from "../../components/admin/Users";
import Deposits from "../../components/admin/Deposits";
import Withdrawals from "../../components/admin/Withdrawals";
import Points from "../../components/admin/Points";
import Transactions from "../../components/admin/Transactions";
import Plans from "../../components/admin/Plans";
import Commissions from "../../components/admin/Commissions";
import Microtasks from "../../components/admin/Microtasks";
import Referrals from "../../components/admin/Referrals";
import Settings from "../../components/admin/Settings";
import Content from "../../components/admin/Content";
import Security from "../../components/admin/Security";
import Admins from "../../components/admin/Admins";

import { useRouter } from "next/navigation";
import AdminHeader from "../../app/admin/profile/page.jsx";

export default function AdminPanel() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const router = useRouter();

  // Définit ici l'objet admin pour le profil
  const admin = {
    name: "Admin Janson",
    photoUrl: "/admin-profile.jpg",
  };

  // Données factices (à remplacer par API)
  const users = [ /* ... */ ];
  const deposits = [ /* ... */ ];
  const withdrawals = [ /* ... */ ];
  const points = [ /* ... */ ];
  const transactions = [ /* ... */ ];
  const plans = [ /* ... */ ];
  const commissions = [ /* ... */ ];
  const microtasks = [ /* ... */ ];
  const referrals = [ /* ... */ ];
  const admins = [ /* ... */ ];

  // Menu
  const adminMenuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { id: "users", icon: UsersIcon, label: "Utilisateurs" },
    { id: "deposits", icon: ArrowDownCircle, label: "Dépôts" },
    { id: "withdrawals", icon: ArrowUpCircle, label: "Retraits" },
    { id: "points", icon: Star, label: "Points" },
    { id: "transactions", icon: History, label: "Transactions" },
    { id: "plans", icon: TrendingUp, label: "Plans d'investissement" },
    { id: "commissions", icon: DollarSign, label: "Gains/Commissions" },
    { id: "microtasks", icon: ListChecks, label: "Micro-tâches" },
    { id: "referrals", icon: UserPlus, label: "Parrainage/Affiliés" },
    { id: "settings", icon: SettingsIcon, label: "Réglages système" },
    { id: "content", icon: FileEdit, label: "Pages et contenus" },
    { id: "security", icon: Lock, label: "Sécurité" },
    { id: "admins", icon: UserCog, label: "Gestion multi-admin" },
  ];

  // Handlers simplifiés
  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex">
      {/* Bouton menu mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Fermer le menu latéral" : "Ouvrir le menu latéral"}
        className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {isSidebarOpen ? <FaTimes className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-black/70 backdrop-blur-sm border-r border-white/10 transform
          w-64 z-30 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="p-4 flex flex-col h-full justify-between">
          <div>
            {/* Logo */}
            <div className="mb-6 flex items-center justify-center">
              <img src="/Logoe.png" alt="Admin Panel Logo" className="w-20 h-auto" />
            </div>

            {/* Menu */}
            <nav className="space-y-2">
              {adminMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center w-full text-white hover:bg-white/20 rounded p-2 text-sm sm:text-base transition
                    ${activeSection === item.id ? "bg-white/20 font-semibold" : ""}`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}

              {/* Bouton Déconnexion */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center w-full text-red-500 hover:bg-red-600/20 rounded p-2 text-sm sm:text-base mt-6 transition"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Déconnexion
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
        {/* Header */}
        <AdminHeader admin={admin} />

        {/* Contenu des sections */}
        <section>
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "users" && <Users users={users} handleUserAction={() => {}} />}
          {activeSection === "deposits" && <Deposits deposits={deposits} handleDepositAction={() => {}} />}
          {activeSection === "withdrawals" && <Withdrawals withdrawals={withdrawals} handleWithdrawalAction={() => {}} />}
          {activeSection === "points" && <Points points={points} handlePointAction={() => {}} />}
          {activeSection === "transactions" && <Transactions transactions={transactions} handleTransactionAction={() => {}} />}
          {activeSection === "plans" && <Plans plans={plans} handlePlanAction={() => {}} />}
          {activeSection === "commissions" && <Commissions commissions={commissions} handleCommissionAction={() => {}} />}
          {activeSection === "microtasks" && <Microtasks microtasks={microtasks} handleMicrotaskAction={() => {}} />}
          {activeSection === "referrals" && <Referrals referrals={referrals} handleReferralAction={() => {}} />}
          {activeSection === "settings" && <Settings />}
          {activeSection === "content" && <Content />}
          {activeSection === "security" && <Security />}
          {activeSection === "admins" && <Admins admins={admins} handleAdminAction={() => {}} />}
        </section>
      </main>

      {/* Modal de confirmation Déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirmer la déconnexion</h2>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
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
    </div>
  );
}
