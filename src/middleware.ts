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

		if (!user) {
			// Token non valido, reindirizza alla pagina di login
			url.pathname = '/';
			return NextResponse.redirect(url);
		}
		
		if (!user.subscriptionActive) {
			url.pathname = '/iscriviti';
			return NextResponse.redirect(url);
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
		'/giocatori/:path*',
		'/confronta-giocatori/:path*',
		'/statistiche-personali/:path*',
		'/profilo/:path*'
	], // Route protette
};
