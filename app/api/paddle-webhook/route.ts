import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (body.event_type === "transaction.completed") {
    const userId = body.data.custom_data.user_id;
    const tier = body.data.custom_data.tier;

    await supabase.from("pack_purchases").insert({
      user_id: userId,
      pack_name: "dark_psychology",
      tier: tier,
    });
  }

  return NextResponse.json({ success: true });
}