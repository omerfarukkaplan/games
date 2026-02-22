"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ViralGameEngine() {
  const [episode, setEpisode] = useState(1);
  const [cases, setCases] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [percent, setPercent] = useState<number | null>(null);

  useEffect(() => {
    loadEpisode();
  }, [episode]);

  const loadEpisode = async () => {
    const { data } = await supabase
      .from("scenarios")
      .select("*")
      .eq("game_type", "liedetector")
      .eq("episode", episode)
      .order("difficulty", { ascending: true });

    if (data) {
      setCases(data);
      setCurrentIndex(0);
    }
  };

  const handleAnswer = async (answer: boolean) => {
    const current = cases[currentIndex];

    if (answer === current.correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      if (currentIndex + 1 < cases.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setEpisode(episode + 1);
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

  const resetRun = () => {
    setEpisode(1);
    setStreak(0);
    setGameOver(false);
    setPercent(null);
  };

  if (!cases[currentIndex]) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      {!gameOver ? (
        <>
          <div className="text-xl opacity-60 mb-2">
            Episode {episode}
          </div>

          <div className="text-2xl mb-6 text-center">
            {cases[currentIndex].text}
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-green-600 px-6 py-3 rounded-xl"
            >
              Truth
            </button>

            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-600 px-6 py-3 rounded-xl"
            >
              Lie
            </button>
          </div>

          <div className="mt-6">Streak: {streak}</div>
        </>
      ) : (
        <div className="text-center">

          {!percent && (
            <div className="text-xl opacity-70">
              Analyzing your relationship IQ...
            </div>
          )}

          {percent && (
            <>
              <div className="text-5xl font-bold text-red-500 mb-4">
                You beat {percent}% of players
              </div>

              <button
                onClick={resetRun}
                className="bg-yellow-500 text-black px-6 py-3 rounded-xl"
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