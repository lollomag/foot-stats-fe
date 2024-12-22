import Link from "next/link";

export default async function PaymentCancel() {

  return (
    <div>
      <p>Pagamento non andato a buon fine !</p>
      <Link href="/">Torna alla home</Link>
    </div>
  );
}
