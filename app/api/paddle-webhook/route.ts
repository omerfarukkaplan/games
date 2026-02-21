import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifySignature(rawBody: string, signature: string) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET!
  const hash = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex")

  return hash === signature
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get("paddle-signature")

  if (!signature || !verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const body = JSON.parse(rawBody)

  if (body.event_type !== "transaction.completed") {
    return NextResponse.json({ ok: true })
  }

  const userId = body.data.custom_data.user_id
  const coins = parseInt(body.data.custom_data.coins)

  if (!userId || !coins) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  await supabase
    .from("profiles")
    .update({
      coins: supabase.rpc("increment_coins", { amount: coins })
    })
    .eq("id", userId)

  return NextResponse.json({ success: true })
}