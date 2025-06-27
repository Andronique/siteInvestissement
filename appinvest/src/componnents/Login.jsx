"use client";
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Login({ language }) {
  const [showPassword, setShowPassword] = useState(false);

  const content = {
    fr: {
      title: "Se connecter",
      emailLabel: "Adresse e-mail",
      passwordLabel: "Mot de passe",
      submitBtn: "Se connecter",
    },
    mg: {
      title: "Hiditra",
      emailLabel: "Adiresy mailaka",
      passwordLabel: "Tenimiafina",
      submitBtn: "Hiditra",
    },
    en: {
      title: "Login",
      emailLabel: "Email address",
      passwordLabel: "Password",
      submitBtn: "Login",
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
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 text-sm mb-1" htmlFor="email">
            {content[language].emailLabel}
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder={content[language].emailLabel}
              required
            />
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

export default Login;