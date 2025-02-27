"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getRanking } from "@/lib/strapi";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

export default function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Men");
  // Recupera il ranking più recente da Strapi
  const fetchRanking = async () => {
    try {
      const response = await getRanking();
      if (!response) throw new Error("Errore nel recupero del ranking!");

      const parsedRanking = response.ranking;

      // Estrai le categorie disponibili
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uniqueCategories: any = [...new Set(parsedRanking.map((p: any) => p.category))];
      console.log(uniqueCategories);

      setCategories(uniqueCategories);

      // Filtra per la categoria selezionata
      const filteredRanking = parsedRanking
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((p: any) => p.category === selectedCategory)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .sort((a: any, b: any) => b.totalPoints - a.totalPoints);

      setRanking(filteredRanking);
    } catch (error) {
      toast.error("Errore nel caricamento del ranking!");
      console.info(error);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, [selectedCategory]);

  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-4">Classifica Ranking</h1>

      <div className="mb-8">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>{selectedCategory || "Seleziona una location"}</SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabella del ranking */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Posizione</th>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Gare giocate</th>
              <th className="p-2 text-left">Punti Totali</th>
              {/* <th className="p-2 text-left">Andamento Settimanale</th> */}
            </tr>
          </thead>
          <tbody>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {ranking.map((player: any) => (
              <tr key={player.name} className="border-t">
                <td className="p-2">{player.rankingPosition}</td>
                <td className="p-2">{player.name}</td>
                <td className="p-2">{player.gamesPlayed}</td>
                <td className="p-2">{player.totalPoints}</td>
                {/* <td className="p-2">
                  <small className="text-gray-500">
                    {Object.entries(player.weeklyPoints)
                      .map(([date, points]) => `${date}: ${points}`)
                      .join(" | ")}
                  </small>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
