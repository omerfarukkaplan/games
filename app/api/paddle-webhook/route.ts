import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.event_type !== "transaction.completed") {
      return NextResponse.json({ received: true });
    }

    const transaction = body.data;
    const transactionId = transaction.id;

    const userId = transaction.custom_data?.user_id;

    if (!userId) {
      return NextResponse.json({ error: "No user_id" }, { status: 400 });
    }

    // Daha önce işlendi mi?
    const { data: existing } = await supabase
      .from("paddle_transactions")
      .select("*")
      .eq("transaction_id", transactionId)
      .single();

    if (existing) {
      return NextResponse.json({ message: "Already processed" });
    }

    // Coin ekle
    const COINS_TO_ADD = 1000;

    await supabase.rpc("increment_coins", {
      user_id_input: userId,
      amount_input: COINS_TO_ADD,
    });

    // Transaction kaydet
    await supabase.from("paddle_transactions").insert({
      transaction_id: transactionId,
      user_id: userId,
      coins_added: COINS_TO_ADD,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}