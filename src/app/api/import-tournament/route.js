import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tournaments/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.get('authorization')
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: "Errore durante l'importazione" }, { status: 500 });
  }
}
