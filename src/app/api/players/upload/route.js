import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const jwt = (await cookies()).get('jwt')?.value;

  if (!file) {
    return NextResponse.json({ error: "Devi selezionare un file JSON." }, { status: 400 });
  }

  try {
    const content = await file.text();
    const players = JSON.parse(content);

    if (!Array.isArray(players)) {
      return NextResponse.json({ error: "Il file deve contenere un array di giocatori." }, { status: 400 });
    }
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Funzione di ritardo

    let count = 0;
    let skipped = 0; 

    for (const player of players) {
      try {
        // Controlla se il giocatore esiste già
        const existingPlayers = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/players?filters[aifg_code][$eq]=${encodeURIComponent(player.aifg_code)}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        if (existingPlayers.data.data.length > 0) {
          skipped++;
          continue; // Salta il giocatore se esiste già
        }

        // Aggiungi il giocatore se non esiste
        await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/players`, {
          data: {
            fullname: player.fullname,
            aifg_code: player.aifg_code,
            team: player.team,
            interregionale: player.interregionale,
            regionale: player.regionale,
            category: player.category
          },
        }, {
          headers: { "Authorization": `Bearer ${jwt}` },
        });

        count++;
        console.log(`✔️ Aggiunto: ${player.fullname} (${count}/${players.length})`);

        // **Aspetta 1000ms prima di passare al prossimo giocatore**
        await delay(1000);
      } catch (error) {
        console.error(`❌ Errore con il giocatore ${player.fullname}:`, error);
      }
    }

    return NextResponse.json({ count, skipped });
  } catch (error) {
    console.error("Errore caricando il file JSON:", error);
    return NextResponse.json({ error: "Errore durante il caricamento del file." }, { status: 500 });
  }
}
