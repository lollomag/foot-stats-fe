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

    const batchSize = 50; // Limite di batch per evitare problemi di upload
    let count = 0;
    let skipped = 0; 
    for (let i = 0; i < players.length; i += batchSize) {
      const batch = players.slice(i, i + batchSize);
  
      // Controlla i giocatori esistenti in parallelo
      const existingPlayersResponses = await Promise.all(
        batch.map(player =>
          axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/players?filters[aifg_code][$eq]=${encodeURIComponent(player.aifg_code)}`,
            { headers: { Authorization: `Bearer ${jwt}` } }
          )
        )
      );
  
      const existingPlayers = existingPlayersResponses.map(res => res.data.data);
  
      // Filtra solo i nuovi giocatori da aggiungere
      const newPlayers = batch.filter((player, index) => existingPlayers[index].length === 0);
  
      if (newPlayers.length === 0) {
        skipped += batch.length;
        continue;
      }
  
      try {
        await Promise.all(
          newPlayers.map(player =>
            axios.post(
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
            )
          )
        );
        count += newPlayers.length;
      } catch (postError) {
        console.error("Errore durante l'invio dei giocatori:", postError);
      }
    }
    console.log(`✔️ Caricamento completato: ${count} giocatori aggiunti, ${skipped} saltati.`);

    return NextResponse.json({ count, skipped });
  } catch (error) {
    console.error("Errore caricando il file JSON:", error);
    return NextResponse.json({ error: "Errore durante il caricamento del file." }, { status: 500 });
  }
}
