import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { getUserData } from './lib/strapi';

export async function middleware(req: NextRequest) {
	const jwt = (await cookies()).get('jwt')?.value;
	const url = req.nextUrl.clone();

	// Se non c'è un token, reindirizza alla pagina di login
	if (!jwt) {
		url.pathname = '/';
		return NextResponse.redirect(url);
	}

	try {
		const user = await getUserData(jwt);


		if (req.nextUrl.pathname.startsWith("/carica-torneo") && user.role.name !== "SuperAdmin") {
			return NextResponse.redirect(new URL("/non-autorizzato", req.url));
		}

		if (req.nextUrl.pathname.startsWith("/carica-giocatori") && user.role.name !== "SuperAdmin") {
			return NextResponse.redirect(new URL("/non-autorizzato", req.url));
		}

		// L'utente è autenticato e ha un abbonamento attivo: lascia passare
		return NextResponse.next();
	} catch (err) {
		console.error('Errore durante il controllo del middleware:', err);
		url.pathname = '/';
		return NextResponse.redirect(url);
	}
}

// Configura le route su cui applicare il middleware
export const config = {
	matcher: [
		'/preferiti/:path*',
		'/profilo/:path*',
		'/carica-torneo',
		'/carica-giocatori'
	], // Route protette
};
