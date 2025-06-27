"use client";

import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';

function Registre({ language }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const content = {
    fr: {
      title: "Créer un compte",
      usernameLabel: "Nom d'utilisateur",
      emailLabel: "Adresse e-mail",
      passwordLabel: "Mot de passe",
      submitBtn: "S'inscrire",
    },
    mg: {
      title: "Manokatra kaonty",
      usernameLabel: "Anarana mpampiasa",
      emailLabel: "Adiresy mailaka",
      passwordLabel: "Tenimiafina",
      submitBtn: "Hisoratra anarana",
    },
    en: {
      title: "Create an account",
      usernameLabel: "Username",
      emailLabel: "Email address",
      passwordLabel: "Password",
      submitBtn: "Register",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-lg flex flex-col justify-center">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">{content[language].title}</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 text-sm mb-1" htmlFor="whatsapp">
            {language === 'fr' ? 'Entrer numéro WhatsApp' : language === 'mg' ? 'Ampidiro ny nomerao WhatsApp' : 'Enter WhatsApp number'}
          </label>
          <div className="relative">
            <input
              id="whatsapp"
              type="tel"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder={language === 'fr' ? 'Entrer numéro WhatsApp' : language === 'mg' ? 'Ampidiro ny nomerao WhatsApp' : 'Enter WhatsApp number'}
              required
            />
            <FaWhatsapp size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1" htmlFor="password">
            {content[language].passwordLabel}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder={content[language].passwordLabel}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1" htmlFor="confirm-password">
            {language === 'fr' ? 'Répéter mot de passe' : language === 'mg' ? 'Avereno ny tenimiafina' : 'Repeat password'}
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder={language === 'fr' ? 'Répéter mot de passe' : language === 'mg' ? 'Avereno ny tenimiafina' : 'Repeat password'}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1" htmlFor="invite-code">
            {language === 'fr' ? "Entrer code d'invitation" : language === 'mg' ? 'Ampidiro ny kaody fanasana' : 'Enter invitation code'}
          </label>
          <input
            id="invite-code"
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder={language === 'fr' ? "Entrer code d'invitation" : language === 'mg' ? 'Ampidiro ny kaody fanasana' : 'Enter invitation code'}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-500 transition-all shadow-md hover:shadow-lg"
        >
          {content[language].submitBtn}
        </button>
      </form>
    </div>
  );
}

export default Registre;