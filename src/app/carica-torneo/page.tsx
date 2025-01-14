"use client";
import { useState } from "react";
import Cookies from "js-cookie";

export default function ImportTournament() {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState("");
  const [message, setMessage] = useState("");
  const jwt = Cookies.get("jwt");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/import-tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({
          title,
          results: JSON.parse(results), // 🔥 Converte il testo JSON in oggetto
        }),
      });

      const data = await response.json();
      setMessage(data.message || "Errore durante l'importazione");
    } catch (error) {
      setMessage("Errore durante l'importazione");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Importa Torneo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome del Torneo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Incolla JSON con i risultati"
          value={results}
          onChange={(e) => setResults(e.target.value)}
          className="border p-2 w-full"
          rows={8}
          required
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Importa Torneo
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
