'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Coins, Calculator, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function BuyPointsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState('Ar');
  const [currentBalance] = useState(58000);
  const [pointsBalance] = useState(150);
  const [formData, setFormData] = useState({ amount: '', points: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const convertBalance = () => {
    if (currency === 'USDT') return (currentBalance / 5000).toFixed(2);
    return currentBalance.toLocaleString();
  };

  const calculatePoints = (amount) => {
    if (!amount) return '';
    const numAmount = parseFloat(amount);
    return currency === 'Ar'
      ? Math.floor(numAmount / 100).toString()
      : Math.floor(numAmount * 50).toString();
  };

  const calculateAmount = (points) => {
    if (!points) return '';
    const numPoints = parseFloat(points);
    return currency === 'Ar'
      ? (numPoints * 100).toString()
      : (numPoints / 50).toFixed(2);
  };

  const handleAmountChange = (value) => {
    setFormData({ amount: value, points: calculatePoints(value) });
  };

  const handlePointsChange = (value) => {
    setFormData({ points: value, amount: calculateAmount(value) });
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const amount = parseFloat(formData.amount);
    const maxAmount = currency === 'USDT' ? currentBalance / 5000 : currentBalance;

    if (amount > maxAmount) {
      toast.error('Solde insuffisant');
      setIsLoading(false);
      return;
    }

    if (amount <= 0) {
      toast.error('Montant invalide');
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const reference = Math.random().toString(36).substr(2, 6).toUpperCase();
    toast.success(`Achat de ${formData.points} points réussi - Réf: ${reference}`);

    setFormData({ amount: '', points: '' });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600"></div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard">
              <button className="group flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white 
              font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>
            </Link>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${currency === 'Ar' ? 'text-emerald-400' : 'text-gray-400'}`}>
                Ar
              </span>
               <label className="relative inline-flex items-center cursor-pointer ml-2 mr-2">

              <input
                type="checkbox"
                checked={currency === 'USDT'}
                onChange={(e) => setCurrency(e.target.checked ? 'USDT' : 'Ar')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
               </label>
              <span className={`text-sm ${currency === 'USDT' ? 'text-emerald-400' : 'text-gray-400'}`}>
                USDT
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8 ">
            <div className="relative inline-block">
              <h1 className="text-3xl font-bold text-emerald-600 glow">ACHETER DES POINTS</h1>
              <div className="absolute -top-2 -right-8">
                <ShoppingBag className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-white/80 text-sm mt-2">1 point = 100 Ar = 0.02 USDT</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg bg-red-500">
              <div className="p-4 text-center">
                <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-emerald-400 text-sm">Mes Points</p>
                <p className="text-xl font-bold text-white">{pointsBalance}</p>
              </div>
            </div>
            <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg bg-red-500">
              <div className="p-4 text-center">
                <Calculator className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-emerald-400 text-sm">Solde</p>
                <p className="text-xl font-bold text-white">{convertBalance()} {currency}</p>
              </div>
            </div>
          </div>

          {/* Purchase Form */}
          <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-green-800 text-lg font-semibold mb-4">Achat de Points</h2>
              <form onSubmit={handlePurchase} className="space-y-6">
                <div>
                  <label className="text-white text-sm font-medium">Montant à dépenser</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      step="0.01"
                      placeholder={currency === 'Ar' ? '1000' : '0.20'}
                      value={formData.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="w-full px-3 py-2 bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 font-semibold">
                      {currency}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-white text-sm font-medium">Nombre de points</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      placeholder="10"
                      value={formData.points}
                      onChange={(e) => handlePointsChange(e.target.value)}
                      className="w-full px-3 py-2 bg-emerald-900/30 border border-emerald-500/30 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 font-semibold">
                      points
                    </span>
                  </div>
                </div>
                {formData.amount && formData.points && (
                  <div className="bg-emerald-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm font-semibold">Calcul automatique</span>
                    </div>
                    <p className="text-white text-sm">
                      {formData.amount} {currency} = {formData.points} points
                    </p>
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !formData.amount || !formData.points}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Achat en cours...</span>
                      </div>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 mr-2 inline" />
                        Acheter
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                    onClick={() => setFormData({ amount: '', points: '' })}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Info */}
          <div className="glass-dark border border-emerald-500/20 rounded-lg shadow-lg mt-6 bg-red-500">
            <div className="p-6">
              <h2 className="text-green-800 flex items-center space-x-2 text-lg font-semibold mb-4">
                <Info className="w-5 h-5" />
                <span>Pourquoi acheter des points ?</span>
              </h2>
              <div className="space-y-3 text-sm text-white/80">
                <p>• <strong>Créer des missions</strong> : Utilisez vos points pour créer des micro-tâches</p>
                <p>• <strong>Promouvoir vos contenus</strong> : Obtenez des likes, abonnements, vues</p>
                <p>• <strong>Développer votre audience</strong> : Augmentez votre visibilité sur les réseaux</p>
                <p>• <strong>Économie collaborative</strong> : Participez à l'écosystème de la plateforme</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-6">
            <Link href="/microtasks">
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300">
                <Coins className="w-4 h-4 mr-2 inline" />
                Commander des Missions
              </button>
            </Link>
          </div>

          {/* Bottom Padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}