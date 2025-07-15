'use client';

import { toast } from 'sonner';
import { useUserStore } from '../store/useUserStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAuth = () => {

 const register = async (formData, onSuccessRedirect) => {
  const {
    setUser,
    setToken,
    setBalance,
    setReferralCode,
  } = useUserStore.getState();

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
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

    toast.success("Inscription réussie !");

    if (typeof onSuccessRedirect === "function") {
      onSuccessRedirect(); // ✅ Redirection déclenchée par le composant appelant
    }
  } catch (error) {
    toast.error(error.message);
  }
};




const login = async (formData, onSuccessRedirect) => {
  // Récupération des setters du store (toujours OK hors React)
  const {
    setUser,
    setToken,
    setBalance,
    setPoints,
    setReferralCode,
  } = useUserStore.getState();

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur lors de la connexion.");
    }

    // MÀJ du store
    setUser({ id: data.userId, username: data.username, phone: formData.phone });
    setToken(data.token);
    setBalance(data.balance);
    setPoints(data.points);
    setReferralCode(data.referral_code);

    toast.success("Connexion réussie !");

    // 👉 Redirection via le callback passé depuis le composant
    if (typeof onSuccessRedirect === "function") {
      onSuccessRedirect();
    }
  } catch (error) {
    toast.error(error.message);
  }
};



  const logout = async (onSuccessRedirect) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      console.log("Réponse logout :", data);

      if (!response.ok)
        throw new Error(data.error || "Erreur lors de la déconnexion.");

      clearStore(); // ou setUser(null), setToken(null), etc.
      toast.success("Déconnexion réussie !");

      if (typeof onSuccessRedirect === "function") {
        onSuccessRedirect(); // ✅ redirection
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message);
    }
  };



  return { register, login, logout };
};
