import { NextResponse } from "next/server";

export async function POST() {
  const response = await fetch("https://sandbox-api.paddle.com/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
    },
    body: JSON.stringify({
      items: [
        {
          price_id: "pri_01kj10pm3304a7oq4t0hs1f0r0",
          quantity: 1,
        },
      ],
    }),
  });

  const data = await response.json();

  return NextResponse.json(data);
}