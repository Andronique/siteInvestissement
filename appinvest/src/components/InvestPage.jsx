'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaShoppingCart, FaHamburger, FaTag, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const INVESTMENT_PLANS = [
  {
    id: 'burger1',
    name: 'BURGER 1',
    minAmount: 10000,
    maxAmount: 400000,
    minAdd: 10000,
    dailyReturn: 3,
    referralCommission: 10,
    teamCommissions: { level1: 6, level2: 3, level3: 1 },
    userInvestment: 0
  },
  {
    id: 'burger2',
    name: 'BURGER 2',
    minAmount: 405000,
    maxAmount: 1200000,
    minAdd: 50000,
    dailyReturn: 3.5,
    referralCommission: 10,
    teamCommissions: { level1: 6, level2: 3, level3: 1 },
    userInvestment: 0
  },
  {
    id: 'burger3',
    name: 'BURGER 3',
    minAmount: 1205000,
    maxAmount: 2500000,
    minAdd: 100000,
    dailyReturn: 4,
    referralCommission: 10,
    teamCommissions: { level1: 6, level2: 3, level3: 1 },
    userInvestment: 0
  },
  {
    id: 'burger4',
    name: 'BURGER 4',
    minAmount: 2505000,
    maxAmount: 3750000,
    minAdd: 100000,
    dailyReturn: 4.5,
    referralCommission: 10,
    teamCommissions: { level1: 6, level2: 3, level3: 1 },
    userInvestment: 0
  }
];

export default function InvestPage() {
  const [currency, setCurrency] = useState('Ar');
  const [plans, setPlans] = useState(INVESTMENT_PLANS);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [investmentAmounts, setInvestmentAmounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    }
  }, [router]);

  const convertAmount = (amount) => {
    if (currency === 'USDT') {
      return (amount / 5000).toFixed(2);
    }
    return amount.toLocaleString();
  };

  const getButtonText = (plan) => {
    const currentInvestment = plan.userInvestment || 0;
    if (currentInvestment >= plan.maxAmount) {
      return 'TERMINÉ';
    }
    if (currentInvestment > 0) {
      return 'AJOUTER';
    }
    return 'INVESTIR';
  };

  const getButtonDisabled = (plan) => {
    return (plan.userInvestment || 0) >= plan.maxAmount;
  };

  const validateInvestment = (plan, amount) => {
    const numAmount = parseFloat(amount);
    if (!numAmount) return false;

    const currentInvestment = plan.userInvestment || 0;
    const totalAfterInvestment = currentInvestment + numAmount;

    if (currentInvestment === 0 && numAmount < plan.minAmount) {
      toast.error(`Investissement minimum: ${convertAmount(plan.minAmount)} ${currency}`);
      return false;
    }

    if (currentInvestment > 0 && numAmount < plan.minAdd) {
      toast.error(`Ajout minimum: ${convertAmount(plan.minAdd)} ${currency}`);
      return false;
    }

    if (totalAfterInvestment > plan.maxAmount) {
      toast.error(`Investissement maximum: ${convertAmount(plan.maxAmount)} ${currency}`);
      return false;
    }

    return true;
  };

  const handleInvest = async (plan) => {
    const amount = investmentAmounts[plan.id];
    if (!validateInvestment(plan, amount)) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const numAmount = parseFloat(amount);
    const reference = Math.random().toString(36).substr(2, 6).toUpperCase();

    setPlans(prevPlans => 
      prevPlans.map(p => 
        p.id === plan.id 
          ? { ...p, userInvestment: (p.userInvestment || 0) + numAmount }
          : p
      )
    );

    setInvestmentAmounts(prev => ({...prev, [plan.id]: ''}));

    toast.success(`Investissement de ${convertAmount(numAmount)} ${currency} réussi sur ${plan.name} - Réf: ${reference}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <button className="text-white hover:bg-white/20 px-3 py-1 rounded-md flex items-center text-sm">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </button>
          </Link>
          
          {/* Currency Toggle */}
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${currency === 'Ar' ? 'text-white' : 'text-white/60'}`}>
              Ar
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={currency === 'USDT'}
                onChange={(e) => setCurrency(e.target.checked ? 'USDT' : 'Ar')}
                className="appearance-none w-10 h-5 bg-gray-300 rounded-full checked:bg-yellow-400 cursor-pointer"
              />
              {currency === 'USDT' ? (
                <FaToggleOn className="absolute top-0.5 left-0.5 w-4 h-4 text-white" />
              ) : (
                <FaToggleOff className="absolute top-0.5 left-0.5 w-4 h-4 text-white" />
              )}
            </div>
            <span className={`text-sm ${currency === 'USDT' ? 'text-white' : 'text-white/60'}`}>
              USDT
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">INVESTISSEMENT</h1>
          <p className="text-white/80 text-sm">Choisissez votre plan BURGER</p>
        </div>

        {/* Investment Plans */}
        <div className="space-y-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`bg-white/95 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-300 p-4 ${
                selectedPlan === plan.id ? 'ring-2 ring-yellow-400 shadow-xl' : ''
              }`}
              onClick={() => setSelectedPlan(selectedPlan === plan.id ? '' : plan.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="flex items-center space-x-2 text-red-600 text-lg font-semibold">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <FaShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <span>{plan.name}</span>
                  <FaHamburger className="w-5 h-5 text-red-600" />
                </h3>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center">
                  <FaTag className="w-3 h-3 mr-1" />
                  {plan.dailyReturn}% par jour
                </span>
              </div>
              
              <div className="space-y-4">
                {/* Plan Details */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p><strong>Revenu journalier:</strong> {plan.dailyReturn}% par jour</p>
                  <p><strong>Commission parrainage:</strong> {plan.referralCommission}%</p>
                  <p><strong>Commission équipe:</strong> L1: {plan.teamCommissions.level1}% | L2: {plan.teamCommissions.level2}% | L3: {plan.teamCommissions.level3}%</p>
                  <p><strong>Dépôt min:</strong> {convertAmount(plan.minAmount)} {currency}</p>
                  <p><strong>Dépôt max:</strong> {convertAmount(plan.maxAmount)} {currency}</p>
                  <p><strong>Ajout min:</strong> {convertAmount(plan.minAdd)} {currency}</p>
                </div>

                {/* Current Investment */}
                {(plan.userInvestment || 0) > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Investissement actuel:</strong> {convertAmount(plan.userInvestment || 0)} {currency}
                    </p>
                  </div>
                )}

                {/* Investment Input */}
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Saisir le montant"
                    value={investmentAmounts[plan.id] || ''}
                    onChange={(e) => setInvestmentAmounts(prev => ({
                      ...prev,
                      [plan.id]: e.target.value
                    }))}
                    className="w-full border border-gray-300 rounded-md p-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    disabled={getButtonDisabled(plan)}
                  />
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleInvest(plan)}
                      className={`flex-1 py-2 rounded-md text-white ${
                        getButtonText(plan) === 'TERMINÉ' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      } ${isLoading || getButtonDisabled(plan) || !investmentAmounts[plan.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isLoading || getButtonDisabled(plan) || !investmentAmounts[plan.id]}
                    >
                      {getButtonText(plan)}
                    </button>
                    <button
                      className="flex-1 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
                      onClick={() => setInvestmentAmounts(prev => ({
                        ...prev,
                        [plan.id]: ''
                      }))}
                    >
                      ANNULER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
 nhiễm

        {/* Bottom padding */}
        <div className="pb-24"></div>
      </div>
    </div>
    </div>
  );
}