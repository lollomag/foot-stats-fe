import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function GET(req) {
  const customerId = req.nextUrl.searchParams.get('customerId'); // Ottieni l'ID cliente dalla query string

  if (!customerId) {
    return NextResponse.json({ error: 'Customer ID mancante.' }, { status: 400 });
  }

  try {
    // Recupera i dettagli del cliente
    const customer = await stripe.customers.retrieve(customerId);

    // Recupera gli abbonamenti attivi del cliente
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all', // Può essere "active", "canceled", "past_due", ecc.
    });

    // Recupera lo storico dei pagamenti
    const payments = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 10, // Puoi personalizzare il numero di pagamenti da restituire
    });

    return NextResponse.json({
      customer,
      subscriptions: subscriptions.data,
      payments: payments.data,
    });
  } catch (error) {
    console.error('Errore durante il recupero dei dati di Stripe:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dei dati di Stripe.' },
      { status: 500 }
    );
  }
}
