"use client"
import HeroHome from "@/components/HeroHome";
import PaymentButton from "@/components/PaymentButton";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { user } = useUser();

  return (
    <div>
      <HeroHome />
      {user && !user.subscriptionActive && (
        <div className="flex gap-5">
          <PaymentButton priceId={"price_1QYnaSITuH8atYtFZKAZAdFU"} label="Abbonamento mensile" />
          <PaymentButton priceId={"price_1QYna9ITuH8atYtFWJIJKfH8"} label="Abbonamento annuale" />
        </div>
      )}
    </div>
  );
}
