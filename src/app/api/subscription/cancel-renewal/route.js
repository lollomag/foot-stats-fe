import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-11-15',
});

export async function POST(req) {
	try {
		const { subscriptionId, enableRenewal } = await req.json();

		if (!subscriptionId) {
			return NextResponse.json({ error: 'ID della sottoscrizione mancante.' }, { status: 400 });
		}

		// Aggiorna la sottoscrizione per disabilitare il rinnovo automatico
		const subscription = await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: !enableRenewal,
		});

		return NextResponse.json({
			message: enableRenewal
				? 'Rinnovo automatico abilitato con successo.'
				: 'Rinnovo automatico disattivato con successo.',
			subscription,
		});
	} catch (error) {
		console.error('Errore disattivando il rinnovo automatico:', error);
		return NextResponse.json(
			{ error: 'Impossibile disattivare il rinnovo automatico.' },
			{ status: 500 }
		);
	}
}
