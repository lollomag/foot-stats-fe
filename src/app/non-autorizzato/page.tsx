import Link from "next/link";

export default function UnauthorizedPage() {
  return (
      <div className="container mx-auto my-8">
        <h1 className="text-2xl font-bold mb-4">Non sei autorizzato a visitare questa pagina</h1>
        <p>Torna alla lista <Link className="underline" href="/giocatori">giocatori</Link></p>
      </div>
  );
}