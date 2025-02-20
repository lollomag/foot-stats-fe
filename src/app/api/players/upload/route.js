import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const jwt = (await cookies().get("jwt"))?.value;

  if (!file) {
    return NextResponse.json({ error: "Devi selezionare un file JSON." }, { status: 400 });
  }

  try {
    const content = await file.text();
    const players = JSON.parse(content);

    if (!Array.isArray(players)) {
      return NextResponse.json({ error: "Il file deve contenere un array di giocatori." }, { status: 400 });
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Funzione di ritardo

    let count = 0;
    let skipped = 0;
    
    for (let i = 0; i < players.length; i += 50) {
      const batch = players.slice(i, i + 50);
      console.log(`🔹 Caricamento batch ${i / 50 + 1} (${batch.length} giocatori)`);

      for (const player of batch) {
        try {
          // Controlla se il giocatore esiste già
          const existingPlayerRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/players?filters[aifg_code][$eq]=${encodeURIComponent(player.aifg_code)}`,
            { headers: { Authorization: `Bearer ${jwt}` } }
          );

          if (existingPlayerRes.data.data.length > 0) {
            skipped++;
            continue; // Salta il giocatore se esiste già
          }

          // Aggiungi il giocatore
          await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/players`, {
            data: {
              fullname: player.fullname,
              aifg_code: player.aifg_code,
              team: player.team,
              interregionale: player.interregionale,
              regionale: player.regionale,
              category: player.category,
            }
          }, { headers: { Authorization: `Bearer ${jwt}` } });

          count++;
          console.log(`✔️ Aggiunto: ${player.fullname} (${count}/${players.length})`);

          await delay(500); // **Aspetta 500ms prima di passare al prossimo giocatore**
        } catch (error) {
          console.error(`❌ Errore con il giocatore ${player.fullname}:`, error);
        }
      }

      console.log(`🕐 Attendo 5 secondi prima di iniziare il prossimo batch...`);
      await delay(5000); // **Aspetta 5 secondi tra un batch e l'altro**
    }

    console.log(`✅ Caricamento completato! ${count} giocatori aggiunti, ${skipped} già esistenti.`);
    return NextResponse.json({ count, skipped });

  } catch (error) {
    console.error("❌ Errore caricando il file JSON:", error);
    return NextResponse.json({ error: "Errore durante il caricamento del file." }, { status: 500 });
  }
}

