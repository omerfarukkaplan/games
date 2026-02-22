"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function GaslightGame() {
  const [cases, setCases] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    const { data } = await supabase
      .from("scenarios")
      .select("*")
      .eq("game_type", "gaslight");

    if (data) setCases(data);
  };

  const handleAnswer = (answer: boolean) => {
    if (!cases[index]) return;

    if (answer === cases[index].correct) {
      setStreak(streak + 1);
      setIndex((prev) => (prev + 1) % cases.length);
    } else {
      setGameOver(true);
    }
  };

  if (!cases[index]) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      {!gameOver ? (
        <>
          <h1 className="text-2xl mb-6">Gaslight Test</h1>
          <div className="bg-white/10 p-6 rounded-xl text-center mb-6">
            {cases[index].text}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-yellow-600 px-6 py-3 rounded-xl"
            >
              Gaslighting
            </button>

            <button
              onClick={() => handleAnswer(false)}
              className="bg-blue-600 px-6 py-3 rounded-xl"
            >
              Normal
            </button>
          </div>

          <div className="mt-6">Streak: {streak}</div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl mb-4">You Missed It</h2>
          <p>Final streak: {streak}</p>
        </div>
      )}
    </div>
  );
}