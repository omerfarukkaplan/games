"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import ReactionGame from "./ReactionGame"
import BuyCoins from "./BuyCoins"

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .single()

    if (data) setProfile(data)
  }

  if (!profile) return null

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#151515] p-8 rounded-2xl shadow-2xl border border-[#222]"
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Welcome back 🚀
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat label="Coins" value={profile.coins} />
          <Stat label="Level" value={profile.level} />
          <Stat label="XP" value={profile.xp} />
          <Stat label="Streak" value={profile.streak} />
        </div>
      </motion.div>

      {/* 🔥 BUY COINS BURADA */}
      <BuyCoins userId={profile.id} />

      {/* GAME */}
      <div className="mt-10">
        <ReactionGame />
      </div>

    </div>
  )
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl text-center border border-[#222] shadow-lg">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}