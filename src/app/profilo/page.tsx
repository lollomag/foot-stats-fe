import { PageNotFound } from "@/components/PageNotFound";
import { cookies } from "next/headers";

export default async function Profile() {
  const jwt = (await cookies()).get('jwt')?.value;

  if (!jwt) return <PageNotFound />
  return (
    <div>
      Profilo
    </div>
  );
}
