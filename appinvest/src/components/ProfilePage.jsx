'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaUpload, FaUser, FaEye, FaEyeSlash, FaUserShield, FaMobile, FaLock, FaPhone, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [profileData, setProfileData] = useState({
    fullName: '',
    operator: 'mvola',
    withdrawPassword: '',
    avatar: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const storedUserId = localStorage.getItem('userId');
    const userPhone = localStorage.getItem('userPhone');
    
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setUserId(storedUserId || '');
      setProfileData(prev => ({
        ...prev,
        phone: userPhone || ''
      }));
    }
  }, [router]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target?.result
        }));
      };
      reader.readAsDataURL(file);
      toast.success('Photo de profil mise à jour');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation de la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (profileData.fullName) {
      localStorage.setItem('userFullName', profileData.fullName);
    }
    if (profileData.phone) {
      localStorage.setItem('userPhone', profileData.phone);
    }
    
    toast.success('Profil mis à jour avec succès !');
    setIsLoading(false);
  };

  const handleCancel = () => {
    setProfileData({
      fullName: '',
      operator: 'mvola',
      withdrawPassword: '',
      avatar: '',
      phone: localStorage.getItem('userPhone') || ''
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-red-600 p-4  from-red-600 via-red-600 to-red-600">
      <div className="max-w-md mx-auto bg-red-600">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <button className="text-green-600 hover:bg-green-100 px-3 py-1 rounded-md flex items-center text-sm">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </button>
          </Link>
        </div>

        <div className="text-center mb-8  bg-red-600">
          <h1 className="text-2xl font-bold text-gray-800">MON PROFIL</h1>
        </div>

        <div className=" bg-red-300 rounded-lg shadow-md p-4">
          {/* Avatar */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUser className="w-10 h-10 text-gray-500" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 cursor-pointer transition-colors">
                <FaUpload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">USER ID</label>
              <div className="relative mt-1">
                <input
                  value={userId}
                  readOnly
                  className="w-full  bg-red-300 text-gray-600 border border-gray-400 rounded-md p-2 pl-10"
                />
                <FaUserShield className="absolute left-3 top-2.5 text-green-600 w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Généré automatiquement à l'inscription</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Votre nom et prénom</label>
              <div className="relative mt-1">
                <input
                  placeholder="Entrer votre nom et prénom"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full border border-gray-400 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <FaUser className="absolute left-3 top-2.5 text-green-600 w-5 h-5" />
              </div>
            </div>

            {/* Operator and Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Opérateur et numéro</label>
              <div className="relative mt-1 flex space-x-2">
                <input
                  type="tel"
                  placeholder="034 XX XXX XX"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-1/2 border border-gray-400 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <select
                  value={profileData.operator}
                  onChange={(e) => setProfileData(prev => ({ ...prev, operator: e.target.value }))}
                  className="w-1/2 border border-gray-400 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="mvola">MVola</option>
                  <option value="airtel">Airtel Money</option>
                  <option value="orange">Orange Money</option>
                </select>
                <FaMobile className="absolute left-3 top-2.5 text-green-600 w-5 h-5" />
              </div>
            </div>

            {/* Withdraw Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe de retrait</label>
              <div className="relative mt-1">
                <input
                  type={showWithdrawPassword ? "text" : "password"}
                  placeholder="Entrer mot de passe de retrait"
                  value={profileData.withdrawPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, withdrawPassword: e.target.value }))}
                  className="w-full border border-gray-400 rounded-md p-2 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <FaLock className="absolute left-3 top-2.5 text-green-600 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowWithdrawPassword(!showWithdrawPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showWithdrawPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Withdraw Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmer mot de passe de retrait</label>
              <div className="relative mt-1">
                <input
                  type={showWithdrawPassword ? "text" : "password"}
                  placeholder="Confirmer mot de passe de retrait"
                  value={profileData.withdrawPassword}
                  onChange={(e) => setProfileData(prev => ({ ...prev, withdrawPassword: e.target.value }))}
                  className="w-full border border-gray-400 rounded-md p-2 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <FaLock className="absolute left-3 top-2.5 text-green-600 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowWithdrawPassword(!showWithdrawPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showWithdrawPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                type="submit"
                className={`w-full py-2 rounded-md bg-blue-500 text-white hover:bg-green-600 flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                <FaCheck className="mr-2" /> Confirmer
              </button>
              <button
                type="button"
                className="w-full py-2 rounded-md bg-red-500 text-white hover:bg-green-600 flex items-center justify-center"
                onClick={handleCancel}
              >
                <FaTimes className="mr-2" /> Annuler
              </button>
            </div>
            <Link href="/change-password">
              <button className="w-full mt-2 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 flex items-center justify-center">
                <FaLock className="mr-2" /> Modifier les mots de passe du connexion
              </button>
            </Link>
          </form>

          {/* Bottom padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}