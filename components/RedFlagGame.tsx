"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

const CASES = [
  { text: "He hides his phone when you walk in.", flag: true },
  { text: "She likes old photos of her ex.", flag: true },
  { text: "He forgets to reply sometimes.", flag: false },
  { text: "She says you're too sensitive.", flag: true },
  { text: "He works late often.", flag: false },
  { text: "She has a secret Instagram account.", flag: true },
];

export default function RedFlagGame() {
  const searchParams = useSearchParams();
  const challenge = searchParams.get("challenge");

  const [profile, setProfile] = useState<any>(null);
  const [current, setCurrent] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);

  useEffect(() => {
    fetchProfile();
    nextCase();
  }, []);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) setProfile(data);
  };

  const nextCase = () => {
    const random = CASES[Math.floor(Math.random() * CASES.length)];
    setCurrent(random);
  };

  const handleAnswer = async (answer: boolean) => {
    if (!current) return;

    if (answer === current.flag) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      if (newStreak % 5 === 0) {
        setShowMilestone(true);
      }

      nextCase();
    } else {
      setGameOver(true);

      if (profile) {
        await supabase.rpc("update_best_streak", {
          user_id_input: profile.id,
          streak_input: streak,
        });
      }
    }
  };

  const handleContinue = async () => {
    if (!profile) return;

    if (profile.coins >= 50) {
      await supabase
        .from("profiles")
        .update({ coins: profile.coins - 50 })
        .eq("id", profile.id);

      setGameOver(false);
      nextCase();
    }
  };

  const shareResult = async () => {
    const url = `https://followops.app/play?challenge=${streak}`;
    const text = `I spotted ${streak} red flags 🚩. Can you beat me?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Red Flag Challenge",
          text,
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      alert("Copied!");
    }
  };

  if (!current) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      {challenge && (
        <div className="mb-6 text-red-500 font-bold text-xl">
          🔥 Challenge: Beat {challenge}
        </div>
      )}

      {!gameOver ? (
        <>
          <div className="text-2xl mb-8 text-center">
            {current.text}
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-red-600 px-6 py-3 rounded-xl"
            >
              🚩 Red Flag
            </button>

            <button
              onClick={() => handleAnswer(false)}
              className="bg-green-600 px-6 py-3 rounded-xl"
            >
              ✅ Not a Red Flag
            </button>
          </div>

          <div className="mt-8 text-lg">
            Streak: {streak}
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="text-5xl font-bold text-red-500 mb-4">
            YOU WOULD GET CHEATED ON.
          </div>

          <div className="mb-6">
            Final Streak: {streak}
          </div>

          <button
            onClick={handleContinue}
            className="bg-yellow-500 px-6 py-3 rounded-xl mb-4"
          >
            Continue (50 Coins)
          </button>

          <div>
            <button
              onClick={shareResult}
              className="underline"
            >
              Share Challenge
            </button>
          </div>
        </div>
      )}

      {showMilestone && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-xl text-center">
            <div className="text-2xl mb-4">
              Only 6% reach {streak} 🔥
            </div>

            <button
              onClick={shareResult}
              className="bg-red-600 px-6 py-3 rounded-xl"
            >
              Share
            </button>

            <div
              onClick={() => setShowMilestone(false)}
              className="mt-4 underline cursor-pointer"
            >
              Keep Playing
            </div>
          </div>
        </div>
      )}
    </div>
  );
}