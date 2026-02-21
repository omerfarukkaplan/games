"use client"

export default function BuyCoins({ userId }: { userId: string }) {

  const buy = (coins: number) => {
    window.location.href = `https://sandbox.paddle.com/checkout?custom_data[user_id]=${userId}&custom_data[coins]=${coins}`
  }

  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      <button onClick={() => buy(1000)} className="premium-card p-4">1000 Coins</button>
      <button onClick={() => buy(3000)} className="premium-card p-4">3000 Coins</button>
      <button onClick={() => buy(10000)} className="premium-card p-4">10000 Coins</button>
    </div>
  )
}