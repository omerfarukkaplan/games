import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch("https://api.paddle.com/transactions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          price_id: process.env.PADDLE_PRICE_ID,
          quantity: 1,
        },
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: 500 });
  }

  return NextResponse.json({
    checkout_url: data.data.checkout.url,
  });
}