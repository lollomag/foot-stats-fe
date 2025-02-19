"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function AddPlayersPage() {
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
