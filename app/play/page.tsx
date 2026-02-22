import LastMessageGame from "@/components/LastMessageGame";
import RedFlagGame from "@/components/RedFlagGame";
import LieDetectorGame from "@/components/LieDetectorGame";
import GaslightGame from "@/components/GaslightGame";
import NarcissistGame from "@/components/NarcissistGame";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: { game?: string };
};

export default function PlayPage({ searchParams }: Props) {
  const game = searchParams?.game || "lastmessage";

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      {game === "lastmessage" && <LastMessageGame />}
      {game === "redflag" && <RedFlagGame />}
      {game === "liedetector" && <LieDetectorGame />}
      {game === "gaslight" && <GaslightGame />}
      {game === "narcissist" && <NarcissistGame />}
    </main>
  );
}