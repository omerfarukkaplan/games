"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import ReactionGame from "./ReactionGame"

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .single()

      setProfile(data)
    }

    loadProfile()
  }, [])

  if (!profile) return null

  return (
    <div className="max-w-5xl mx-auto p-8">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-6 rounded-xl glow"
      >
        <h2 className="text-2xl font-bold mb-4">
          Welcome back 🚀
        </h2>

        <div className="grid grid-cols-4 gap-4">
          <Stat label="Coins" value={profile.coins} />
          <Stat label="Level" value={profile.level} />
          <Stat label="XP" value={profile.xp} />
          <Stat label="Streak" value={profile.streak} />
        </div>

      </motion.div>

      <ReactionGame />

    </div>
  )
}

function Stat({ label, value }: any) {
  return (
    <div className="premium-card p-4 rounded-lg text-center">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  )
}