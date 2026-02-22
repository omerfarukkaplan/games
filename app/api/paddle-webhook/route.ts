import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.event_type !== "transaction.completed") {
    return NextResponse.json({ ok: true });
  }

  const userId = body.data.custom_data?.user_id;

  if (!userId) {
    return NextResponse.json({ error: "no user id" }, { status: 400 });
  }

  await supabaseServer.rpc("increment_user_coins", {
    user_id: userId,
    amount: 1000,
  });

  return NextResponse.json({ success: true });
}