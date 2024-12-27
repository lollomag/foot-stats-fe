"use client"
import { Button } from "../ui/button";
import { useUser } from "@/context/UserContext";


const PaymentButton = ({ priceId, label }: { priceId: string, label: string }) => {
  const { user } = useUser();

  const handleSubscribe = async () => {
    const response = await fetch('/api/checkout/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId: user.id,
      }),
    });

    const { url } = await response.json();
    window.location.href = url; // Reindirizza a Stripe Checkout
  };

  return <Button onClick={handleSubscribe}>{label}</Button>;
};

export default PaymentButton;
