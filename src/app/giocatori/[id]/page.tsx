import { getPlayerDetails, getPlayerStatistics } from "../../../lib/strapi";
import { cookies } from "next/headers";
import 'dayjs/locale/it';
import PlayerStatsFilter from "@/components/PlayerStatsFilter";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PlayerDetails({ params, searchParams }: any) {
  const { id } = await params;

  const jwt = (await cookies())?.get("jwt")?.value;
  const selectedYear = searchParams.year || "all";
  const data = await getPlayerDetails(jwt || "", id);
  const statistics = await getPlayerStatistics(jwt || "", id, selectedYear);

  return (
    <div>
      <h1 className="text-3xl lg:text-5xl font-semibold">{data.fullname}</h1>
      <PlayerStatsFilter />
      {!!statistics.message &&
        <p className="text-xl font-semibold mt-6">{statistics.message}</p>
      }
      {!statistics.message && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <StatCard title="Numero di gare giocate" value={statistics.totalTournaments} />
          <StatCard title="Miglior Posizionamento" value={statistics.bestPosition} />
          <StatCard title="Miglior Punteggio" value={statistics.bestScore} />
          <StatCard title="Media colpi nei par 3" value={statistics.averagePar3} />
          <StatCard title="Media colpi nei par 4" value={statistics.averagePar4} />
          <StatCard title="Media colpi nei par 5" value={statistics.averagePar5} />
          <StatCard title="Posizione media" value={statistics.averagePosition.toFixed(2)} />
          <StatCard title="Conteggio hole in 1" value={statistics.holeInOneCount} />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-2xl text-green-600">{value}</p>
    </div>
  );
}