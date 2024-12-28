import Link from "next/link";

export function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-red-500 text-4xl font-bold mb-5">Non sei autenticato.</p>
      <Link href="/accedi" className="text-blue-500 underline">
        Vai al Login
      </Link>
    </div>
  )
}