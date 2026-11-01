"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRequire } from "@/lib/auth";
import { Bar, Card, Err, Spin } from "@/components/ui";

export default function Courses() {
  const { ok, user } = useRequire();
  const [courses, setC] = useState<any[] | null>(null); const [ann, setA] = useState<any[]>([]); const [err, setErr] = useState("");
  useEffect(() => { if (ok) { api("/courses").then(setC).catch(e => setErr(e.message)); api("/announcements").then(setA).catch(() => {}); } }, [ok]);
  if (!ok || !courses) return err ? <Err m={err} /> : <Spin />;
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Sannu, {user.name.split(" ")[0]} 👋</h1>
      {ann.map(a => <Card key={a._id} className="border-accent/40"><p className="font-semibold text-accent">📢 {a.title}</p><p className="text-white/75 text-sm mt-1">{a.body}</p></Card>)}
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map(c => (
          <Link key={c._id} href={`/courses/${c._id}`}><Card className="hover:border-brand/60 transition h-full">
            <span className="text-xs uppercase tracking-wider text-brand">{c.language?.name} · {c.level}</span>
            <h2 className="font-display text-xl font-semibold mt-1">{c.title}</h2>
            <p className="text-white/65 text-sm mt-1 mb-4">{c.description}</p>
            <Bar pct={c.lessons ? (100 * c.completed) / c.lessons : 0} />
            <p className="text-xs text-white/60 mt-2">{c.completed}/{c.lessons} lessons complete</p>
          </Card></Link>
        ))}
        {!courses.length && <p className="text-white/60">No courses are published yet — check back soon.</p>}
      </div>
    </div>
  );
}
