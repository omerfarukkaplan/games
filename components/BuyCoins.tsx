"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Paddle: any;
  }
}

export default function BuyCoins() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;

    script.onload = () => {
      window.Paddle.Environment.set("sandbox");

      window.Paddle.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      });

      setReady(true);
    };

    document.body.appendChild(script);
  }, []);

  const openCheckout = () => {
    if (!ready) return;

    window.Paddle.Checkout.open({
      items: [
        {
          priceId: "pri_01kj10pm3304a7oq4t0hs1f0r0",
          quantity: 1,
        },
      ],

      customer: {
        email: "test@example.com",
      },

      customData: {
        userId: "test-user",
      },

      settings: {
        displayMode: "overlay",
        theme: "dark",
        successUrl: "https://followops.app",
      },
    });
  };

  return (
    <div className="premium-card p-6 rounded-xl text-center mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Buy instant coins 🚀
      </h3>

      <button
        onClick={openCheckout}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold"
      >
        Buy 1000 Coins – $5
      </button>
    </div>
  );
}