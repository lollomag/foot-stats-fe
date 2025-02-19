import { getTournamentsDetails } from "../../../lib/strapi";
import { Calendar, MapPin } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import TournamentAverageScore from "@/components/TournamentAverageScore";
import dayjs from "dayjs";
import 'dayjs/locale/it';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TournamentLeaderboard from "@/components/TournamentLeaderboard";

interface SingleTournamentProps {
  params: Promise<{ tournamentId: string }>;
}

export default async function SingleTournament({ params }: SingleTournamentProps) {
  const { tournamentId } = await params;
  const jwt = (await cookies())?.get("jwt")?.value;
  const { title, date, location, statistics, results, par, players } = await getTournamentsDetails(jwt || "", tournamentId);

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
      <Tabs defaultValue="holes">
        <TabsList className="my-7">
          <TabsTrigger value="holes" className="text-left justify-start">
            Statistiche buche
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-left justify-start">
            Classifica
          </TabsTrigger>
        </TabsList>

        <TabsContent value="holes">
          <h2 className="sr-only">Dati Utente</h2>
          <TournamentAverageScore statistics={statistics} />
        </TabsContent>

        <TabsContent value="leaderboard">
          <h2 className="sr-only">Classifica</h2>
          <TournamentLeaderboard results={results} par={par} players={players}/>
        </TabsContent>
      </Tabs>

    </div>
  );
}
