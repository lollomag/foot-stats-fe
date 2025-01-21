"use client"
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TournamentCardProps {
  title: string;
  type: string;
  par: number;
  date: string;
  location: string;
  id: string;
}

const typeBadgeColors: Record<string, string> = {
  Nazionale: "bg-blue-100 text-blue-800",
  Interregionale: "bg-green-100 text-green-800",
  Regionale: "bg-yellow-100 text-yellow-800",
};

export const TournamentCard: React.FC<TournamentCardProps> = ({
  title,
  type,
  par,
  date,
  location,
  id,
}) => {
  const router = useRouter();

  const handleDetails = () => {
    router.push(`/tornei/${id}`);
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 hover:shadow-md transition-shadow">
      <Badge className={`mb-4 text-sm font-medium px-2 py-1 rounded ${typeBadgeColors[type]}`}>
        {type}
      </Badge>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <p>
          <span className="font-bold">Data:</span> {new Date(date).toLocaleDateString("it-IT")}
        </p>
        <p>
          <span className="font-bold">Par:</span> {par}
        </p>
        <p>
          <span className="font-bold">Location:</span> {location}
        </p>
      </div>
      <div className="mt-4">
        <Button onClick={handleDetails} className="w-full">
          Vai al dettaglio
        </Button>
      </div>
    </div>
  );
};
