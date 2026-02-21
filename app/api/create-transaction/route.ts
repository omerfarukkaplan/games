import { NextResponse } from "next/server";

export async function POST() {
  try {
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
        customer: {
          email: "test@test.com",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}