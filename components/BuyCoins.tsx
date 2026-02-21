"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    Paddle: any
  }
}

export default function BuyCoins({ userId }: { userId: string }) {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  const PRICE_ID = "pri_01kj10pm3304a7oq4t0hsif0r0" // senin sandbox price

  useEffect(() => {
    if (typeof window !== "undefined") {
      const check = setInterval(() => {
        if (window.Paddle) {
          setReady(true)
          clearInterval(check)
        }
      }, 300)
    }
  }, [])

  function openCheckout() {
    if (!window.Paddle) {
      alert("Paddle not loaded")
      return
    }

    setLoading(true)

    window.Paddle.Checkout.open({
      items: [{ priceId: PRICE_ID, quantity: 1 }],
      customData: {
        user_id: userId,
      },
    })

    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div
      style={{
        marginTop: 40,
        padding: 32,
        background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
        borderRadius: 20,
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Buy Coins 💰
      </h2>

      <p style={{ opacity: 0.9, marginBottom: 24 }}>
        Get instant coins and continue playing
      </p>

      <button
        onClick={openCheckout}
        disabled={!ready || loading}
        style={{
          padding: "14px 32px",
          fontSize: 18,
          fontWeight: 700,
          borderRadius: 12,
          background: "#000",
          color: "#fff",
          cursor: "pointer",
          opacity: !ready ? 0.5 : 1,
        }}
      >
        {loading ? "Opening..." : "Buy 1000 Coins – $5"}
      </button>

      {!ready && (
        <p style={{ marginTop: 12, fontSize: 12 }}>
          Loading payment system...
        </p>
      )}
    </div>
  )
}