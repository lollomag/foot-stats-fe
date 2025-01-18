"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { uploadPlayers } from "@/lib/strapi";
import Cookies from "js-cookie";

export default function AddPlayersPage() {
  const jwt = Cookies.get("jwt");
  const [fullname, setFullname] = useState<string>("");
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Funzione per aggiungere un singolo giocatore
  const handleAddPlayer = async () => {
    if (!fullname) {
      setMessage("Il campo fullname è obbligatorio.");
      return;
    }

    try {
      const response = await uploadPlayers(jwt || "", fullname);
      setMessage(`Giocatore ${response.data.fullname} aggiunto con successo!`);
      setFullname(""); // Resetta il campo
    } catch (error) {
      console.error("Errore aggiungendo il giocatore:", error);
      setMessage("Errore durante l'aggiunta del giocatore.");
    }
  };

  // Funzione per caricare un file JSON
  const handleUploadJson = async () => {
    if (!jsonFile) {
      setMessage("Devi selezionare un file JSON.");
      return;
    }

    const formData = new FormData();
    formData.append("file", jsonFile);

    try {
      const response = await axios.post("/api/players/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`File caricato con successo! ${response.data.count} giocatori aggiunti. ${response.data.skipped} saltati perchè doppioni`);
      setJsonFile(null); // Resetta il campo file
    } catch (error) {
      console.error("Errore caricando il file JSON:", error);
      setMessage("Errore durante il caricamento del file.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Aggiungi Giocatori</h1>

      {/* Form per aggiungere un singolo giocatore */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Aggiungi un singolo giocatore</h2>
        <div className="flex gap-4">
          <Input
            placeholder="Inserisci il nome completo del giocatore"
            value={fullname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullname(e.target.value)}
          />
          <Button onClick={handleAddPlayer}>Aggiungi</Button>
        </div>
      </div>

      {/* Form per caricare un file JSON */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Carica un file JSON</h2>
        <div className="flex gap-4">
          <Input
            type="file"
            accept=".json"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJsonFile(e.target.files?.[0] || null)}
            className="cursor-pointer"
          />
          <Button onClick={handleUploadJson}>Carica File</Button>
        </div>
      </div>

      {/* Messaggi di stato */}
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
