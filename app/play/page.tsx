export const dynamic = "force-dynamic";

import GameSelector from "@/components/GameSelector";

export default function PlayPage() {
  return (
    <main className="p-10 min-h-screen">
      <GameSelector />
    </main>
  );
}