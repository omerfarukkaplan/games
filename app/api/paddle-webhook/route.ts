import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Paddle event kontrolü
  if (body.event_type !== "transaction.completed") {
    return NextResponse.json({ ok: true })
  }

  const userId = body.data.custom_data.user_id
  const coinsPurchased = parseInt(body.data.custom_data.coins)

  if (!userId || !coinsPurchased) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  await supabase
    .from("profiles")
    .update({
      coins: supabase.rpc("increment_coins", { amount: coinsPurchased })
    })
    .eq("id", userId)

  return NextResponse.json({ success: true })
}