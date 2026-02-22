"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Header() {
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("coins")
        .eq("id", data.user.id)
        .single();

      setCoins(profile?.coins || 0);

      supabase
        .channel("coins")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "profiles" },
          (payload) => {
            if (payload.new.id === data.user.id) {
              setCoins(payload.new.coins);
            }
          }
        )
        .subscribe();
    };

    load();
  }, []);

  return (
    <header className="flex justify-between items-center p-6 border-b border-white/10 backdrop-blur-xl">
      <Link href="/" className="text-xl font-bold text-pink-500">
        FollowOps
      </Link>

      <div className="flex gap-6 items-center">
        <Link href="/play">Play</Link>
        <Link href="/dashboard">Dashboard</Link>

        <div className="bg-yellow-400 text-black px-4 py-1 rounded-full font-bold">
          {coins} Coins
        </div>
      </div>
    </header>
  );
}