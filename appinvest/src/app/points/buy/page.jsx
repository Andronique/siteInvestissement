'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Coins, Calculator, Info, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function BuyPointsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState('Ar');
  const [currentBalance] = useState(58000);
  const [pointsBalance] = useState(150);
  const [formData, setFormData] = useState({
    amount: '',
    points: ''
  });
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
    if (currency === 'USDT') {
      return (currentBalance / 5000).toFixed(2);
    }
    return currentBalance.toLocaleString();
  };

  const calculatePoints = (amount) => {
    if (!amount) return '';
    const numAmount = parseFloat(amount);
    if (currency === 'Ar') {
      return Math.floor(numAmount / 100).toString();
    } else {
      return Math.floor(numAmount * 50).toString();
    }
  };

  const calculateAmount = (points) => {
    if (!points) return '';
    const numPoints = parseFloat(points);
    if (currency === 'Ar') {
      return (numPoints * 100).toString();
    } else {
      return (numPoints / 50).toFixed(2);
    }
  };

  const handleAmountChange = (value) => {
    setFormData({
      amount: value,
      points: calculatePoints(value)
    });
  };

  const handlePointsChange = (value) => {
    setFormData({
      points: value,
      amount: calculateAmount(value)
    });
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

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reference = Math.random().toString(36).substr(2, 6).toUpperCase();
    toast.success(`Achat de ${formData.points} points réussi - Réf: ${reference}`);
    
    setFormData({ amount: '', points: '' });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-900 animate-gradient"></div>
      
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-2 h-2 text-emerald-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-md mx-auto">
          <div className={`flex items-center justify-between mb-6 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <button className="text-emerald-400 hover:bg-emerald-600/20 btn-animated px-4 py-2 rounded">
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                Retour
              </button>
            </Link>
            
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${currency === 'Ar' ? 'text-emerald-400' : 'text-gray-400'}`}>
                Ar
              </span>
              <input
                type="checkbox"
                checked={currency === 'USDT'}
                onChange={(e) => setCurrency(e.target.checked ? 'USDT' : 'Ar')}
                className="data-[state=checked]:bg-emerald-500"
              />
              <span className={`text-sm ${currency === 'USDT' ? 'text-emerald-400' : 'text-gray-400'}`}>
                USDT
              </span>
            </div>
          </div>

          <div className={`text-center mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <div className="relative inline-block">
              <h1 className="text-3xl font-bold text-emerald-400 mb-2 text-glow">ACHETER DES POINTS</h1>
              <div className="absolute -top-2 -right-8">
                <ShoppingBag className="w-6 h-6 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <p className="text-white/80 text-sm">1 point = 100 Ar = 0.02 USDT</p>
          </div>

          <div className={`grid grid-cols-2 gap-4 mb-6 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <div className="glass-dark border-emerald-500/20">
              <div className="p-4 text-center">
                <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2 animate-bounce" />
                <p className="text-emerald-400 text-sm">Mes Points</p>
                <p className="text-xl font-bold text-white">{pointsBalance}</p>
              </div>
            </div>
            
            <div className="glass-dark border-emerald-500/20">
              <div className="p-4 text-center">
                <Calculator className="w-6 h-6 text-blue-400 mx-auto mb-2 animate-float" />
                <p className="text-emerald-400 text-sm">Solde</p>
                <p className="text-xl font-bold text-white">{convertBalance()} {currency}</p>
              </div>
            </div>
          </div>

          <div className={`glass-dark border-emerald-500/20 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
            <div className="p-6">
              <h2 className="text-emerald-400 text-lg font-semibold mb-4">Achat de Points</h2>
              <form onSubmit={handlePurchase} className="space-y-6">
                <div>
                  <label className="text-white">Montant à dépenser</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      placeholder={currency === 'Ar' ? "1000" : "0.20"}
                      value={formData.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="glass border-emerald-500/30 text-white placeholder:text-gray-400 pr-16 w-full px-3 py-2 rounded"
                      required
                    />
                    <span className="absolute right-3 top-3 text-emerald-400 font-semibold">
                      {currency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-white">Nombre de points</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="10"
                      value={formData.points}
                      onChange={(e) => handlePointsChange(e.target.value)}
                      className="glass border-emerald-500/30 text-white placeholder:text-gray-400 pr-20 w-full px-3 py-2 rounded"
                      required
                    />
                    <span className="absolute right-3 top-3 text-yellow-400 font-semibold">
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
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 btn-animated px-4 py-2 rounded text-white"
                    disabled={isLoading || !formData.amount || !formData.points}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
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
                    className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded"
                    onClick={() => setFormData({ amount: '', points: '' })}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className={`glass-dark border-emerald-500/20 mt-6 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
            <div className="p-6">
              <h2 className="text-emerald-400 flex items-center space-x-2 text-lg font-semibold mb-4">
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

          <div className={`mt-6 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
            <Link href="/microtasks">
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 btn-animated px-4 py-2 rounded text-white">
                <Coins className="w-4 h-4 mr-2 inline animate-bounce" />
                Commander des Missions
              </button>
            </Link>
          </div>

          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}