"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ImpactStats({ compact = false }: { compact?: boolean }) {
  const [d, setD] = useState<any>(null);
  useEffect(() => { api("/impact").then(setD).catch(() => {}); }, []);
  const all = d ? [
    ["🎧", "Words & phrases recorded", d.wordsRecorded], ["📚", "Lessons published", d.lessons], ["🗣️", "Languages", d.languages],
    ["🎓", "Learners", d.learners], ["🔥", "Active learners (30 days)", d.activeLearners], ["✅", "Quizzes taken", d.quizAttempts],
    ["🎙️", "Volunteer voices", d.volunteerVoices],
  ] : [];
  const items = compact ? all.slice(0, 4) : all;
  if (!d) return <p className="text-center text-white/50 text-sm py-6">Loading live numbers…</p>;
  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-4"}`}>
      {items.map(([i, l, v]: any) => (
        <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-center">
          <div className="text-2xl">{i}</div>
          <p className="font-display text-3xl md:text-4xl font-bold text-accent mt-1">{Number(v).toLocaleString()}</p>
          <p className="text-xs md:text-sm text-white/65 mt-1">{l}</p>
        </div>))}
    </div>
  );
}
