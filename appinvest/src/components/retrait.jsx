'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaPaste } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'Ar', // Par défaut Ar
    phoneNumber: '', // Pour Ar
    operator: 'Orange Money', // Par défaut Orange Money
    walletAddress: '', // Pour USDT
    balanceAr: 4500, // Solde en Ar
    balanceUsdt: 1, // Solde en USDT
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      setFormData({ ...formData, walletAddress: text });
      toast.success('Adresse collée !');
    }).catch(() => toast.error('Échec de la copie.'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.amount) {
      toast.error('Veuillez saisir un montant.');
      setIsLoading(false);
      return;
    }

    if (isNaN(formData.amount) || formData.amount <= 0) {
      toast.error('Veuillez entrer un montant valide.');
      setIsLoading(false);
      return;
    }

    const maxBalance = formData.currency === 'Ar' ? formData.balanceAr : formData.balanceUsdt;
    if (formData.amount > maxBalance) {
      toast.error(`Montant supérieur au solde disponible (${maxBalance} ${formData.currency}).`);
      setIsLoading(false);
      return;
    }

    if (formData.currency === 'Ar') {
      if (!formData.phoneNumber) {
        toast.error('Veuillez saisir un numéro de téléphone.');
        setIsLoading(false);
        return;
      }
      const phoneRegex = /^\+?\d{9,12}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
        toast.error('Numéro de téléphone invalide.');
        setIsLoading(false);
        return;
      }
    } else if (formData.currency === 'USDT') {
      if (!formData.walletAddress) {
        toast.error('Veuillez saisir une adresse de portefeuille.');
        setIsLoading(false);
        return;
      }
      if (formData.walletAddress.length < 26 || !/^[a-zA-Z0-9]+$/.test(formData.walletAddress)) {
        toast.error('Adresse de portefeuille invalide.');
        setIsLoading(false);
        return;
      }
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulation
      toast.success('Retrait validé avec succès !');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-600 to-red-600 relative overflow-hidden">
      {/* Particules flottantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                Math.random() > 0.5 ? 'bg-yellow-300' : 'bg-white'
              } opacity-60`}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Bouton Retour en haut à gauche */}
          <div className="absolute top-4 left-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-yellow-300 hover:text-yellow-200 font-medium transition-colors duration-300"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </div>

          {/* Première section : Titre Retrait */}
          <div
            className={`bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 text-center transform transition-all duration-500 ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <h2 className="text-3xl font-bold text-yellow-300">Retrait</h2>
          </div>

          {/* Deuxième section : Solde principal */}
          <div
            className={`bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 text-center transform transition-all duration-500 ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="text-yellow-100 font-semibold">Solde principal</p>
              <div className="text-right">
                <span className="text-yellow-100 block">4500 Ar</span>
                <span className="text-yellow-100 block mt-2">1 USDT</span>
              </div>
            </div>
          </div>

          {/* Troisième section : Champs en question */}
          <div
            className={`bg-white/10 backdrop-blur-md rounded-lg p-6 transform transition-all duration-500 ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Montant avec sélection de devise */}
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-yellow-100 font-semibold text-sm sm:text-base"
                >
                  Veuillez saisir le montant
                </label>
                <div className="relative flex items-center">
                  <input
                    id="amount"
                    type="number"
                    placeholder="Ex. 345 900"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-4 pr-4 py-2 rounded-l-md bg-white border border-transparent text-gray-800 placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 shadow-md transition-all duration-300"
                    required
                    min="0"
                  />
                  <div className="bg-yellow-400 flex items-center justify-center w-20 h-full py-2 rounded-r-md">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value, phoneNumber: '', walletAddress: '' })}
                      className="w-full bg-yellow-400 text-white font-semibold border border-transparent focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="Ar">Ar</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Champs conditionnels selon la devise */}
              {formData.currency === 'Ar' ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-yellow-100 font-semibold text-sm sm:text-base"
                    >
                      Veuillez saisir le numéro
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Ex. 034 123 4567"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full pl-4 pr-4 py-2 rounded-l-md bg-white border border-transparent text-gray-800 placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 shadow-md transition-all duration-300"
                        required
                      />
                      <div className="bg-yellow-400 flex items-center justify-center w-52 h-full py-2 rounded-r-md">
                        <select
                          value={formData.operator}
                          onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                          className="w-full bg-yellow-400 text-white font-semibold border border-transparent focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="Orange Money">Orange Money</option>
                          <option value="Mvola">Mvola</option>
                          <option value="Airtel Money">Airtel Money</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="walletAddress"
                      className="block text-yellow-100 font-semibold text-sm sm:text-base"
                    >
                      Veuillez saisir l'adresse de portefeuille
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="walletAddress"
                        type="text"
                        placeholder="Ex. 0x1234567890abcdef"
                        value={formData.walletAddress}
                        onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                        className="w-full pl-4 pr-4 py-2 rounded-l-md bg-white border border-transparent text-gray-800 placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 shadow-md transition-all duration-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={handlePaste}
                        className="bg-yellow-400 flex items-center justify-center w-16 h-full py-2 rounded-r-md text-white border border-transparent focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 hover:bg-yellow-500 transition-colors duration-300"
                      >
                        <FaPaste className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton Valider le montant */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-600 py-3 text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 rounded-md disabled:opacity-75"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                      <span>Validation en cours...</span>
                    </div>
                  ) : (
                    'Valider le montant'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
  );
}