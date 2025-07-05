'use client';

import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaPhone, FaArrowLeft, FaLock } from 'react-icons/fa';
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

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+\d{1,3}\d{6,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
  const response = await fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: formData.phone,
      password: formData.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erreur lors de la connexion.');
  }

  // ✅ Connexion réussie
  toast.success('Connexion réussie !');
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userPhone', formData.phone);
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('referralCode', data.referralCode);
  router.push('/dashboard');
} catch (error) {
  toast.error(error.message);
}
finally {
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
                <h2 className="text-3xl font-bold text-yellow-300">Connexion</h2>
                <FaLock className="absolute -top-3 -right-5 w-6 h-6 text-yellow-300/50" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-yellow-100 font-semibold text-sm sm:text-base">Numéro WhatsApp</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-3 w-5 h-5 text-yellow-300/70" aria-hidden="true" />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+261 34 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-2 rounded-md bg-white/5 text-yellow-100 placeholder:text-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 shadow-md transition-all duration-300"
                      required
                      aria-describedby="phone-error"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-yellow-100 font-semibold text-sm sm:text-base">Mot de passe</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Entrez votre mot de passe"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-4 pr-10 py-2 rounded-md bg-white/5 text-yellow-100 placeholder:text-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 shadow-md transition-all duration-300"
                      required
                      aria-describedby="password-error"
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

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 text-lg font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-75"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full" />
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </button>

                <div className="text-center text-sm text-yellow-100/70">
                  Pas encore de compte ?{' '}
                  <Link href="/register" className="text-yellow-300 hover:text-yellow-200 font-medium transition-colors duration-300">
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