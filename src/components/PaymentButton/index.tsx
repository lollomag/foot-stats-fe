"use client"
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { Button } from "../ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const PaymentButton = ({ priceId, label }: {priceId: string, label: string}) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    

    // Call API to create a checkout session
    const { data } = await axios.post("/api/checkout-session", { priceId });

    // Redirect to Stripe Checkout
    await stripe?.redirectToCheckout({ sessionId: data.sessionId });
  };

  return <Button onClick={handleCheckout}>{label}</Button>;
};

export default PaymentButton;
