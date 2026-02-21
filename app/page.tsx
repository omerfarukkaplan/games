"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import AuthForm from "@/features/auth/AuthForm"
import Dashboard from "@/components/Dashboard"

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(()=>{
    supabase.auth.getUser().then(({ data })=>{
      setUser(data.user)
    })
  },[])

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <AuthForm />
      </main>
    )
  }

  return <Dashboard />
}