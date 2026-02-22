"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LastMessageGame() {
  const [cases, setCases] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [percent, setPercent] = useState<number | null>(null);
  const [coins, setCoins] = useState(0);
  const [continueCost, setContinueCost] = useState(50);

  useEffect(() => {
    loadCases();
    fetchCoins();
  }, []);

  const loadCases = async () => {
    const { data } = await supabase
      .from("scenarios")
      .select("*")
      .eq("game_type", "lastmessage")
      .order("difficulty", { ascending: true });

    if (data) setCases(data);
  };

  const fetchCoins = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user.id)
      .single();

    if (data) setCoins(data.coins);
  };

  const calculateContinueCost = (s: number) => {
    if (s <= 5) return 50;
    if (s <= 10) return 75;
    if (s <= 15) return 100;
    return 125;
  };

  const handleAnswer = async (answer: boolean) => {
    const current = cases[index];

    if (answer === current.correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setContinueCost(calculateContinueCost(newStreak));

      if (index + 1 < cases.length) {
        setIndex(index + 1);
      } else {
        setIndex(0);
      }
    } else {
      setGameOver(true);

      await supabase.rpc("update_streak_distribution", {
        streak_input: streak,
      });

      const { data } = await supabase.rpc("get_percentile", {
        streak_input: streak,
      });

      setTimeout(() => {
        setPercent(Math.round(data));
      }, 800);
    }
  };

  const handleContinue = async () => {
    if (coins < continueCost) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("profiles")
      .update({ coins: coins - continueCost })
      .eq("id", user?.id);

    setCoins(coins - continueCost);
    setGameOver(false);
    setPercent(null);
  };

  const resetRun = () => {
    setStreak(0);
    setContinueCost(50);
    setGameOver(false);
    setPercent(null);
  };

  if (!cases[index]) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      {!gameOver ? (
        <>
          <div className="text-sm opacity-60 mb-4">
            LAST MESSAGE
          </div>

          <div className="bg-white/10 p-6 rounded-xl text-xl text-center mb-6">
            {cases[index].text}
          </div>

          <div className="text-lg mb-4">
            What happened?
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-red-600 py-3 rounded-xl"
            >
              They broke up / cheated
            </button>

            <button
              onClick={() => handleAnswer(false)}
              className="bg-green-600 py-3 rounded-xl"
            >
              It was innocent
            </button>
          </div>

          <div className="mt-6">Streak: {streak}</div>
        </>
      ) : (
        <div className="text-center">

          {!percent && (
            <div className="text-xl opacity-70">
              Analyzing what you miss...
            </div>
          )}

          {percent && (
            <>
              <div className="text-4xl font-bold text-red-500 mb-4">
                You beat {percent}% of players
              </div>

              <div className="mb-4 opacity-70">
                {streak < 5
                  ? "You trust too fast."
                  : streak < 10
                  ? "You ignore subtle endings."
                  : "You read between the lines."}
              </div>

              <button
                onClick={handleContinue}
                className="bg-yellow-500 text-black px-6 py-3 rounded-xl mb-4"
              >
                Continue – {continueCost} Coins
              </button>

              <button
                onClick={resetRun}
                className="underline"
              >
                New Run
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}