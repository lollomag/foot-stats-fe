"use client"
import { StarIcon } from "lucide-react"; // Icona per i preferiti
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PlayerProps {
  id: number;
  name: string;
  stats?: { key: string; value: string }[]; // Array di statistiche
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

const PlayerCard = ({ id, name, stats = [], isFavorite, onToggleFavorite }: PlayerProps) => {
  const router = useRouter();

  const handleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };
  

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold">{name}</h2>
        <button onClick={handleFavorite} className="text-green-800">
          <StarIcon className={isFavorite ? "fill-green-800" : "stroke-green-800"} />
        </button>
      </div>
      <div className="mt-2 mb-6">
        <h3 className="text-sm font-medium text-gray-600">Statistiche</h3>
        <ul className="mt-1 space-y-1">
          {stats.length > 0 ? (
            stats.map((stat, index) => (
              <li key={index} className="text-sm text-gray-800">
                {stat.key}: <span className="font-semibold">{stat.value}</span>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-400">Nessuna statistica disponibile</p>
          )}
        </ul>
      </div>
      <div className="mt-auto flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.push(`/players/${id}`)}>
          Dettagli
        </Button>
      </div>
    </div>
  );
};

export default PlayerCard;
