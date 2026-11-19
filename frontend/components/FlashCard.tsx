"use client";
import { Btn, Card, Play } from "./ui";

export type FlashItem = { text: string; translation: string; audioUrl?: string | null };

/** The flashcard used in lessons (Practise tab) and on the homepage demo. Pass onAgain to show "Again later". */
export default function FlashCard({ item, index, total, revealed, onReveal, onNext, onAgain, nextLabel = "Got it ✓" }: {
  item: FlashItem; index: number; total: number; revealed: boolean;
  onReveal: () => void; onNext: () => void; onAgain?: () => void; nextLabel?: string;
}) {
  return (
    <Card className="text-center space-y-5 py-8">
      <p className="text-xs text-white/50">Card {index + 1} of {total}</p>
      <div className="flex justify-center items-center gap-4"><p className="font-display text-4xl font-bold">{item.text}</p><Play src={item.audioUrl || undefined} /></div>
      {revealed ? <p className="text-2xl text-accent">{item.translation}</p> : <Btn variant="ghost" onClick={onReveal}>Reveal meaning</Btn>}
      {revealed && <div className="flex gap-3 justify-center">
        {onAgain && <Btn variant="ghost" onClick={onAgain}>Again later</Btn>}
        <Btn onClick={onNext}>{nextLabel}</Btn></div>}
    </Card>
  );
}
