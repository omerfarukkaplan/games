"use client";

export default function BuyCoins() {
  const handleBuy = async () => {
    const res = await fetch("/api/create-transaction", {
      method: "POST",
    });

    const data = await res.json();

    if (!data?.checkout_url) {
      console.error("Checkout URL missing:", data);
      alert("Payment system error.");
      return;
    }

    window.location.href = data.checkout_url;
  };

  return (
    <button
      onClick={handleBuy}
      className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-xl font-bold text-black hover:scale-105 transition"
    >
      Buy Coins
    </button>
  );
}