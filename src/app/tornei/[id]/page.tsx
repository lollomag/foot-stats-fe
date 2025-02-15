import { getTournamentsDetails } from "../../../lib/strapi";
import { Calendar, MapPin } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import TournamentAverageScore from "@/components/TournamentAverageScore";
import dayjs from "dayjs";
import 'dayjs/locale/it';

interface SingleTournamentProps {
  params: Promise<{ id: string }>;
}

export default async function SingleTournament({ params }: SingleTournamentProps) {
  const { id } = await params;
  const jwt = (await cookies())?.get("jwt")?.value;
  const { title, date, location, statistics } = await getTournamentsDetails(jwt || "", id);

  return (
    <div>
      <h1 className="text-2xl lg:text-5xl font-semibold">{title}</h1>
      <div className="flex items-center gap-3 mt-6">
        <Calendar />
        <p className="text-lg font-semibold">{dayjs(date).locale("it").format("DD MMMM YYYY")}</p>
      </div>
      <div className="flex items-center gap-3 mt-6">
        <MapPin />
        <Link
          href={location.link}
          target="_blank"
          className="underline hover:no-underline text-lg font-semibold"
        >
          {location.name}
        </Link>
      </div>
      <TournamentAverageScore statistics={statistics}/>
    </div>
  );
}
