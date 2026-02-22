"use client";

import Link from "next/link";

export default function Dashboard({ profile }: any) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent">
          Welcome back 🚀
        </h1>

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <Stat title="Coins" value={profile?.coins || 0} />
          <Stat title="Level" value={Math.floor((profile?.xp || 0) / 200)} />
          <Stat title="XP" value={profile?.xp || 0} />
          <Stat title="Streak" value={profile?.streak || 0} />

        </div>

        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center">

          <h2 className="text-2xl font-semibold mb-6">
            Buy instant coins 🚀
          </h2>

          <button
            onClick={async () => {
              const res = await fetch("/api/create-transaction", {
                method: "POST",
              });
              const data = await res.json();
              window.location.href = data.checkout_url;
            }}
            className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:scale-105 transition"
          >
            Buy 1000 Coins – $5
          </button>

        </div>

      </div>
    </main>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center">
      <p className="opacity-60 mb-2">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}