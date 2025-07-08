// hooks/useAuth.js
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log

export const useAuth = () => {
  const router = useRouter();

  const register = async (formData, onSuccess) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l’inscription.');
      }

      toast.success('Inscription réussie ! Connexion automatique...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('referralCode', data.referralCode || '');

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const login = async (formData, onSuccess) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la connexion.');
      }

      toast.success('Connexion réussie !');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('referralCode', data.referralCode || '');

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('referralCode');
    toast.success('Déconnexion réussie !');
    router.push('/login');
  };

  return { register, login, logout };
};
