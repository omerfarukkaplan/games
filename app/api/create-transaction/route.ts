import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.PADDLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing PADDLE_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://sandbox-api.paddle.com/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        items: [
          {
            price_id: "pri_01kj10pm3304a70q4t0hs1f0r0", // kendi price id
            quantity: 1,
          },
        ],
        customer: {
          email: "test@test.com",
        },
      }),
    });

    const text = await res.text(); // ham cevabı al
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      // HATA MESAJINI FRONTEND’E AYNEN DÖN
      return NextResponse.json(
        { paddle_status: res.status, paddle_error: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Transaction failed" },
      { status: 500 }
    );
  }
}