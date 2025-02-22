import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const jwt = (await cookies().get("jwt"))?.value;

    if (!file) {
      return NextResponse.json({ error: "Devi selezionare un file JSON." }, { status: 400 });
    }

    const content = await file.text();
    const ranking = JSON.parse(content);    

    if (!Array.isArray(ranking)) {
      return NextResponse.json({ error: "Il file deve contenere un array di giocatori." }, { status: 400 });
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/ranking/upload`,
      { ranking },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    console.log("✔️ Caricamento completato:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("❌ Errore durante il caricamento del file JSON:", error);
    return NextResponse.json({ error: "Errore durante il caricamento del file." }, { status: 500 });
  }
}
