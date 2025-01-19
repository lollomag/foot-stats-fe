"use client";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

interface TournamentStats {
  top_20: StatTypeListInterface[];
  top_50: StatTypeListInterface[];
  top_100: StatTypeListInterface[];
}

interface StatTypeListInterface {
  hole: number;
  par: number;
  average_score: number;
  eagle: number;
  birdie: number;
  par_count: number;
  over_par: number;
}

export default function TournamentAverageScore({ statistics }: { statistics: TournamentStats }) {
  const [selectedCategory, setSelectedCategory] = useState<keyof TournamentStats>("top_20");

  const options = [
    { value: "top_20", label: "Top 20" },
    { value: "top_50", label: "Top 50" },
    { value: "top_100", label: "Top 100" },
  ];

  const getSelectedValue = () => {
    const selectedOption = options.find((option) => option.value === selectedCategory);
    return selectedOption?.label || "Seleziona categoria";
  };

  return (
    <div>
      <div className="my-6 max-w-[300px]">
        <label className="block text-lg font-medium mb-2">Seleziona Categoria:</label>
        <Select onValueChange={(e: keyof TournamentStats) => setSelectedCategory(e)}>
          <SelectTrigger className="font-bold">{getSelectedValue()}</SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statistics[selectedCategory]?.map((stats) => (
          <div key={stats.hole} className="border p-4 rounded-lg shadow-lg bg-white">
            <h2 className="text-xl font-semibold">Buca {stats.hole}</h2>
            <p className="text-gray-700">Par: {stats.par}</p>
            <p className="text-gray-700">Punteggio Medio: {stats.average_score.toFixed(2)}</p>
            <p className="text-green-600">Eagle: {stats.eagle}</p>
            <p className="text-blue-600">Birdie: {stats.birdie}</p>
            <p className="text-yellow-600">Par: {stats.par_count}</p>
            <p className="text-red-600">Sopra Par: {stats.over_par}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
