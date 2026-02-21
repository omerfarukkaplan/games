import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.PADDLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "PADDLE_API_KEY missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://sandbox-api.paddle.com/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          items: [
            {
              price_id: "pri_01kj10pm3304a7oq4t0hs1f0r0", // kendi price id'in
              quantity: 1,
            },
          ],
          customer_email: "test@test.com",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Transaction creation failed" },
      { status: 500 }
    );
  }
}