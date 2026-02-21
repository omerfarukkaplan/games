"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Dashboard from "@/components/Dashboard"
import AuthForm from "@/features/auth/AuthForm"

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function checkSession() {
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
    setLoading(false)
  }

  if (loading) return null

  if (!session) return <AuthForm />

  return <Dashboard />
}