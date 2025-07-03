'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaPaste, FaLock ,FaMoneyBillWave} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'Ar',
    phoneNumber: '',
    operator: 'Orange Money',
    walletAddress: '',
    code: '',
    balanceAr: 4500,
    balanceUsdt: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePaste = () => {
    navigator.clipboard.readText()
      .then((text) => {
        setFormData({ ...formData, walletAddress: text });
        toast.success('Adresse collée !');
      })
      .catch(() => toast.error('Échec de la copie.'));
  };

  const montantApresFrais = parseFloat(formData.amount || '0') - 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { amount, currency, phoneNumber, walletAddress, code, balanceAr, balanceUsdt } = formData;

    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Veuillez entrer un montant valide.');
      setIsLoading(false);
      return;
    }

    const maxBalance = currency === 'Ar' ? balanceAr : balanceUsdt;
    if (amount > maxBalance) {
      toast.error(`Montant supérieur au solde disponible (${maxBalance} ${currency}).`);
      setIsLoading(false);
      return;
    }

    if (currency === 'Ar') {
      if (!phoneNumber || !/^[0-9+\s]{9,14}$/.test(phoneNumber)) {
        toast.error('Numéro de téléphone invalide.');
        setIsLoading(false);
        return;
      }
    } else {
      if (!walletAddress || walletAddress.length < 26 || !/^[a-zA-Z0-9]+$/.test(walletAddress)) {
        toast.error('Adresse de portefeuille invalide.');
        setIsLoading(false);
        return;
      }
    }

    if (!confirmed) {
      setConfirmed(true);
      setIsLoading(false);
      return;
    }

    if (!code || code.length < 4) {
      toast.error('Veuillez saisir un code de retrait valide.');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((res) => setTimeout(res, 1500));
      toast.success('Retrait validé avec succès !');
      router.push('/dashboard');
    } catch {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-600 to-red-600 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="absolute top-4 left-4">
            <Link href="/dashboard" className="inline-flex items-center text-yellow-300 hover:text-yellow-200 font-medium transition-colors duration-300">
              <FaArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Link>
          </div>

          <div className="text-center">
            <button className="bg-white text-red-600 font-semibold px-6 py-2 rounded-full shadow">
              <FaMoneyBillWave className="inline-block w-5 h-5 mr-2" /> Retrait
            </button>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl p-4 flex justify-between items-center shadow-lg">
            <p className="text-white font-semibold text-lg">Solde principal</p>
            <div className="text-right space-y-1">
              <p className="text-white font-bold text-xl">{formData.balanceAr} Ar</p>
              <p className="text-white text-sm opacity-80">≈ {formData.balanceUsdt} USDT</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-gray-700 font-semibold">Montant</label>
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  placeholder="Ex. 345 900"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-4 pr-24 py-2 rounded-md bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
                  required
                  min="0"
                />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value, phoneNumber: '', walletAddress: '' })}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-20 bg-yellow-400 text-white font-semibold border border-yellow-400 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
                >
                  <option value="Ar">Ar</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
            </div>

            {formData.currency === 'Ar' ? (
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold">Numéro</label>
                <div className="relative">
                  <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Ex. 034 123 4567"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full pl-4 pr-56 py-2 rounded-md bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
                    required
                  />
                  <select
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-36 bg-yellow-400 text-white font-semibold border border-yellow-400 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="Mvola">Mvola</option>
                    <option value="Airtel Money">Airtel Money</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="walletAddress" className="block text-gray-700 font-semibold">Adresse portefeuille</label>
                <div className="relative">
                  <input
                    id="walletAddress"
                    type="text"
                    placeholder="Ex. 0x1234567890abcdef"
                    value={formData.walletAddress}
                    onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                    className="w-full pl-4 pr-16 py-2 rounded-md bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-yellow-400 text-white w-12 h-8 rounded-md flex items-center justify-center hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <FaPaste className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {confirmed && (
              <div className="space-y-4 mt-6">
                <p className="text-gray-800 text-center font-medium">Montant après frais {montantApresFrais.toFixed(2)} Ar</p>
                <div className="space-y-2">
                  <label htmlFor="code" className="block text-gray-700 font-semibold">Code de retrait</label>
                  <div className="relative">
                    <input
                      id="code"
                      type="text"
                      placeholder="Ex. Oi2365"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full pl-10 py-2 rounded-md bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
                      required
                    />
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-green-600">
                      <FaLock className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4 pt-4">
              {confirmed ? (
                <>
                  <button
                    type="button"
                    onClick={() => setConfirmed(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold"
                  >
                    Confirmer le retrait
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-red-700 py-3 font-bold rounded-md shadow-md hover:scale-105 transition-transform duration-300 disabled:opacity-75"
                  disabled={isLoading}
                >
                  {isLoading ? 'Validation en cours...' : 'Valider le montant'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
