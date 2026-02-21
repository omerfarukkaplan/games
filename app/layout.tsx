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
      const paddleScript = document.createElement("script")
      paddleScript.src = "https://cdn.paddle.com/paddle/v2/paddle.js"
      paddleScript.async = true
      paddleScript.onload = () => {
        if (window.Paddle) {
          window.Paddle.Environment.set("sandbox") // 🚨 Production'da bunu kaldıracağız

          window.Paddle.Initialize({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
          })
        }
      }
      document.body.appendChild(paddleScript)
    }
  }, [])

  return (
    <html lang="en">
      <body className="bg-[#0c0c0c] text-white min-h-screen">

        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute w-[600px] h-[600px] bg-pink-600/20 blur-3xl rounded-full top-[-200px] left-[-200px]" />
          <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-3xl rounded-full bottom-[-200px] right-[-200px]" />
        </div>

        {children}

      </body>
    </html>
  )
}