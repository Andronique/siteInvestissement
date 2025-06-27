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
    },
    mg: {
      title: "McDonald's Investa",
      subtitle: "Izay tiako rehetra",
      description: "Ny sehatra famatsiam-bola azo itokiana",
      loginBtn: "Hiditra",
      registerBtn: "Hisoratra anarana",
      downloadBtn: "Telecharger",
    },
    en: {
      title: "McDonald's Investa",
      subtitle: "I'm lovin' it",
      description: "Your trusted investment platform",
      loginBtn: "Login",
      registerBtn: "Register",
      downloadBtn: "Download",
    },
  };

  return (
    <div className="min-h-screen bg-red-500 flex flex-col px-4 sm:px-6 lg:px-8">
      {/* Language Selector */}
      <div className="relative top-4 right-0 z-50 w-fit self-end">
        <button
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white hover:bg-white/30 transition-all duration-300 text-sm sm:text-base"
          aria-expanded={isLanguageOpen}
          aria-label="Select language"
        >
          <FiGlobe size={16} />
          <span className="font-medium">
            {languages.find((l) => l.code === language)?.flag}{' '}
            {languages.find((l) => l.code === language)?.name}
          </span>
          <FiChevronDown
            size={14}
            className={isLanguageOpen ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}
          />
        </button>
        {isLanguageOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg animate-fade-in">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsLanguageOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 text-gray-700 text-sm"
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl space-y-6">
          {/* Header Section */}
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-scale-up">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full flex items-center justify-center">
                <Image
                  src="/logoe.png"
                  alt="McDonald's Investa Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{content[language].title}</h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 mt-2">{content[language].subtitle}</p>
            <p className="text-sm sm:text-base text-white/60 mt-1">{content[language].description}</p>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg animate-fade-in">
            {activeSection === 'hero' && (
              <div className="relative rounded-lg h-48 sm:h-64 lg:h-80 overflow-hidden">
                <Image
                  src="/hero.jpg"
                  alt="Hero"
                  fill
                  className="rounded-lg shadow-md object-cover"
                  priority
                />
              </div>
            )}
            {activeSection === 'login' && <Login language={language} />}
            {activeSection === 'register' && <Registre language={language} />}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setActiveSection('login')}
              className={`w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-500 transition-all shadow-md hover:shadow-lg ${activeSection === 'login' ? 'hidden' : ''}`}
            >
              {content[language].loginBtn}
            </button>
            <button
              onClick={() => setActiveSection('register')}
              className={`w-full bg-white text-red-600 font-semibold py-3 rounded-lg border-2 border-red-600 hover:bg-red-50 transition-all shadow-md hover:shadow-lg ${activeSection === 'register' ? 'hidden' : ''}`}
            >
              {content[language].registerBtn}
            </button>
            <a
              href="/path-to-download"
              className="block w-full bg-yellow-500 text-white font-semibold py-3 rounded-lg hover:bg-yellow-400 transition-all shadow-md hover:shadow-lg text-center"
            >
              {content[language].downloadBtn}
            </a>
          </div>

          {/* Footer */}
          <div className="text-center text-white/75 text-xs sm:text-sm space-y-1 animate-fade-in">
            <p>© 2025 McDonald's Investa</p>
            <p>{content[language].description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;