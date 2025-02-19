"use client"

import { cn } from "@/lib/utils";
import { Accordion, AccordionItem } from "../ui/accordion";
import { AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TournamentLeaderboard({ results, par, players }: any) {
  const pathname = usePathname();
  const getScoreColor = (hit: number, par: number) => {
    const diff = hit - par;
    if (diff <= -2) return "bg-blue-500"; // Eagle o migliore
    if (diff === -1) return "bg-green-500"; // Birdie
    if (diff === 0) return "bg-gray-400"; // Par
    if (diff === 1) return "bg-orange-400"; // Bogey
    if (diff === 2) return "bg-red-500"; // Double Bogey
    return "bg-red-700"; // Oltre Double Bogey
  };
  const router = useRouter();

  const navigateToPlayer = (player: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerData = players.find((p: any) => p.fullname === player);
    router.push(`${pathname}/giocatore/${playerData.id}`);
  }
  
  return (
    <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {results.map((player: any, index: number) => (
        <AccordionItem key={index} value={player.player} className="border border-black shadow-lg rounded-sm">
          <div className="flex items-center p-4 w-full gap-5">
            <span className="text-xl font-semibold">{index + 1}</span>
            <button onClick={() => navigateToPlayer(player.player)} className="text-lg font-medium">{player.player}</button>
            <span className="text-xl font-bold ml-auto">{player.total - par}</span>
            <AccordionTrigger><ChevronDown /></AccordionTrigger>
          </div>

          <AccordionContent className="overflow-x-auto transition-all duration-300 ease-in-out">
            <div className="min-w-[600px] flex p-4 bg-gray-100 rounded-b">
              <div className="hidden md:block">
                <p className="w-10 h-10 flex items-center">Tee</p>
                <p className="w-10 h-10 flex items-center">Par</p>
              </div>
              {player.result.map((hole: {hole: number, par: number, hit: number}) => (
                <div key={hole.hole} className="w-full">
                  <div
                    className="bg-gray-100 h-8 md:h-10 flex items-center justify-center text-black font-bold border border-black"
                  >
                    {hole.hole}
                  </div>
                  <div
                    className="bg-gray-100 h-8 md:h-10 flex items-center justify-center text-black font-bold border border-black"
                  >
                    {hole.par}
                  </div>
                  <div
                    className={cn(
                      "w-full h-8 md:h-10 flex items-center justify-center text-white font-bold border border-black",
                      getScoreColor(hole.hit, hole.par)
                    )}
                  >
                    {hole.hit}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}