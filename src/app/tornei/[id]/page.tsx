import { getTournamentsDetails } from "../../../lib/strapi";
import { MapPin } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

interface SingleTournamentProps {
  params: Promise<{ id: string }>;
}

export default async function SingleTournament({params}: SingleTournamentProps) {
  const { id } = await params;
  const jwt = (await cookies())?.get("jwt")?.value;
  const { title, location } = await getTournamentsDetails(jwt || "", id);

  return (
    <div>
      <h1 className="text-5xl font-semibold">{title}</h1>
      <div className="flex items-center gap-3 mt-6">
        <MapPin />
        <Link
          href={location.link}
          target="_blank"
          className="underline hover:no-underline"
        >
          {location.name}
        </Link>
      </div>
    </div>
  );
}
