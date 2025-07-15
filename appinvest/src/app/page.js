'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '../components/LandingPage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de session :', err);
        // Ne rien faire, laisser l'utilisateur voir LandingPage
      }
    };

    check();
  }, [router]);

  return <LandingPage />;
}