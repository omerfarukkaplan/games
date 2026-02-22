"use client";

import { useSearchParams } from "next/navigation";
import LastMessageGame from "@/components/LastMessageGame";
import RedFlagGame from "@/components/RedFlagGame";
import LieDetectorGame from "@/components/LieDetectorGame";
import GaslightGame from "@/components/GaslightGame";
import NarcissistGame from "@/components/NarcissistGame";

export default function PlayPage() {
  const searchParams = useSearchParams();
  const game = searchParams.get("game");

  const renderGame = () => {
    switch (game) {
      case "redflag":
        return <RedFlagGame />;

      case "liedetector":
        return <LieDetectorGame />;

      case "gaslight":
        return <GaslightGame />;

      case "narcissist":
        return <NarcissistGame />;

      case "lastmessage":
      default:
        return <LastMessageGame />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {renderGame()}
    </div>
  );
}