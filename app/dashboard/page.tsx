import Dashboard from "@/components/Dashboard";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Cookie: cookies().toString() } } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-white p-10">Not logged in</div>;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <Dashboard profile={profile} />;
}