'use client';

import { useState, useEffect } from 'react';
import { FaGlobe, FaUser, FaUserCheck, FaDownload } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [language, setLanguage] = useState('fr');
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const languages = {
    fr: {
      title: "McDonald's Investa",
      slogan: "C'est tout ce que j'aime",
      login: "Se connecter",
      register: "S'inscrire",
      download: "Télécharger",
    },
    mg: {
      title: "McDonald's Investa",
      slogan: "Izay tiako rehetra",
      login: "Hiditra",
      register: "Hisoratra anarana",
      download: "Alaina",
    },
    en: {
      title: "McDonald's Investa",
      slogan: "I'm lovin' it",
      login: "Login",
      register: "Sign Up",
      download: "Download",
    },
  };

  const handleImageError = () => {
    console.error("Échec du chargement de l'image");
    setImageError(true);
  };

  const currentLang = languages[language] || languages['en'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-600 to-red-600 relative overflow-hidden">
      {/* Logo McDonald's en haut à gauche */}
      <div className="absolute top-4 left-4 z-20">
        <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
          {imageError ? (
            <div className="text-red-600 font-semibold text-center text-sm">
              Image introuvable. Vérifiez que logoe.png est dans public/.
            </div>
          ) : (
            <Image
              src="/logoe.png"
              alt="Logo McDonald's"
              layout="responsive"
              width={400}
              height={300}
              className="rounded-2xl mx-auto object-cover"
              priority
              onError={handleImageError}
            />
          )}
        </div>
      </div>

      {/* Sélecteur de langue en haut à droite */}
      <div className={`absolute top-4 right-4 z-20 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-32 bg-white/90 border-white/30 text-red-600 font-semibold hover:bg-white transition-all duration-300 rounded-md py-2 pl-8 pr 四 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Sélection de la langue"
          >
            <option value="fr">Français</option>
            <option value="mg">Malagasy</option>
            <option value="en">English</option>
          </select>
          <FaGlobe className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-600" aria-hidden="true" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex items-center justify-center min-h-screen p-2">
        <div className="w-full max-w-md">
          {/* Image principale avec produits McDonald's */}
          <div className={`relative mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <div className="bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 via-blue-300/30 to-purple-300/30" />
              <div className="relative z-10 text-center">
                {imageError ? (
                  <div className="text-red-600 font-semibold">
                    Image introuvable. Vérifiez que hero.png est dans public/.
                  </div>
                ) : (
                  <Image
                    src="/hero.png"
                    alt="Produits McDonald's"
                    layout="responsive"
                    width={400}
                    height={300}
                    className="rounded-2xl mx-auto object-cover"
                    priority
                    onError={handleImageError}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-4">
            <Link href="/login" className="block">
              <button
                className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-600 py-6 text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 rounded-md flex items-center justify-center ${
                  isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '0.5s' }}
                aria-label={currentLang.login}
              >
                <FaUser className="w-5 h-5 mr-2" aria-hidden="true" />
                {currentLang.login}
              </button>
            </Link>

            <Link href="/register" className="block">
              <button
                className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-600 py-6 text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 rounded-md flex items-center justify-center ${
                  isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '0.7s' }}
                aria-label={currentLang.register}
              >
                <FaUserCheck className="w-5 h-5 mr-2" aria-hidden="true" />
                {currentLang.register}
              </button>
            </Link>

            <button
              className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-600 py-6 text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 rounded-md flex items-center justify-center ${
                isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '0.9s' }}
                aria-label={currentLang.download}
              >
                <FaDownload className="w-5 h-5 mr-2" aria-hidden="true" />
                {currentLang.download}
              </button>
            </div>

            {/* Footer */}
            <div
              className={`text-center mt-8 text-white/80 text-sm ${
                isLoaded ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '1.1s' }}
            >
              <p>© 2025 McDonald's Investa. Tous droits réservés.</p>
            </div>
          </div>
        </div>

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
      </div>
    );
  }