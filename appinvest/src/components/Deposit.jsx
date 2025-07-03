'use client';

import { useState, useEffect } from 'react';
import { FaArrowLeft, FaMoneyBillWave, FaUpload, FaPhone } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DepositPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.amount || !formData.invoiceImage || !formData.reference) {
      toast.error('Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }

    if (isNaN(formData.amount) || formData.amount <= 0) {
      toast.error('Veuillez entrer un montant valide.');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulation
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
    <div className="min-h-screen bg-gradient-to-br  from-red-600 via-red-900 to-red-500 relative overflow-hidden">
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

          {/* Card avec icône et numéro de téléphone */}
          <div
            className={`bg-white/20 backdrop-blur-md rounded-lg p-6 mb-6 text-center transform transition-all duration-500 ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <FaPhone className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
            <p className="text-yellow-100 font-semibold">+261 34 123 4567</p>
          </div>

          {/* Formulaire */}
          <div
            className={`bg-white/20 backdrop-blur-md rounded-lg p-6 transform transition-all duration-500 ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Montant */}
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-yellow-100 font-semibold text-sm sm:text-base"
                >
                  Veuillez saisir le montant
                </label>
                <div className="relative">
                  <input
                    id="amount"
                    type="number"
                    placeholder="Ex. 345 900"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-4 pr-18 py-2 rounded-md  bg-white border border-transparent text-gray-800 placeholder: text-gray-800/200 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 shadow-md transition-all duration-300"
                    required
                    min="0"
                  />
                  <FaMoneyBillWave
                    className="absolute right-3 top-2 w-5 h-5 text-yellow-00"
                    aria-hidden="true"
                  />
                  <span className="absolute right-10 top-2 text-yellow-00 font-semibold">
                    Ar
                  </span>
                </div>
              </div>

              {/* Capture de la facture */}
              <div className="space-y-2">
                <label
                  htmlFor="invoiceImage"
                  className="block text-yellow-100 font-semibold text-sm sm:text-base"
                >
                  Veuillez télécharger la capture de la facture
                </label>
                <div className="relative">
                  <input
                    id="invoiceImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full pl-4 pr-12 py-2 rounded-md bg-white border border-transparent text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-yellow-100 file:bg-yellow-400 transition-all duration-300"
                    required
                  />
                  <FaUpload
                    className="absolute right-3 top-2 w-5 h-5 text-yellow-00"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Référence de la facture */}
              <div className="space-y-2">
                <label
                  htmlFor="reference"
                  className="block text-yellow-100 font-semibold text-sm sm:text-base"
                >
                  Veuillez saisir la référence de la facture
                </label>
                <input
                  id="reference"
                  type="text"
                  placeholder="Ex. fdd6bce4"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full pl-4 pr-4 py-2 rounded-md bg-white border border-transparent text-gray-800 placeholder:text-gray-800/200 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 shadow-md transition-all duration-300"
                  required
                />
              </div>

              {/* Boutons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-600 py-3 text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 rounded-md disabled:opacity-75"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                      <span>Dépôt en cours...</span>
                    </div>
                  ) : (
                    'Dépôt'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full bg-transparent border-2 border-yellow-400/60 text-yellow-300 hover:bg-yellow-400/10 hover:text-yellow-200 py-3 text-lg font-bold rounded-md shadow-md transition-all duration-300"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}