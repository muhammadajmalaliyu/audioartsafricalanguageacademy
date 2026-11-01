"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useRequire } from "@/lib/auth";
import { Card, Err, Spin } from "@/components/ui";

export default function Course() {
  const { id } = useParams() as any; const { ok } = useRequire();
  const [d, setD] = useState<any>(null); const [err, setErr] = useState("");
  useEffect(() => { if (ok) api(`/courses/${id}`).then(setD).catch(e => setErr(e.message)); }, [ok, id]);
  if (!d) return err ? <Err m={err} /> : <Spin />;
  return (
    <div className="space-y-6">
      <Link href="/courses" className="text-sm text-white/60 hover:text-white">← All courses</Link>
      <div><span className="text-xs uppercase tracking-wider text-brand">{d.course.language?.name} · {d.course.level}</span>
        <h1 className="font-display text-3xl font-bold">{d.course.title}</h1><p className="text-white/70 mt-1">{d.course.description}</p></div>
      {d.modules.map((m: any) => (
        <Card key={m._id}>
          <h2 className="font-display font-semibold text-lg mb-3">{m.title}</h2>
          <div className="divide-y divide-white/10">
            {d.lessons.filter((l: any) => l.module === m._id).map((l: any) => {
              const p = d.progress[l._id];
              return (
                <Link key={l._id} href={`/lessons/${l._id}`} className="flex items-center gap-3 py-3 hover:text-brand">
                  <span className={`h-7 w-7 rounded-full grid place-items-center text-sm ${p?.completed ? "bg-emerald-400 text-navy-900" : "bg-white/10"}`}>{p?.completed ? "✓" : "•"}</span>
                  <span className="flex-1 font-medium">{l.title}</span>
                  {p?.bestScore > 0 && <span className="text-xs text-accent">Best {p.bestScore}%</span>}
                </Link>);
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
