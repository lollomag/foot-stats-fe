import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function POST(req) {
  try {
    const { subscriptionId, newPriceId } = await req.json();

    if (!subscriptionId || !newPriceId) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
    }

    // Recupera la sottoscrizione attuale
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const currentPriceId = subscription.items.data[0].price.id;

    if (currentPriceId === newPriceId) {
      return NextResponse.json({ error: 'L’abbonamento è già su questo piano' }, { status: 400 });
    }

    // Aggiorna l’abbonamento con il nuovo piano
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id, // Mantiene lo stesso ID dell’item
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations', // Gestisce eventuali crediti/rimborsi
    });

    return NextResponse.json({
      success: true,
      message: 'Hai aggiornato il tuo abbonamento al piano annuale!',
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error('Errore durante l’aggiornamento della sottoscrizione:', error);
    return NextResponse.json(
      { error: 'Errore durante l’aggiornamento della sottoscrizione' },
      { status: 500 }
    );
  }
}
