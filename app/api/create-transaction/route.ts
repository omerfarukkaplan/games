import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
    const PRICE_ID = "pri_01kj10pm3304a70q4t0hs1f0r0"; // ⚠️ BURAYA GERÇEK pri_ ID

    const response = await fetch("https://sandbox-api.paddle.com/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PADDLE_API_KEY}`,
      },
      body: JSON.stringify({
        items: [
          {
            price_id: PRICE_ID,
            quantity: 1,
          },
        ],
        custom_data: {
          user_id: userId, // 🔥 webhook için kritik
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          paddle_status: response.status,
          paddle_error: data,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      checkout_url: data.data.checkout.url,
    });

  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}