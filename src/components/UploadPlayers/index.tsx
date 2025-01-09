"use client"
import { useState } from "react";

export default function UploadPlayers() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleUpload = async () => {
    if (!file) {
      alert("Seleziona un file JSON!");
      return;
    }

    setLoading(true);
    setResponseMessage("");
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (!event.target) return;
        const jsonData = JSON.parse(event.target.result as string) as { data: string[] };

        const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/players`;

        const headers = {
          "Content-Type": "application/json",
        };

        let successCount = 0;
        let errorCount = 0;

        // Invio con attesa tra richieste per evitare problemi
        for (const [index, giocatore] of jsonData.data.entries()) {
          try {
            const response = await fetch(apiUrl, {
              method: "POST",
              headers,
              body: JSON.stringify({ data: { fullname: giocatore } }),
            });

            if (response.ok) {
              successCount++;
            } else {
              errorCount++;
            }

            // Aggiorna il progresso
            setProgress(Math.round(((index + 1) / jsonData.data.length) * 100));

            // Attendi 100ms tra le richieste per evitare problemi di sovraccarico
            await delay(100);

          } catch (error) {
            console.error("Errore durante il caricamento di", giocatore, error);
            errorCount++;
          }
        }

        setResponseMessage(`Caricamento completato: ${successCount} successi, ${errorCount} errori.`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setResponseMessage("Errore durante il caricamento: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Carica Giocatori su Strapi</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? `Caricamento... (${progress}%)` : "Carica Giocatori"}
      </button>
      <p>Progresso: {progress}%</p>
      <pre>{responseMessage}</pre>
    </div>
  );
}
