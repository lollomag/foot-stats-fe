import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
	try {
		const body = await req.json();
		const { priceId, userId } = body;

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
			success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?status=OK`,
			cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?status=KO`,
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
