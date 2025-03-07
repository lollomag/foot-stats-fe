import 'dayjs/locale/it';
import PlayerDetails from "@/components/PlayerDetails";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PlayerDetailsPage({ params, searchParams }: any) {
  const { id } = await params;
  const { year: selectedYear = "all" } = await searchParams;

  return (
    <PlayerDetails playerId={id} selectedYear={selectedYear} />
  );
}