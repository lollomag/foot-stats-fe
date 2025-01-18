"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import PlayerCard from "@/components/PlayerCard";
import Cookies from "js-cookie";
import Pagination from "@/components/Pagination";
import { addToFavourites, getTournaments } from "@/lib/strapi";
import { XIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";

const TournamentsPage = () => {
  const { user, refreshUser } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jwt = Cookies.get("jwt");

  const fetchPlayers = useCallback(
    async (pageNum = 1) => {
      const data = await getTournaments(jwt || "", pageNum);
      setPlayers(data);
      setTotalPages(data.meta.pagination.pageCount);
    },
    [jwt]
  );

  useEffect(() => {
    fetchPlayers(page)
  }, [page]);

  const toggleFavorite = async (playerId: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const favoriteIds = user.favorites.map((favorite: any) => favorite.id)

    try {
      await addToFavourites(jwt || "", playerId, user.id, favoriteIds)
      await refreshUser()
    } catch (error) {
      console.error(error);
    }
  };

  const isFavorite = (playerId: number) => {
    if (!user) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const findFavorite = user.favorites.some((fav: any) => fav.id === playerId);
    return findFavorite
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Lista Tornei</h1>
      <div className="relative w-full max-w-[500px] mb-4">
        <Input
          type="text"
          placeholder="Cerca per nome..."
          className="w-full pr-10"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {search && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setSearch("")}
          >
            <XIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.length > 0 ? (
          players.map((player) => (
            <PlayerCard
              key={player.id}
              id={player.id}
              name={player.location}
              stats={[]}
              isFavorite={isFavorite(player.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <p className="text-gray-500">Nessun giocatore trovato.</p>
        )}
      </div>
      <div className="w-full mt-6 flex justify-center fixed bottom-0 left-1/2 translate-x-[-50%] py-4 bg-white shadow-md">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default TournamentsPage;
