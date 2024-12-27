import HeroHome from "@/components/HeroHome";
import PaymentButton from "@/components/PaymentButton";

export default async function Home() {

  return (
    <div>
      <HeroHome />
      <div className="flex gap-5">
        <PaymentButton priceId={"price_1QYnaSITuH8atYtFZKAZAdFU"} label="Abbonamento mensile" />
        <PaymentButton priceId={"price_1QYna9ITuH8atYtFWJIJKfH8"} label="Abbonamento annuale" />
        {/* <a href="https://buy.stripe.com/test_bIYaHkg75701deoaEE?locale=it">test mensile</a> */}
      </div>
    </div>
  );
}
