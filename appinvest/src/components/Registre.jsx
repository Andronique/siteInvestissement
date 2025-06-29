'use client';

import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaPhone, FaArrowLeft, FaDownload, FaUserPlus, FaGift } from 'react-icons/fa';
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
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error('Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }

    if (!validatePhoneNumber(`${formData.countryCode}${formData.phone}`)) {
      toast.error('Veuillez entrer un numéro WhatsApp valide (ex. +261 34 123 4567).');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userPhone', `${formData.countryCode}${formData.phone}`);
      toast.success('Inscription réussie ! Connexion automatique...');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-red-800 to-red-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)]" />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className={`bg-white/10 backdrop-blur-md rounded-lg shadow-xl border-2 border-yellow-400/60 p-6 sm:p-8 transform transition-all duration-500 ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="text-center space-y-5">
              <Link href="/" className="inline-flex items-center text-yellow-300 hover:text-yellow-200 font-medium transition-colors duration-300">
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
              <div className="relative">
                <h2 className="text-3xl font-bold text-yellow-300">Créer un compte</h2>
                <FaUserPlus className="absolute -top-3 -right-5 w-6 h-6 text-yellow-300/50" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-yellow-100 font-semibold text-sm sm:text-base">Numéro WhatsApp</label>
                  <div className="flex space-x-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-20 rounded-md bg-white/5 text-yellow-100 py-2 px-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 shadow-md transition-all duration-300"
                    >
                      <option value="+261">+261</option>
                      <option value="+33">+33</option>
                      <option value="+44">+44</option>
                    </select>
                    <div className="relative flex-1">
                      <FaPhone className="absolute left-3 top-3 w-5 h-5 text-yellow-300/70" aria-hidden="true" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="34 XX XXX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-2 rounded-md bg-white/5 text-yellow-100 placeholder:text-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 shadow-md transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-yellow-100 font-semibold text-sm sm:text-base">Créer un mot de passe</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 6 caractères"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-4 pr-10 py-2 rounded-md bg-white/5 text-yellow-100 placeholder:text-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 shadow-md transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-yellow-300 hover:text-yellow-200 transition-colors duration-300"
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-yellow-100 font-semibold text-sm sm:text-base">Confirmer le mot de passe</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Répétez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-4 pr-10 py-2 rounded-md bg-white/5 text-yellow-100 placeholder:text-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 shadow-md transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2 text-yellow-300 hover:text-yellow-200 transition-colors duration-300"
                      aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="referralCode" className="block text-yellow-100 font-semibold text-sm sm:text-base flex items-center space-x-2">
                    <span>Code d'invitation (facultatif)</span>
                    <FaGift className="w-4 h-4 text-yellow-300/70" />
                  </label>
                  <input
                    id="referralCode"
                    type="text"
                    placeholder="USR_XXXXXX"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                    className="w-full pl-4 pr-4 py-2 rounded-md bg-white/5 text-yellow-100 placeholder:text-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 shadow-md transition-all duration-300"
                  />
                  <p className="text-xs text-yellow-100/70">Remplissage facultatif si vous n'avez pas été parrainé</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 text-lg font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-75"
                  disabled={isLoading || !formData.phone || !formData.password || !formData.confirmPassword}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full" />
                      <span>Création du compte...</span>
                    </div>
                  ) : (
                    'S\'inscrire'
                  )}
                </button>

                <button
                  type="button"
                  className="w-full bg-transparent border-2 border-yellow-400/60 text-yellow-300 hover:bg-yellow-400/10 hover:text-yellow-200 font-medium py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <FaDownload className="w-4 h-4 mr-2 inline-block" />
                  Télécharger l'application
                </button>

                <div className="text-center text-sm text-yellow-100/70">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-yellow-300 hover:text-yellow-200 font-medium transition-colors duration-300">
                    Se connecter
                  </Link>
                </div>

                <div className="bg-white/5 p-4 rounded-md text-sm text-yellow-100/70">
                  <p className="font-medium mb-1 flex items-center space-x-2">
                    <span>⚠️ Important :</span>
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