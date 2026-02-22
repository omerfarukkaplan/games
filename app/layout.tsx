"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [coins, setCoins] = useState<number | null>(null);

  useEffect(() => {
    fetchCoins();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchCoins();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchCoins = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCoins(null);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user.id)
      .single();

    if (data) setCoins(data.coins);
  };

  const isZero = coins === 0;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <div className="min-h-screen flex flex-col">

          {/* HEADER */}
          <header className="w-full flex justify-between items-center px-6 py-4 border-b border-white/10">

            <Link href="/play" className="text-lg font-bold tracking-tight">
              🚩 FollowOps
            </Link>

            <div className="flex items-center gap-6">

              <nav className="hidden md:flex gap-6 text-sm opacity-80">
                <Link href="/play" className="hover:opacity-100">
                  Play
                </Link>
                <Link href="/dashboard" className="hover:opacity-100">
                  Dashboard
                </Link>
              </nav>

              {coins !== null && (
                <div className="flex items-center gap-4">

                  {/* Coin Display */}
                  <div
                    className={`px-4 py-1 rounded-xl text-sm border transition ${
                      isZero
                        ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                        : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                    }`}
                  >
                    🪙 {coins}
                  </div>

                  {/* Buy Coins */}
                  <Link
                    href="/buycoins"
                    className={`px-4 py-1 rounded-xl text-sm font-semibold transition ${
                      isZero
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-yellow-500 text-black hover:opacity-90"
                    }`}
                  >
                    Buy Coins
                  </Link>

                </div>
              )}

            </div>
          </header>

          {/* MAIN */}
          <main className="flex-1">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="text-center text-xs opacity-40 py-6 border-t border-white/10">
            © {new Date().getFullYear()} FollowOps – All rights reserved.
          </footer>

        </div>
      </body>
    </html>
  );
}