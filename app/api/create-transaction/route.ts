import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.PADDLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing API key" },
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
              price_id: "pri_01kj10pm3304a7oq4t0hs1f0r0",
              quantity: 1,
            },
          ],
          customer: {
            email: "test@test.com",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { paddle_error: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Transaction failed" },
      { status: 500 }
    );
  }
}