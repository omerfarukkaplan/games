"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Leaderboard() {
  const [players, setPlayers] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("leaderboard")
        .select("*")

      setPlayers(data || [])
    }

    load()
  }, [])

  return (
    <div className="mt-12">
      <h3 className="text-xl mb-4">Top Players</h3>
      {players.map((p, i) => (
        <div key={p.id} className="flex justify-between premium-card p-3 mb-2">
          <span>#{i + 1}</span>
          <span>Level {p.level}</span>
          <span>{p.xp} XP</span>
        </div>
      ))}
    </div>
  )
}