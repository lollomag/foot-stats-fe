"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getLocations, createTournament } from "@/lib/strapi";

const TournamentUpload = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [locations, setLocations] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [par, setPar] = useState(0);
  const [results, setResults] = useState("");

  const jwt = Cookies.get("jwt");

  useEffect(() => {
    // Fetch delle location da Strapi
    const fetchLocations = async () => {
      if (jwt) {
        const data = await getLocations(jwt);
        setLocations(data.data);
      }
    };

    fetchLocations();
  }, [jwt]);

  const handleSubmit = async () => {
    if (!title || !location || !type || !date || !results) {
      alert("Compila tutti i campi richiesti.");
      return;
    }

    try {
      const tournamentData = {
        title,
        location,
        type,
        date,
        par,
        results: JSON.stringify(JSON.parse(results)),
      };

      await createTournament(jwt || "", tournamentData);
      alert("Torneo caricato con successo!");
    } catch (error) {
      console.error("Errore caricando il torneo:", error);
      alert("Errore caricando il torneo.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Carica un Nuovo Torneo</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Titolo</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Inserisci il titolo" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Data</label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Location</label>
        <Select onValueChange={setLocation}>
          <SelectTrigger>{location || "Seleziona una location"}</SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tipo</label>
        <Select onValueChange={setType}>
          <SelectTrigger>{type || "Seleziona il tipo"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="Nazionale">Nazionale</SelectItem>
            <SelectItem value="Interregionale">Interregionale</SelectItem>
            <SelectItem value="Regionale">Regionale</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">PAR</label>
        <Input type="number" value={par} onChange={(e) => setPar(Number(e.target.value))} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Risultati (JSON)</label>
        <Textarea
          value={results}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e: any) => setResults(e.target.value)}
          placeholder='Inserisci i risultati in formato JSON (es. [{"player": "Nome"}])'
        />
      </div>
      <Button onClick={handleSubmit}>Carica Torneo</Button>
    </div>
  );
};

export default TournamentUpload;
