import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  token: null,
  balance: 0,
  points: 0,
  referral_code: null, // 🔥 corriger ici

  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => set({ token }),
  setBalance: (balance) => set({ balance }),
  setPoints: (points) => set({ points }),
  setReferralCode: (referral_code) => set({ referral_code }), // 🔥 corriger ici aussi

  logout: () =>
    set({
      user: null,
      token: null,
      balance: 0,
      points: 0,
      referral_code: null, // 🔥 reset aussi
      isAuthenticated: false,
    }),
}));
