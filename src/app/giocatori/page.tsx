import { PageNotFound } from "@/components/PageNotFound";
import { cookies } from "next/headers";

export default async function Players() {
  const jwt = (await cookies()).get('jwt')?.value;

  if (!jwt) return <PageNotFound />
  return (
    <div>
      giocatori
    </div>
  );
}
