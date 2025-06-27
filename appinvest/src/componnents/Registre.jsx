
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
    // Logique de soumission à implémenter (ex. : appel API)
    console.log('Form submitted');
  };

  return (
    <div className="w-full bg-white rounded-lg p-6 shadow-lg flex flex-col justify-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">{content[language].title}</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 text-sm mb-1" htmlFor="whatsapp">
            Entrer numéro WhatsApp
          </label>
          <div className="relative">
            <input
              id="whatsapp"
              type="tel"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Entrer numéro WhatsApp"
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
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1" htmlFor="confirm-password">
            Répéter mot de passe
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Répéter mot de passe"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1" htmlFor="invite-code">
            Entrer code d'invitation
          </label>
          <input
            id="invite-code"
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Entrer code d'invitation"
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