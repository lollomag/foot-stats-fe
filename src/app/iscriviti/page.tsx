import PaymentButton from '@/components/PaymentButton';

const Subscribe: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Scegli il tuo piano di abbonamento</h1>
      <div className="flex gap-4">
        <PaymentButton priceId={"price_1QYnaSITuH8atYtFZKAZAdFU"} label="Abbonamento mensile" />
        <PaymentButton priceId={"price_1QYna9ITuH8atYtFWJIJKfH8"} label="Abbonamento annuale" />
      </div>
    </div>
  );
};

export default Subscribe;
