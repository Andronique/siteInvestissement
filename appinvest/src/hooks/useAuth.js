'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUserStore } from '../store/useUserStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAuth = () => {

const register = async (formData) => {
  const router = useRouter();
  const {
    setUser,
    setToken,
    setBalance,
    setReferralCode,
  } = useUserStore.getState(); // ou directement `useUserStore()` si dans un composant React

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de l’inscription.");
    }

    setUser({
      id: data.id,
      username: data.username,
      phone: formData.phone,
    });
    setToken(data.token);
    setBalance(data.balance);
    setReferralCode(data.referral_code);

    toast.success('Inscription réussie !');
    router.push('/dashboard');
  } catch (error) {
    toast.error(error.message);
  }
};



const login = async (formData) => {
  const router = useRouter();
  const {
    setUser,
    setToken,
    setBalance,
    setPoints,
    setReferralCode,
  } = useUserStore.getState(); // si dans un fichier non React

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la connexion.");
    }

    setUser({
      id: data.userId,
      username: data.username,
      phone: formData.phone,
    });
    setToken(data.token);
    setBalance(data.balance);
    setPoints(data.points);
    setReferralCode(data.referral_code);

    toast.success('Connexion réussie !');
    router.push('/dashboard');
  } catch (error) {
    toast.error(error.message);
  }
};


const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();
    console.log('Réponse logout :', data);

    if (!response.ok) throw new Error(data.error || 'Erreur lors de la déconnexion.');

    clearStore();
    toast.success('Déconnexion réussie !');
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error(error.message);
  }
};


  return { register, login, logout };
};
