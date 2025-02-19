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

    let count = 0;
    let skipped = 0; 
    for (const player of players) {
      const existingPlayers = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/players?filters[aifg_code][$eq]=${encodeURIComponent(player.aifg_code)}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      if (existingPlayers.data.data.length > 0) {
        skipped++;
        continue; // Salta se il giocatore esiste già
      }

      if (player) {
        try {
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
        } catch (postError) {
          console.error("Errore durante l'invio del giocatore:", postError);
        }
      }
    }

    return NextResponse.json({ count, skipped });
  } catch (error) {
    console.error("Errore caricando il file JSON:", error);
    return NextResponse.json({ error: "Errore durante il caricamento del file." }, { status: 500 });
  }
}
