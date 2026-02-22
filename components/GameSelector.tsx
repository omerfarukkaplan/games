"use client";

import { useState } from "react";
import RedFlagGame from "./RedFlagGame";
import GaslightGame from "./GaslightGame";
import NarcissistGame from "./NarcissistGame";
import LieDetectorGame from "./LieDetectorGame";
import LastMessageGame from "./LastMessageGame";
import ReactionGame from "./ReactionGame";

export default function GameSelector() {
  const [game, setGame] = useState("redflag");

  return (
    <div>
      <div className="flex gap-4 mb-8 flex-wrap">
        {[
          "redflag",
          "gaslight",
          "narcissist",
          "liedetector",
          "lastmessage",
          "reaction",
        ].map((g) => (
          <button
            key={g}
            onClick={() => setGame(g)}
            className="px-4 py-2 bg-white/10 rounded-xl hover:bg-pink-500 transition"
          >
            {g}
          </button>
        ))}
      </div>

      {game === "redflag" && <RedFlagGame />}
      {game === "gaslight" && <GaslightGame />}
      {game === "narcissist" && <NarcissistGame />}
      {game === "liedetector" && <LieDetectorGame />}
      {game === "lastmessage" && <LastMessageGame />}
      {game === "reaction" && <ReactionGame />}
    </div>
  );
}