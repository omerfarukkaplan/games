"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function ReactionGame() {
  const [status, setStatus] = useState<"idle" | "waiting" | "ready" | "done">("idle")
  const [startTime, setStartTime] = useState<number>(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)

  useEffect(() => {
    if (status === "waiting") {
      const delay = Math.random() * 2000 + 1000
      const timer = setTimeout(() => {
        setStatus("ready")
        setStartTime(Date.now())
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [status])

  const handleClick = async () => {
    if (status === "idle") {
      setStatus("waiting")
      setReactionTime(null)
    }

    if (status === "waiting") {
      setStatus("idle")
      alert("Too early!")
    }

    if (status === "ready") {
      const time = Date.now() - startTime
      setReactionTime(time)
      setStatus("done")

      // 🔐 Secure reward via RPC
      await supabase.rpc("add_reward", {
        reward_coins: 5,
        reward_xp: 10
      })
    }

    if (status === "done") {
      setStatus("idle")
      setReactionTime(null)
    }
  }

  const bgColor =
    status === "idle"
      ? "bg-gray-700"
      : status === "waiting"
      ? "bg-red-600"
      : status === "ready"
      ? "bg-green-500"
      : "bg-purple-600"

  return (
    <div
      onClick={handleClick}
      className={`${bgColor} mt-8 h-64 rounded-xl flex items-center justify-center text-white text-2xl font-bold cursor-pointer transition-all duration-200`}
    >
      {status === "idle" && "Click to start"}
      {status === "waiting" && "Wait for green..."}
      {status === "ready" && "CLICK!"}
      {status === "done" && `Your reaction: ${reactionTime} ms (click to reset)`}
    </div>
  )
}