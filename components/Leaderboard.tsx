"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    const { data } = await supabase
      .from("leaderboard")
      .select("best_streak, weekly_points")
      .order("weekly_points", { ascending: false })
      .limit(10);

    if (data) setLeaders(data);
  };

  return (
    <div>
      {leaders.map((l, i) => (
        <div key={i}>
          #{i + 1} – {l.weekly_points}
        </div>
      ))}
    </div>
  );
}