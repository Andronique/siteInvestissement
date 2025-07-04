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
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-600 to-red-600 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
          <div className="absolute top-4 left-4">
            <Link href="/dashboard" className="inline-flex items-center text-yellow-300 hover:text-yellow-200 font-medium transition-colors duration-300">
              <FaArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Link>
          </div>
        <div className="relative mb-6">
 

          {/* Currency Toggle */}
          <div className="flex items-center justify-center mt-6">
            <span className={`font-semibold ${currency === 'Ar' ? 'text-green-600' : 'text-gray-400'}`}>Ar</span>
            <label className="relative inline-flex items-center cursor-pointer ml-2 mr-2">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={currency === 'USDT'}
                onChange={() => setCurrency(currency === 'Ar' ? 'USDT' : 'Ar')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
            <span className={`font-semibold ${currency === 'USDT' ? 'text-green-600' : 'text-gray-400'}`}>USDT</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">INVESTISSEMENT</h1>
          <p className="text-white text-sm">Choisissez votre plan BURGER</p>
        </div>

        {/* Investment Plans */}
        <div className="space-y-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className="bg-white rounded-xl p-4 shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="flex items-center space-x-2 text-gray-700 text-lg font-semibold">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaShoppingCart className="w-4 h-4 text-red-700" />
                  </div>
                  <span>{plan.name}</span>
                  <FaHamburger className="w-5 h-5 text-yellow-600" />
                </h3>
                <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-sm flex items-center">
                  <FaTag className="w-3 h-3 mr-1" />
                  {plan.dailyReturn}% par jour
                </span>
              </div>
              
              <div className="space-y-4">
                {/* Plan Details */}
                <div className="bg-white p-3 rounded-lg text-sm">
                  <p><strong className="text-gray-700">Revenu journalier:</strong> {plan.dailyReturn}% par jour</p>
                  <p><strong className="text-gray-700">Commission parrainage:</strong> {plan.referralCommission}%</p>
                  <p><strong className="text-gray-700">Commission équipe:</strong> L1: {plan.teamCommissions.level1}% | L2: {plan.teamCommissions.level2}% | L3: {plan.teamCommissions.level3}%</p>
                  <p><strong className="text-gray-700">Dépôt min:</strong> {convertAmount(plan.minAmount)} {currency}</p>
                  <p><strong className="text-gray-700">Dépôt max:</strong> {convertAmount(plan.maxAmount)} {currency}</p>
                  <p><strong className="text-gray-700">Ajout min:</strong> {convertAmount(plan.minAdd)} {currency}</p>
                </div>

                {/* Current Investment */}
                {(plan.userInvestment || 0) > 0 && (
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
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
                    className="w-full bg-white border text-gray-800 placeholder:text-gray-500 rounded-md p-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    disabled={getButtonDisabled(plan)}
                  />
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleInvest(plan)}
                      className={`flex-1 py-2 rounded-md text-red-700 ${
                        getButtonText(plan) === 'TERMINÉ' 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-yellow-400 hover:bg-yellow-500'
                      } ${isLoading || getButtonDisabled(plan) || !investmentAmounts[plan.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isLoading || getButtonDisabled(plan) || !investmentAmounts[plan.id]}
                    >
                      {getButtonText(plan)}
                    </button>
                    <button
                      className="flex-1 py-2 border-2 border-yellow-400 rounded-md bg-white text-yellow-600 hover:bg-yellow-100"
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
        </div>

        {/* Bottom padding */}
        <div className="pb-24"></div>
      </div>
    </div>
  );
}