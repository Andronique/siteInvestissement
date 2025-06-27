"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';
import Login from './Login';
import Registre from './Registre';

function LandingPage({ language: initialLanguage = 'fr' }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'mg', name: 'Malagasy', flag: '🇲🇬' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const content = {
    fr: {
      title: "McDonald's Investa",
      subtitle: "C'est tout ce que j'aime",
      description: "Votre plateforme d'investissement de confiance",
      loginBtn: "Se connecter",
      registerBtn: "S'inscrire",
      downloadBtn: "Télécharger",
      featuresTitle: "Pourquoi nous choisir ?",
      features: [
        "Investissements sécurisés",
        "Commissions attractives",
        "Système de parrainage",
        "Support 24/7",
      ],
    },
    mg: {
      title: "McDonald's Investa",
      subtitle: "Izay tiako rehetra",
      description: "Ny sehatra famatsiam-bola azo itokiana",
      loginBtn: "Hiditra",
      registerBtn: "Hisoratra anarana",
      downloadBtn: "Telecharger",
      featuresTitle: "Nahoana no mifidy anay?",
      features: [
        "Famatsiam-bola azo antoka",
        "Karama manintona",
        "Rafitra fanentanana",
        "Fanampiana 24/7",
      ],
    },
    en: {
      title: "McDonald's Investa",
      subtitle: "I'm lovin' it",
      description: "Your trusted investment platform",
      loginBtn: "Login",
      registerBtn: "Register",
      downloadBtn: "Download",
      featuresTitle: "Why Choose Us?",
      features: [
        "Secure investments",
        "Attractive commissions",
        "Referral system",
        "24/7 support",
      ],
    },
  };

  return (
    <div className="min-h-screen bg-red-500 flex flex-col">
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white hover:bg-white/30 transition-colors"
            aria-expanded={isLanguageOpen}
            aria-label="Select language"
          >
            <FiGlobe size={16} />
            <span className="text-sm font-medium">
              {languages.find((l) => l.code === language)?.flag}{' '}
              {languages.find((l) => l.code === language)?.name}
            </span>
            <FiChevronDown size={14} className={isLanguageOpen ? 'rotate-180' : ''} />
          </button>

          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLanguageOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-gray-700"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full flex items-center justify-center">
                <Image
                  src="/logoe.png"
                  alt="McDonald's Investa Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">{content[language].title}</h1>
            <p className="text-lg text-white/80 mt-2">{content[language].subtitle}</p>
            <p className="text-sm text-white/60 mt-1">{content[language].description}</p>
          </div>

          <div className="bg-red-500 rounded-lg p-6 shadow-lg">
            {activeSection === 'hero' && (
              <div className="relative rounded-lg p-4 h-48 sm:h-64">
                <Image
                  src="/hero.jpg"
                  alt="Hero"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg shadow-md"
                  priority
                />
              </div>
            )}
            {activeSection === 'login' && <Login language={language} />}
            {activeSection === 'register' && <Registre language={language} />}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setActiveSection('login')}
              className={`w-full bg-white text-red-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 ${activeSection === 'login' ? 'hidden' : ''}`}
            >
              {content[language].loginBtn}
            </button>
            <button
              onClick={() => setActiveSection('register')}
              className={`w-full bg-yellow-400 text-red-900 font-semibold py-3 rounded-xl hover:bg-yellow-300 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 ${activeSection === 'register' ? 'hidden' : ''}`}
            >
              {content[language].registerBtn}
            </button>
            <a
              href="/path-to-download"
              className="w-full bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-400 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 block text-center"
            >
              {content[language].downloadBtn}
            </a>
          </div>

          <div className="text-center text-white/75 text-sm space-y-1">
            <p>© 2025 McDonald's Investa</p>
            <p>{content[language].description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;