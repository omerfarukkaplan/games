"use client"

import "./globals.css"
import { useEffect } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script")
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js"
      script.async = true
      script.onload = () => {
        if (window.Paddle) {
          window.Paddle.Environment.set("sandbox")

          window.Paddle.Initialize({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
          })
        }
      }
      document.body.appendChild(script)
    }
  }, [])

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}