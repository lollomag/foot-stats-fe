import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
	try {
		const body = await req.json(); // Leggi il corpo della richiesta
		const { priceId, userId } = body;

		console.log("arriva userId", userId);
		

		// Crea una sessione di pagamento Stripe
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'subscription',
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/conferma-pagamento?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pagamento-rifiutato`,
			metadata: { userId },
		});

		return new Response(
			JSON.stringify({ url: session.url }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		console.error('Errore durante la creazione della sessione:', error);
		return new Response(
			JSON.stringify({ error: 'Errore nella creazione della sessione' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
