import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false, // Disabilita il parser JSON per mantenere il buffer intatto
    },
};


export async function POST(req) {
    console.log('Stripe Signature:', req.headers['stripe-signature']);
    const sig = req.headers.get('stripe-signature'); // Ottieni l'intestazione `stripe-signature`
    if (!sig) {
        console.error('Errore: Intestazione stripe-signature mancante.');
        return new Response(
            JSON.stringify({ error: 'Missing stripe-signature header.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    console.log('Intestazione stripe-signature ricevuta:', sig);

    const buf = await req.text(); // Leggi il corpo della richiesta come buffer
    console.log('Buffer del corpo della richiesta:', buf);

    try {
        // Verifica l'autenticità del webhook
        const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);

        // Gestisci il tipo di evento
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('Evento session.completed ricevuto:', session);

            // Inserisci qui la tua logica per aggiornare Strapi
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

        return new Response('Webhook ricevuto', { status: 200 });
    } catch (err) {
        console.error('Errore nella verifica del webhook:', err);
        return new Response(
            JSON.stringify({ error: 'Webhook verification failed.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
