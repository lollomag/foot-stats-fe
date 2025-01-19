"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import Pagination from "@/components/Pagination";
import { getTournaments } from "@/lib/strapi";
import { XIcon } from "lucide-react";
import { TournamentCard } from "@/components/TournamentCard";

const TournamentsPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tournaments, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jwt = Cookies.get("jwt");

  const fetchPlayers = useCallback(
    async (pageNum = 1) => {
      const data = await getTournaments(jwt || "", pageNum);
      
      setPlayers(data);
      setTotalPages(data.meta?.pagination.pageCount || 1);
    },
    [jwt]
  );

  useEffect(() => {
    fetchPlayers(page)
  }, [page]);

  return (
    <>
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
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              id={tournament.id}
              title={tournament.title}
              location={tournament.location.name}
              type={tournament.type}
              par={tournament.par}
              date={tournament.date}
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
    </>
  );
};

export default TournamentsPage;
