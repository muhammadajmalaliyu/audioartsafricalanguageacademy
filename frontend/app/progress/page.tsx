"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRequire } from "@/lib/auth";
import { Card, Err, Spin } from "@/components/ui";

export default function Progress() {
  const { ok, user } = useRequire(); const [p, setP] = useState<any>(null); const [err, setErr] = useState("");
  useEffect(() => { if (ok) api("/me/progress").then(setP).catch(e => setErr(e.message)); }, [ok]);
  if (!p) return err ? <Err m={err} /> : <Spin />;
  const S = [["Lessons completed", p.completed], ["Lessons started", p.started], ["Average score", p.avgScore + "%"]];
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">{user.name}’s progress</h1>
      <div className="grid sm:grid-cols-3 gap-4">{S.map(([l, v]) => <Card key={l}><p className="text-white/60 text-sm">{l}</p><p className="font-display text-4xl font-bold text-accent">{v}</p></Card>)}</div>
      <Card><h2 className="font-display font-semibold mb-3">Recent quiz attempts</h2>
        {p.recent.length ? p.recent.map((a: any, i: number) => <div key={i} className="flex justify-between py-2 border-t border-white/10 text-sm"><span>{a.lesson}</span><span className="text-white/60">{new Date(a.date).toLocaleDateString()}</span><span className="font-semibold">{a.score}/{a.total}</span></div>) : <p className="text-white/60 text-sm">No quizzes taken yet.</p>}</Card>
    </div>
  );
}
