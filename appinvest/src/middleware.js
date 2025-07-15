import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('access_token')?.value;

  // Si le token est manquant, on redirige vers la page de connexion
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Applique ce middleware aux routes sécurisées
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/microtasks/:path*',
    '/withdraw/:path*',
    '/points/:path*',
    '/microtasks/:path*'
  ],
};
