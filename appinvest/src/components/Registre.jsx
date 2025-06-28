'use client';

import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaPhone, FaArrowLeft, FaDownload, FaStar, FaUserPlus, FaGift } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'sonner';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    countryCode: '+261',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoaded(true);
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, [searchParams]);

  const generateUserId = (phone) => {
    const lastSix = phone.slice(-6);
    return `USR_${lastSix}`;
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+\d{1,3}\d{6,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, '')); // Supprime les espaces pour la validation
  };
 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation des champs
    if (!formData.phone || !formData.password) {
      toast.error('Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      toast.error('Veuillez entrer un numéro WhatsApp valide (ex. +1234567890).');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Remplacer par une vraie requête API pour l'inscription
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulation de l'inscription

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userPhone', formData.phone);

      toast.success('Inscription réussie ! Connexion automatique...');
      router.push('/dashboard');
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Toaster pour afficher les notifications */}
      <Toaster richColors position="top-right" />

      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700 animate-gradient" />
      
      {/* Particules flottantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
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
            <FaStar className="w-2 h-2 text-gray-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div
            className={`bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-2xl shadow-2xl border-4 border-red-600 p-4 sm:p-4 ${
              isLoaded ? 'animate-bounce-in' : 'opacity-0'
            }`}
          >
            <div className="text-center space-y-4">
              <Link
                href="/"
                className={`inline-flex items-center text-red-600 hover:text-red-700 font-semibold transition-colors duration-300 ${
                  isLoaded ? 'animate-slide-in-left' : 'opacity-0'
                }`}
                aria-label="Retour à la page d'accueil"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
              
              <div className="relative">
                <h2 className="text-2xl font-bold text-red-100 tracking-wide animate-pulse">
                  Créer un compte
                </h2>
                <div className="absolute -top-2 -right-4">
                  <FaUserPlus className="w-6 h-6 text-gray-400 animate-bounce" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className={`space-y-2 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}
                  style={{ animationDelay: '0.1s' }}
                >
                  <label
                    htmlFor="phone"
                    className="text-white font-semibold text-base sm:text-lg text-2xl"
                  >
                    Numéro WhatsApp
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-20 rounded-lg bg-white/90 text-gray-900 py-2 px-1 focus:outline-none focus:ring-4 focus:ring-red-500 shadow-md hover:scale-105 transition-transform duration-300"
                    >
                      <option value="+261">+261</option>
                      <option value="+33">+33</option>
                      <option value="+44">+44</option>
                    </select>
                    <div className="relative flex-1 group">
                      <FaPhone
                        className="absolute left-2 top-4 w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-300"
                        aria-hidden="true"
                      />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="34 XX XXX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/90 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-red-500 shadow-md hover:scale-105 transition-transform duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`space-y-2 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}
                  style={{ animationDelay: '0.2s' }}
                >
                  <label
                    htmlFor="password"
                    className="text-white font-semibold text-base sm:text-lg"
                  >
                    Créer un mot de passe
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 caractères"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/90 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-red-500 shadow-md hover:scale-105 transition-transform duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-red-600 hover:text-red-800 transition-colors duration-300"
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div
                  className={`space-y-2 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}
                  style={{ animationDelay: '0.3s' }}
                >
                  <label
                    htmlFor="confirmPassword"
                    className="text-white font-semibold text-base sm:text-lg"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative group">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Répétez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/90 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-red-500 shadow-md hover:scale-105 transition-transform duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-red-600 hover:text-red-800 transition-colors duration-300"
                      aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div
                  className={`space-y-2 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}
                  style={{ animationDelay: '0.4s' }}
                >
                  <label
                    htmlFor="referralCode"
                    className="text-white font-semibold text-base sm:text-lg flex items-center space-x-2"
                  >
                    <span>Code d'invitation (facultatif)</span>
                    <FaGift className="w-4 h-4 text-gray-400 animate-bounce" />
                  </label>
                  <input
                    id="referralCode"
                    type="text"
                    placeholder="USR_XXXXXX"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-white/90 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-yellow-400 shadow-md hover:scale-105 transition-transform duration-300"
                  />
                  <p className="text-xs text-white/70 animate-pulse">
                    Remplissage facultatif si vous n'avez pas été parrainé
                  </p>
                </div>

                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 text-lg sm:text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse ${
                    isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: '0.5s' }}
                  disabled={isLoading || !formData.phone || !formData.password}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                      <span>Création du compte<span className="loading-dots"></span></span>
                    </div>
                  ) : (
                    "S'inscrire"
                  )}
                </button>

                <button
                  type="button"
                  className={`w-full border-2 border-gray-400 text-gray-300 hover:bg-gray-400 hover:text-red-900 font-semibold py-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-transparent ${
                    isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: '0.6s' }}
                >
                  <FaDownload className="w-4 h-4 mr-2 inline-block animate-bounce" />
                  Télécharger l'application
                </button>

                <div
                  className={`text-center text-sm text-white/80 ${
                    isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: '0.7s' }}
                >
                  Déjà un compte ?{' '}
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-yellow-100 font-semibold transition-colors duration-300"
                  >
                    Se connecter
                  </Link>
                </div>

                <div
                  className={`bg-white/10 p-3 rounded-lg text-xs text-white/80 backdrop-blur-sm ${
                    isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: '0.8s' }}
                >
                  <p className="font-semibold mb-1 flex items-center space-x-2">
                    <span>⚠️ Important :</span>
                    <FaStar className="w-3 h-3 text-yellow-400" />
                  </p>
                  <p>• Votre mot de passe est confidentiel</p>
                  <p>• Vous pouvez modifier vos informations plus tard</p>
                  <p>• Vérifiez le code d'invitation avant de valider</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}