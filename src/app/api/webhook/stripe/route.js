import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false, // Disabilita il parser del corpo
    },
};

async function buffer(readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export async function POST(req) {
    console.log('Richiesta ricevuta al webhook Stripe');

    const sig = req.headers['stripe-signature']; // Ottieni la firma
    if (!sig) {
        console.error('Errore: Intestazione stripe-signature mancante.');
        return new Response(
            JSON.stringify({ error: 'Missing stripe-signature header.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const buf = await buffer(req); // Leggi il corpo come buffer
    console.log('Buffer ricevuto:', buf.toString());

    try {
        // Verifica la firma del webhook
        const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('Evento Stripe verificato:', event.type);

        // Gestisci gli eventi rilevanti
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('Evento session.completed ricevuto:', session);

            // Aggiungi la tua logica (es. aggiornamento di un database)
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
