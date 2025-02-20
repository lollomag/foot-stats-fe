import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const BATCH_SIZE = 50; // Numero massimo di giocatori inviati per batch
const DELAY_BETWEEN_BATCHES = 1000; // Ritardo tra i batch (1 secondo)

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const jwt = (await cookies().get("jwt"))?.value;

    if (!file) {
      return NextResponse.json({ error: "Devi selezionare un file JSON." }, { status: 400 });
    }

    const content = await file.text();
    const players = JSON.parse(content);

    if (!Array.isArray(players)) {
      return NextResponse.json({ error: "Il file deve contenere un array di giocatori." }, { status: 400 });
    }

    console.log(`📂 Caricamento di ${players.length} giocatori suddivisi in batch da ${BATCH_SIZE}`);

    let addedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < players.length; i += BATCH_SIZE) {
      const batch = players.slice(i, i + BATCH_SIZE); // Seleziona i batch da 50 giocatori

      console.log(`🚀 Caricamento batch ${i / BATCH_SIZE + 1}/${Math.ceil(players.length / BATCH_SIZE)}`);

      await Promise.allSettled(
        batch.map(async (player) => {
          try {
            // Controlla se il giocatore esiste già
            const existingPlayers = await axios.get(
              `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/players?filters[aifg_code][$eq]=${encodeURIComponent(player.aifg_code)}`,
              { headers: { Authorization: `Bearer ${jwt}` } }
            );

            if (existingPlayers.data.data.length > 0) {
              skippedCount++;
              return; // Se il giocatore esiste, lo saltiamo
            }

            // Aggiunge il giocatore a Strapi
            await axios.post(
              `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/players`,
              {
                data: {
                  fullname: player.fullname,
                  aifg_code: player.aifg_code,
                  team: player.team,
                  interregionale: player.interregionale,
                  regionale: player.regionale,
                  category: player.category,
                },
              },
              { headers: { Authorization: `Bearer ${jwt}` } }
            );

            addedCount++;
            console.log(`✅ Giocatore aggiunto: ${player.fullname}`);
          } catch (error) {
            console.error(`❌ Errore per ${player.fullname}:`, error.response?.data || error.message);
          }
        })
      );

      console.log(`⏳ Attesa ${DELAY_BETWEEN_BATCHES}ms prima del prossimo batch...`);
      await delay(DELAY_BETWEEN_BATCHES);
    }

    console.log(`🎯 Caricamento completato! ✅ Aggiunti: ${addedCount}, ❌ Saltati: ${skippedCount}`);
    return NextResponse.json({ added: addedCount, skipped: skippedCount });
  } catch (error) {
    console.error("❌ Errore durante il caricamento del file JSON:", error);
    return NextResponse.json({ error: "Errore durante il caricamento del file." }, { status: 500 });
  }
}
