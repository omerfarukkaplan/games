"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) alert(error.message)
    else location.reload()
  }

  async function register() {
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) alert(error.message)
    else alert("Check email for verification")
  }

  return (
    <div className="premium-card p-6 rounded-xl w-80 glow">
      <h2 className="text-xl mb-4 font-semibold">Welcome to FollowOps</h2>
      <input
        className="w-full p-2 mb-3 bg-black border border-gray-700 rounded"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full p-2 mb-3 bg-black border border-gray-700 rounded"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />
      <button onClick={login} className="w-full bg-pink-600 py-2 rounded mb-2">
        Login
      </button>
      <button onClick={register} className="w-full bg-gray-800 py-2 rounded">
        Register
      </button>
    </div>
  )
}