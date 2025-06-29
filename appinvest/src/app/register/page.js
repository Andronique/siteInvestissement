// src/app/register/page.jsx
import Registre from '../../components/Registre';
import { Suspense } from 'react';
export default function RegisterPage() {
    return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Registre language="fr" />
    </Suspense>
  );
}

