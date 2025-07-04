'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaMoneyBillWave, FaUpload, FaPhone, FaPaste, FaCopy } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DepositPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'Ar',
    invoiceImage: null,
    reference: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setFormData({ ...formData, invoiceImage: file });
    } else {
      toast.error('Veuillez sélectionner une image valide.');
    }
  };

  const handlePaste = () => {
    navigator.clipboard.readText()
      .then((text) => {
        setFormData({ ...formData, reference: text });
        toast.success('Référence collée !');
      })
      .catch(() => toast.error('Échec de la copie.'));
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value)
      .then(() => toast.success('Copié dans le presse-papiers !'))
      .catch(() => toast.error('Échec de la copie.'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { amount, invoiceImage, reference } = formData;

    if (!amount || !invoiceImage || !reference) {
      toast.error('Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      toast.error('Veuillez entrer un montant valide.');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Dépôt effectué avec succès !');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
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
            <button className="bg-white text-red-600 font-semibold px-6 py-2 rounded-full shadow">💰 Dépôt</button>
          </div>

          <div className="bg-white rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-4">
              <span className={`font-semibold ${formData.currency === 'Ar' ? 'text-green-600' : 'text-gray-400'}`}>Ar</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.currency === 'USDT'}
                  onChange={() =>
                    setFormData({ ...formData, currency: formData.currency === 'Ar' ? 'USDT' : 'Ar' })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
              <span className={`font-semibold ${formData.currency === 'USDT' ? 'text-green-600' : 'text-gray-400'}`}>USDT</span>
            </div>
          </div>

          <div className="bg-red-100 border border-red-300 rounded-xl p-4 text-sm">
            <p className="text-red-600 font-medium mb-1">⚠️ Taux de conversion :</p>
            <ul className="text-gray-700 list-disc list-inside">
              <li>1 USDT = 5000 Ar (Achat)</li>
              <li>1 USDT = 4800 Ar (Retrait)</li>
            </ul>
          </div>

          {formData.currency === 'Ar' && (
            <div className="bg-white rounded-xl p-4 space-y-4">
              <p className="text-gray-700 font-semibold">Transférer l'argent à nos agents financiers</p>
              <div className="space-y-3">
                {[{
                  label: 'Mvola', number: '034 12 345 67', img: '/images/mvola.png'
                }, {
                  label: 'Airtel Money', number: '034 12 345 34', img: '/images/airtel.png'
                }, {
                  label: 'Orange Money', number: '034 12 345 90', img: '/images/orange.png'
                }].map((agent, i) => (
                  <div key={i} className="flex items-center space-x-4 border p-3 rounded-md">
                    <img src={agent.img} alt={agent.label} className="w-10 h-10" />
                    <div>
                      <p className="font-semibold text-gray-800">Agent: {agent.label}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        Numéro: {agent.number}
                        <button type="button" onClick={() => handleCopy(agent.number)} className="text-gray-500 hover:text-gray-700">
                          <FaCopy className="w-4 h-4" />
                        </button>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.currency === 'USDT' && (
            <div className="bg-white rounded-xl p-4 space-y-4">
              <p className="text-gray-800 text-center text-sm font-medium">Transférer l'argent à notre adresse wallet</p>
              <div className="bg-gray-50 p-4 rounded-md text-left shadow flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/images/usdt.png" alt="USDT" className="w-6 h-6" />
                  <p className="font-semibold text-gray-800">Adresse wallet: 0xAbC123...Ef456</p>
                </div>
                <button type="button" onClick={() => handleCopy('0xAbC123...Ef456')} className="text-gray-500 hover:text-gray-700">
                  <FaCopy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

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
                  className="w-full pl-4 pr-18 py-2 rounded-md bg-white border text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                  min="0"
                />
                <FaMoneyBillWave className="absolute right-3 top-2 w-5 h-5 text-yellow-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="invoiceImage" className="block text-gray-700 font-semibold">Capture de la facture</label>
              <div className="relative">
                <input
                  id="invoiceImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-yellow-100 file:bg-yellow-400"
                  required
                />
                <FaUpload className="absolute right-3 top-2 w-5 h-5 text-yellow-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reference" className="block text-gray-700 font-semibold">Référence de la facture</label>
              <div className="relative">
                <input
                  id="reference"
                  type="text"
                  placeholder="Ex. fdd6bce4"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full pl-4 pr-12 py-2 rounded-md bg-white border text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-600"
                  aria-label="Coller"
                >
                  <FaPaste className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-red-700 py-3 font-bold rounded-md shadow-md hover:scale-105 transition-transform duration-300 disabled:opacity-75"
                disabled={isLoading}
              >
                {isLoading ? 'Dépôt en cours...' : 'Dépôt'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full bg-white text-yellow-600 border-2 border-yellow-400 py-3 font-bold rounded-md hover:bg-yellow-100"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
