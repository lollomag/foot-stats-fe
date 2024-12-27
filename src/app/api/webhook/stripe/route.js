import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const sig = req.headers['stripe-signature']; // Firma del webhook
    const buf = await req.text(); // Ottieni il buffer della richiesta
    let event;

    try {
        // Verifica la firma del webhook
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Errore nella verifica del webhook:', err);
        return new Response(
            JSON.stringify({ error: 'Webhook signature verification failed.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            // Recupera i dati dal webhook
            const userId = session.metadata.userId;

            // Chiamata all'API di Strapi per aggiornare l'utente
            const res = await fetch(`${process.env.STRAPI_API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
                },
                body: JSON.stringify({
                    subscriptionActive: true,
                    stripeCustomerId: session.customer,
                }),
            });

            if (!res.ok) {
                console.error('Errore aggiornando Strapi:', await res.text());
                return new Response(
                    JSON.stringify({ error: 'Failed to update Strapi user.' }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }

            console.log('Utente aggiornato in Strapi con successo.');
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (err) {
            console.error('Errore interno durante l\'aggiornamento:', err);
            return new Response(
                JSON.stringify({ error: 'Internal server error.' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    // Ignora eventi non rilevanti
    return new Response('Evento ignorato', { status: 200 });
}
