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

    let count = 0;
    let skipped = 0;

    const processBatch = async (batch) => {
      for (const player of batch) {
        try {
          const existingPlayerRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/players?filters[aifg_code][$eq]=${encodeURIComponent(player.aifg_code)}`,
            { headers: { Authorization: `Bearer ${jwt}` } }
          );

          if (existingPlayerRes.data.data.length > 0) {
            skipped++;
            continue;
          }

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
        } catch (error) {
          console.error(`❌ Errore con il giocatore ${player.fullname}:`, error);
        }
      }
    };

    // Dividiamo i giocatori in batch da 30 e li elaboriamo in modo asincrono
    const batchSize = 30;
    for (let i = 0; i < players.length; i += batchSize) {
      const batch = players.slice(i, i + batchSize);
      setTimeout(() => processBatch(batch), i * 5000); // **Ogni batch inizia con un delay progressivo**
    }

    console.log(`🚀 Avviato il caricamento batch!`);
    return NextResponse.json({ message: "Caricamento avviato in background!" });

  } catch (error) {
    console.error("❌ Errore caricando il file JSON:", error);
    return NextResponse.json({ error: "Errore durante il caricamento del file." }, { status: 500 });
  }
}


