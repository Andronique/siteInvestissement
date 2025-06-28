'use client';

import { Toaster } from 'sonner';
import './globals.css'; // Import custom CSS for animations

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}