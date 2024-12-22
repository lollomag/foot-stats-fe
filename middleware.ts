import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ottieni il token JWT dai cookie
  const jwt = request.cookies.get('jwt')?.value;

  // Pagine protette
  const protectedPaths = ['/statistiche-personali', '/profilo'];
  const pathname = request.nextUrl.pathname;

  // Se l'utente cerca di accedere a una pagina protetta senza essere autenticato
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !jwt) {
    const loginUrl = new URL('/accedi', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Lascialo passare se è autenticato o accede a una pagina pubblica
  return NextResponse.next();
}

export const config = {
  matcher: ['/statistiche-personali/:path*', '/profilo/:path*'], // Applica il middleware a queste pagine
};

