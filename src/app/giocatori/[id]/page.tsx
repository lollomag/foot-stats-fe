import { getPlayerDetails } from "../../../lib/strapi";
import { cookies } from "next/headers";
import 'dayjs/locale/it';

interface PlayerDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerDetails({ params }: PlayerDetailsProps) {
  const { id } = await params;
  const jwt = (await cookies())?.get("jwt")?.value;
  const data = await getPlayerDetails(jwt || "", id);

  return (
    <div>
      <h1 className="text-5xl font-semibold">{data.fullname}</h1>
    </div>
  );
}
