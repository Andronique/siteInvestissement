'use client';

import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaPhone, FaArrowLeft, FaStar, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Validation du numéro de téléphone (exemple pour +261)
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
      toast.error('Veuillez entrer un numéro WhatsApp valide (ex. +261 34 123 4567).');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Remplacer par une vraie requête API pour l'authentification
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulation de la connexion

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userPhone', formData.phone);

      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700 animate-gradient" />

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
            <FaStar className="w-2 h-2 text-gray-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div
            className={`bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-2xl shadow-2xl border-4 border-red-600 p-6 sm:p-8 ${
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
                <h2 className="text-3xl font-bold text-red-600 tracking-wide animate-pulse">
                  Se connecter
                </h2>
                <div className="absolute -top-2 -right-4">
                  <FaLock className="w-6 h-6 text-red-400 animate-bounce" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div
                  className={`space-y-2 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}
                  style={{ animationDelay: '0.2s' }}
                >
                  <label
                    htmlFor="phone"
                    className="text-white font-semibold text-base sm:text-lg"
                  >
                    Numéro WhatsApp
                  </label>
                  <div className="relative group">
                    <FaPhone
                      className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300"
                      aria-hidden="true"
                    />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+261 34 123 4567"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-red-500 shadow-md hover:scale-105 transition-transform duration-300"
                      required
                      aria-describedby="phone-error"
                    />
                  </div>
                </div>

                <div
                  className={`space-y-2 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}
                  style={{ animationDelay: '0.4s' }}
                >
                  <label
                    htmlFor="password"
                    className="text-white font-semibold text-base sm:text-lg"
                  >
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Entrez votre mot de passe"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pr-10 pl-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-red-500 shadow-md hover:scale-105 transition-transform duration-300"
                      required
                      aria-describedby="password-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-red-600 hover:text-red-800 transition-colors duration-300"
                      aria-label={
                        showPassword
                          ? 'Masquer le mot de passe'
                          : 'Afficher le mot de passe'
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash className="w-5 h-5" />
                      ) : (
                        <FaEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 text-lg sm:text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse ${
                    isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: '0.6s' }}
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>
                        Connexion<span className="loading-dots" />
                      </span>
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </button>

                <div
                  className={`text-center text-sm text-white/80 ${
                    isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: '0.8s' }}
                >
                  Pas encore de compte ?{' '}
                  <Link
                    href="/register"
                    className="text-gray-300 hover:text-yellow-100 font-semibold transition-colors duration-300"
                  >
                    S'inscrire
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}